const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('__JANDOCITY_ELECTRON__', {
  isElectron: true,
  checkForUpdate: () => ipcRenderer.invoke('check-for-update'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getVersion: () => ipcRenderer.invoke('app-version'),
  isPackaged: () => ipcRenderer.invoke('is-packaged'),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (_e, v) => cb(v)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (_e, v) => cb(v)),
  onUpdateProgress: (cb) => ipcRenderer.on('update-progress', (_e, v) => cb(v)),
  onUpdateError: (cb) => ipcRenderer.on('update-error', (_e, v) => cb(v)),
})
