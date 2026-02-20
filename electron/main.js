const { app, BrowserWindow, dialog, systemPreferences } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const url = require('url');

let mainWindow = null;
let pythonProcess = null;
let frontendServer = null;

const BACKEND_PORT = 8053;
const FRONTEND_PORT = 3001;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain',
    '.map': 'application/json',
    '.rsc': 'text/x-component',
};

function startFrontendServer() {
    const outDir = app.isPackaged
        ? path.join(process.resourcesPath, 'out')
        : path.join(__dirname, '..', 'out');

    return new Promise((resolve, reject) => {
        frontendServer = http.createServer((req, res) => {
            let pathname = decodeURIComponent(url.parse(req.url).pathname);

            if (pathname === '/' || pathname === '/dashboard') {
                pathname = '/dashboard.html';
            }

            let filePath = path.join(outDir, pathname);

            if (!filePath.startsWith(outDir)) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }

            if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {

            } else if (fs.existsSync(filePath + '.html')) {
                filePath = filePath + '.html';
            } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                const indexPath = path.join(filePath, 'index.html');
                if (fs.existsSync(indexPath)) {
                    filePath = indexPath;
                }
            } else {
                filePath = path.join(outDir, 'dashboard.html');
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('Not Found');
                    return;
                }
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(data);
            });
        });

        frontendServer.listen(FRONTEND_PORT, () => {
            console.log(`Frontend server running at ${FRONTEND_URL}`);
            resolve();
        });

        frontendServer.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${FRONTEND_PORT} in use, trying ${FRONTEND_PORT + 1}...`);
                frontendServer.listen(FRONTEND_PORT + 1);
            } else {
                reject(err);
            }
        });
    });
}

function getBackendPath() {
    if (app.isPackaged) {
        const resourcesPath = process.resourcesPath;
        const binaryName = process.platform === 'win32' ? 'glide.exe' : 'glide';
        return path.join(resourcesPath, 'engine-dist', 'glide', binaryName);
    }
    return null;
}

function startBackend() {
    const binaryPath = getBackendPath();

    if (binaryPath) {
        console.log(`Starting bundled backend: ${binaryPath}`);
        pythonProcess = spawn(binaryPath, [], {
            cwd: path.dirname(binaryPath),
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env },
        });

        pythonProcess.stdout.on('data', (data) => {
            console.log(`[Engine] ${data.toString().trim()}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`[Engine] ${data.toString().trim()}`);
        });

        pythonProcess.on('error', (err) => {
            console.error('Failed to start backend:', err);
        });

        pythonProcess.on('exit', (code) => {
            console.log(`Backend exited with code ${code}`);
            pythonProcess = null;
        });
    } else {
        console.log('Dev mode: expecting backend to be running externally (python3 main.py)');
    }
}

function waitForBackend(retries = 60) {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        const check = () => {
            attempts++;
            const req = http.get(BACKEND_URL, (res) => {
                if (res.statusCode === 200) {
                    resolve();
                } else {
                    retry();
                }
            });

            req.on('error', () => {
                retry();
            });

            req.setTimeout(1000, () => {
                req.destroy();
                retry();
            });
        };

        const retry = () => {
            if (attempts >= retries) {
                reject(new Error('Backend failed to start within timeout'));
            } else {
                setTimeout(check, 1000);
            }
        };

        check();
    });
}

function getLoadingHTML() {

    let logoSrc = '';
    try {
        const logoPath = app.isPackaged
            ? path.join(process.resourcesPath, 'logo.jpeg')
            : path.join(__dirname, '..', 'build', 'logo.jpeg');
        if (fs.existsSync(logoPath)) {
            const logoData = fs.readFileSync(logoPath);
            logoSrc = `data:image/jpeg;base64,${logoData.toString('base64')}`;
        }
    } catch (e) {
        console.log('Could not load logo:', e.message);
    }

    const logoHTML = logoSrc
        ? `<img src="${logoSrc}" class="icon" alt="Glide" />`
        : `<div class="icon-fallback"></div>`;
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #0a0a0f;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          overflow: hidden;
        }
        .drag-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          -webkit-app-region: drag;
        }
        .container {
          text-align: center;
        }
        .icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          border-radius: 16px;
          object-fit: cover;
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
        }
        .icon-fallback {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          border-radius: 16px;
          background: linear-gradient(135deg, #301088, #7c3aed);
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
        }
        .logo {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #e2e0ff;
        }
        .subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          margin-bottom: 32px;
        }
        .progress-bar {
          width: 180px;
          height: 3px;
          background: rgba(124, 58, 237, 0.15);
          border-radius: 4px;
          overflow: hidden;
          margin: 0 auto;
        }
        .progress-fill {
          height: 100%;
          width: 30%;
          background: linear-gradient(90deg, #7c3aed, #a78bfa);
          border-radius: 4px;
          animation: loading 1.5s ease-in-out infinite;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 60%; }
          100% { transform: translateX(400%); width: 30%; }
        }
        .status {
          color: rgba(255,255,255,0.35);
          font-size: 11px;
          margin-top: 14px;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="drag-bar"></div>
      <div class="container">
        ${logoHTML}
        <div class="logo">Glide</div>
        <div class="subtitle">Gesture Control</div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="status">Starting engine...</div>
      </div>
    </body>
    </html>
  `;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        title: 'Glide',
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 15, y: 15 },
        backgroundColor: '#0a0a0f',
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(getLoadingHTML())}`);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.on('dom-ready', () => {
        const currentUrl = mainWindow.webContents.getURL();

        if (currentUrl && !currentUrl.startsWith('data:')) {
            mainWindow.webContents.insertCSS(`
                html, body { -webkit-app-region: no-drag !important; }
            `).catch(() => { });
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    if (!gotTheLock) return;

    createWindow();

    if (app.isPackaged) {
        await startFrontendServer();
    }

    if (process.platform === 'darwin') {
        const trusted = systemPreferences.isTrustedAccessibilityClient(true);
        console.log(`Accessibility permission: ${trusted ? 'granted' : 'not yet granted — user must enable in System Preferences'}`);
    }

    startBackend();

    try {
        await waitForBackend();
        console.log('Backend is ready.');
    } catch (err) {
        console.error(err.message);
        if (app.isPackaged) {
            dialog.showErrorBox(
                'Startup Error',
                'Could not connect to the Glide engine. The application will now close.'
            );
            app.quit();
            return;
        }
    }

    if (mainWindow) {
        const appUrl = app.isPackaged
            ? `${FRONTEND_URL}/dashboard`
            : 'http://localhost:3000/dashboard';
        mainWindow.loadURL(appUrl);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {

        createWindow();
        const appUrl = app.isPackaged
            ? `${FRONTEND_URL}/dashboard`
            : 'http://localhost:3000/dashboard';
        mainWindow.loadURL(appUrl);
    }
});

app.on('before-quit', () => {
    if (pythonProcess) {
        console.log('Stopping backend...');
        pythonProcess.kill('SIGTERM');
        setTimeout(() => {
            if (pythonProcess) {
                pythonProcess.kill('SIGKILL');
            }
        }, 3000);
    }

    if (frontendServer) {
        frontendServer.close();
    }
});
