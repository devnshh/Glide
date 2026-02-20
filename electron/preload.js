const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('glide', {
    platform: process.platform,
    isElectron: true,
});
