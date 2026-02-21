<div align="center">
  <h1>Glide</h1>
  
  <p>
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9" alt="Electron" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>

  <p>A sophisticated, AI-powered desktop control system powered by MediaPipe and React.</p>
</div>

Glide combines real-time computer vision with a modern, glassmorphism-styled dashboard for a seamless and futuristic user experience. Available as a standalone macOS desktop app or as a web-based dashboard.

## Features

### Computer Vision and AI
- **Real-Time Hand Tracking**: High-fidelity landmark detection using **MediaPipe**.
- **Customizable Gesture Recognition**: Custom Random Forest classifier (Scikit-learn) for high-accuracy gesture identification.
- **Data Collection Engine**: Capture landmark samples in real-time to train new gestures.
- **Instant Retraining**: Retrain the AI model directly from the UI to incorporate new gestures on-the-fly.

### Dynamic Desktop Control
- **Precision Cursor Control**: Smooth mouse movement using direct fingertip mapping with exponential smoothing.
- **Gesture-Based Clicking**:
    - **Left Click**: Short pinch gesture.
    - **Double Click**: Two rapid short pinches.
    - **Right Click**: Long hold pinch gesture.
- **Global Action Mapping**: Map specific gestures to a wide range of system actions.

### Comprehensive Action Library
- **Media Controls**: Play/Pause, Next Track, Previous Track, Mute.
- **Audio Management**: Volume Up, Volume Down.
- **Display Settings**: Brightness Up, Brightness Down.
- **Navigation**: Scroll Up, Scroll Down, Switch Tab, Switch Desktop Left/Right.
- **System Utilities**: Screenshot capture, Minimize Window.

### Professional Dashboard
- **Live Camera Feed**: Low-latency MJPEG video stream with real-time hand landmark overlays.
- **Real-Time Statistics**: Monitor FPS, total detections, actions executed, and model confidence scores.
- **System Status**: Instant feedback on camera status, model readiness, and WebSocket connectivity.
- **Gesture Management**: Create, edit, and delete gestures and their assigned actions.

### Desktop App (Electron)
- **Standalone macOS App**: Packaged as a `.dmg` installer with a native macOS look and feel.
- **Bundled Backend**: Python engine bundled via PyInstaller — no Python installation required.
- **Loading Screen**: Animated loading screen while the gesture engine initializes.
- **Single Instance**: Only one instance of the app can run at a time.

## Installation

### Option 1: macOS Desktop App (Recommended)

Download the latest `.dmg` from the [Releases](../../releases) page.

1. Open the `.dmg` file
2. Drag **Glide** to your **Applications** folder
3. Right-click the app → **Open** (required on first launch to bypass Gatekeeper)
4. Grant the required permissions (see [macOS Permissions](#macos-permissions) below)

> **Note**: The app is currently built for **Apple Silicon (arm64)** Macs only.

---

### macOS Permissions

Glide requires three macOS permissions to function fully. **Without these, most gesture actions will silently fail.**

#### 1. Camera (Auto-prompted)
- macOS will automatically prompt you on first launch
- Click **Allow** when asked

#### 2. Accessibility (Manual Setup Required)
This permission is needed for **cursor control, keyboard shortcuts, screenshot, scroll, and media key actions**.

1. Open **System Settings → Privacy & Security → Accessibility**
2. Click the **+** button
3. Navigate to and select **Glide.app**
4. Toggle it **ON**
5. **Restart Glide** for the permission to take effect

> You can open this settings page directly from Terminal:
> ```bash
> open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"
> ```

#### 3. Automation — System Events (Auto-prompted)
This permission is needed for **brightness control** (which uses AppleScript to send key events through System Events).

- macOS will prompt you the first time a brightness gesture is triggered
- Click **OK** to allow Glide to control System Events

#### Permission Summary

| Action | Permission Required | Auto-Prompted? |
|--------|-------------------|----------------|
| Volume Up/Down | None | — |
| Mute | None | — |
| Brightness Up/Down | Automation (System Events) | ✅ Yes |
| Play/Pause, Next/Prev Track | Accessibility | ❌ Manual |
| Cursor Control | Accessibility | ❌ Manual |
| Screenshot | Accessibility | ❌ Manual |
| Switch Tab / Desktop | Accessibility | ❌ Manual |
| Scroll Up/Down | Accessibility | ❌ Manual |
| Camera Feed | Camera | ✅ Yes |

> **Important**: If you rebuild the app from source, macOS invalidates the previous Accessibility permission (because the ad-hoc code signature changes). You will need to **remove the old Glide entry** and **re-add the new one** in Accessibility settings after each rebuild.

---

### Option 2: Docker (Web Dashboard)
Run the entire stack in isolated containers. **This avoids all Python version issues.**

```bash
docker-compose up --build
```
- **Dashboard**: http://localhost:3000
- **Engine API**: http://localhost:8053

### Option 3: Local Development

#### Prerequisites
- Python 3.9 – 3.11 (MediaPipe does not support Python 3.13)
- Node.js 18+
- Webcam

> **Python 3.13 Users**: MediaPipe does not support Python 3.13 yet. Use Docker or install Python 3.11 (`brew install python@3.11`).

#### 1. Backend (Engine)

```bash
cd engine
python3.11 -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 main.py
```
Backend runs at http://localhost:8053

#### 2. Frontend (Dashboard)

```bash
npm install
npm run dev
```
Dashboard runs at http://localhost:3000

## Building from Source

### Prerequisites
- Node.js 18+, npm
- Python 3.11 with pip
- PyInstaller (`pip install pyinstaller`)

### Build Steps

```bash
# 1. Bundle the Python backend
cd engine && pyinstaller glide.spec --distpath ../engine-dist --workpath ../build/pyinstaller --clean && cd ..

# 2. Build the Next.js static export
./node_modules/.bin/next build

# 3. Package the Electron app as a macOS DMG
./node_modules/.bin/electron-builder --mac
```

The output DMG will be in the `dist/` directory.

> **After installing a new build**, you must re-grant Accessibility permission (see [macOS Permissions](#macos-permissions)).

## Project Structure

```text
Glide/
├── engine/                      # AI & System Control Backend
│   ├── data/                    # Saved landmark samples (.npy)
│   ├── models/                  # Trained model weights (.pkl)
│   ├── main.py                  # FastAPI server & WebSocket orchestrator
│   ├── gesture_detector.py      # MediaPipe hand landmark extraction
│   ├── gesture_classifier.py    # Random Forest training & prediction
│   ├── mouse_controller.py      # Cursor movement & pinch-to-click
│   ├── desktop_controller.py    # Platform-specific system automation
│   ├── action_mapper.py         # Gesture-to-action mapping interface
│   ├── websocket_manager.py     # WebSocket connection management
│   ├── gestures.json            # Persistent gesture configuration
│   ├── glide.spec               # PyInstaller build specification
│   └── requirements.txt         # Python dependencies
├── electron/                    # Electron Shell
│   ├── main.js                  # App lifecycle, backend spawning, HTTP server
│   └── preload.js               # Secure bridge for renderer process
├── app/                         # Next.js App Router pages
├── components/                  # React UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities, config, and type definitions
├── build/                       # Build resources (icon, entitlements)
├── electron-builder.yml         # Electron Builder configuration
├── package.json                 # Node.js dependencies & scripts
└── readme.md                    # This file
```

## Usage Guide

1. **Launch**: Open Glide (or start backend + frontend for web mode).
2. **Verify**: Check that Camera, Model, and Connection indicators are active on the dashboard.
3. **Create Gestures**:
   - Go to the **Gestures** tab
   - Click **Add Gesture**, name it, and select a system action
   - Record hand landmark samples following the on-screen prompts
4. **Train**: Click **Retrain Model** to update the classifier with your new gesture data.
5. **Use**: Toggle **Start Detection** and use hand gestures to control your system.
6. **Cursor Mode**: Use the designated gesture to toggle cursor control on/off. Pinch to click.

## Troubleshooting

### Gestures detected but actions don't work
This is almost always a **permissions issue**. Check:
1. **System Settings → Privacy & Security → Accessibility** — is Glide listed and enabled?
2. **System Settings → Privacy & Security → Automation** — does Glide have System Events enabled?
3. Did you **restart the app** after granting Accessibility?

### Only volume works, nothing else
Volume uses direct AppleScript (no permissions needed). All other actions require Accessibility and/or Automation permissions. See [macOS Permissions](#macos-permissions).

### Camera feed freezes after navigating between pages
Refresh the page or toggle the camera off and on from the dashboard.

### App won't open — "damaged" or "unidentified developer"
The app is ad-hoc signed (no Apple Developer certificate). Right-click → **Open** on first launch to bypass Gatekeeper.

## Technical Stack

### Backend
- **FastAPI** — High-performance asynchronous API framework
- **MediaPipe** — Google's ML framework for real-time hand tracking
- **Scikit-learn** — Random Forest classifier for gesture recognition
- **OpenCV** — Real-time image processing and video streaming
- **PyAutoGUI** — Cross-platform GUI automation

### Frontend
- **Next.js** — React framework with static export for Electron
- **Tailwind CSS** — Utility-first styling with glassmorphism design
- **Framer Motion** — Production-ready animation library
- **Lucide React** — Clean, consistent icon set

### Desktop
- **Electron** — Cross-platform desktop app shell
- **PyInstaller** — Python-to-binary bundler for the backend engine
- **electron-builder** — macOS DMG packaging and distribution

## License
This project is licensed under the MIT License.
