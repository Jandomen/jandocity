const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')

const isDev = !app.isPackaged
// Offline-first: carga dist local, no requiere internet
const DIST_DIR = path.join(__dirname, '../dist')
const INDEX_HTML = path.join(DIST_DIR, 'index.html')

let win = null

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f172a',
    icon: path.join(__dirname, '../public/favicon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // offline: no remote module
    },
    show: false,
  })

  // Elimina menú en producción
  if (!isDev) win.removeMenu()

  if (isDev) {
    // dev: Vite server si está corriendo, fallback a dist
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
    win.loadURL(devUrl).catch(() => win.loadFile(INDEX_HTML))
    // win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(INDEX_HTML)
  }

  win.once('ready-to-show', () => win.show())

  // Links externos (si algún día hay) -> navegador sistema
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  // Previene navegación a http cuando es offline
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://') && isDev === false) {
      // permite file:// y data:, bloquea http navegación interna (mantiene offline)
      // pero permite si es para updater
    }
  })

  win.on('closed', () => { win = null })
}

// AutoUpdater - offline no molesta, solo check si hay internet
function setupAutoUpdater() {
  if (isDev) return // no check en dev
  // Usa GitHub Releases o URL genérica (ver package.json build.publish)
  // Por defecto busca en GitHub si configuraste publish, si no usa file local
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.allowDowngrade = false

  autoUpdater.on('update-available', (info) => {
    if (win) win.webContents.send('update-available', info)
    // descarga en background pero pregunta? AutoDownload false -> esperamos IPC
  })
  autoUpdater.on('update-not-available', () => {
    if (win) win.webContents.send('update-not-available')
  })
  autoUpdater.on('error', (err) => {
    if (win) win.webContents.send('update-error', err?.message || String(err))
  })
  autoUpdater.on('download-progress', (p) => {
    if (win) win.webContents.send('update-progress', p)
  })
  autoUpdater.on('update-downloaded', (info) => {
    if (win) win.webContents.send('update-downloaded', info)
  })

  // check inicial 4s después (si hay internet)
  setTimeout(() => {
    if (!win) return
    // solo si online
    // electron no tiene navigator.onLine, asumimos check siempre y que falle silencioso si offline
    autoUpdater.checkForUpdates().catch(() => {})
  }, 4000)

  // re-check cuando vuelve online (frontend avisa via IPC)
}

ipcMain.handle('check-for-update', async () => {
  try {
    const res = await autoUpdater.checkForUpdates()
    return { ok: true, info: res?.updateInfo || null }
  } catch (e) {
    return { ok: false, error: e.message }
  }
})
ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate()
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  }
})
ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall(false, true)
})
ipcMain.handle('app-version', () => app.getVersion())
ipcMain.handle('is-packaged', () => app.isPackaged)

app.whenReady().then(() => {
  createWindow()
  setupAutoUpdater()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Manejo errores offline silencioso
process.on('uncaughtException', (e) => {
  console.error('[main]', e)
})
