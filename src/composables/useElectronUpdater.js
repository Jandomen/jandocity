import { ref } from 'vue'

const status = ref('idle') // idle | checking | available | downloading | ready | error | upToDate
const progress = ref(0)
const remoteVersion = ref(null)
const localVersion = ref(null)
const pendingUpdate = ref(null)

function isElectron() {
  try { return !!window.__JANDOCITY_ELECTRON__?.isElectron } catch { return false }
}

export function useElectronUpdater() {
  async function checkForUpdates() {
    if (!isElectron()) return { skipped: 'not-electron' }
    status.value = 'checking'
    try {
      const v = await window.__JANDOCITY_ELECTRON__.getVersion().catch(() => null)
      if (v) localVersion.value = v
      const res = await window.__JANDOCITY_ELECTRON__.checkForUpdate()
      if (res?.ok && res?.info?.version) {
        const ver = res.info.version
        // compare con local
        if (ver !== localVersion.value) {
          remoteVersion.value = ver
          pendingUpdate.value = { version: ver, notes: res.info.releaseNotes || '' }
          status.value = 'available'
          return { available: true, version: ver }
        }
      }
      status.value = 'idle'
      return { upToDate: true }
    } catch (e) {
      status.value = 'error'
      return { error: e.message }
    }
  }

  async function downloadUpdate() {
    if (!isElectron()) return
    status.value = 'downloading'
    progress.value = 0
    try {
      const res = await window.__JANDOCITY_ELECTRON__.downloadUpdate()
      if (!res?.ok) throw new Error(res?.error || 'download failed')
      // progreso via events
      status.value = 'ready'
      return { ok: true }
    } catch (e) {
      status.value = 'error'
      return { error: e.message }
    }
  }

  async function installAndRestart() {
    try { await window.__JANDOCITY_ELECTRON__.installUpdate() } catch {}
  }

  function dismiss() {
    status.value = 'idle'
    pendingUpdate.value = null
  }

  function listen() {
    if (!isElectron()) return
    try {
      window.__JANDOCITY_ELECTRON__.onUpdateAvailable((info) => {
        remoteVersion.value = info?.version || null
        pendingUpdate.value = { version: info?.version, notes: info?.releaseNotes || '' }
        status.value = 'available'
      })
      window.__JANDOCITY_ELECTRON__.onUpdateDownloaded((info) => {
        remoteVersion.value = info?.version || remoteVersion.value
        status.value = 'ready'
        progress.value = 100
      })
      window.__JANDOCITY_ELECTRON__.onUpdateProgress((p) => {
        if (p?.percent) progress.value = Math.round(p.percent)
      })
      window.__JANDOCITY_ELECTRON__.onUpdateError(() => {
        status.value = 'error'
      })
    } catch {}
  }

  return { status, progress, remoteVersion, localVersion, pendingUpdate, isElectron, checkForUpdates, downloadUpdate, installAndRestart, dismiss, listen }
}
