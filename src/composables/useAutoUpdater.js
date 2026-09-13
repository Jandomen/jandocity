import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'

const status = ref('idle') // idle | checking | downloading | ready | error | upToDate
const progress = ref(0)
const remoteVersion = ref(null)
const localVersion = ref('0.0.0')
const THROTTLE_MS = 30 * 60 * 1000 // 30 min entre checks
const LAST_CHECK_KEY = 'jandocity-last-update-check'
const APPLIED_KEY = 'jandocity-applied-version'
const FAILED_KEY = 'jandocity-failed-version'

function canCheck() {
  if (!Capacitor.isNativePlatform()) return false
  if (!navigator.onLine) return false
  try {
    const last = parseInt(localStorage.getItem(LAST_CHECK_KEY) || '0', 10)
    if (Date.now() - last < THROTTLE_MS) return false
  } catch {}
  return true
}

async function getCurrentVersion() {
  try {
    const { CapacitorUpdater } = await import('@capgo/capacitor-updater')
    const cur = await CapacitorUpdater.current().catch(() => null)
    if (cur?.bundle?.version) return cur.bundle.version
    if (cur?.version) return cur.version
  } catch {}
  try { return localStorage.getItem(APPLIED_KEY) || '0.1.17' } catch { return '0.1.17' }
}

export function useAutoUpdater() {
  async function checkAndUpdate(force = false) {
    if (!Capacitor.isNativePlatform()) return { skipped: 'web' }
    if (!navigator.onLine) return { skipped: 'offline' }
    if (!force && !canCheck()) return { skipped: 'throttled' }

    status.value = 'checking'
    try { localStorage.setItem(LAST_CHECK_KEY, String(Date.now())) } catch {}

    try {
      const { CapacitorUpdater } = await import('@capgo/capacitor-updater')
      // Notifica que el bundle actual está OK — evita rollback de Capgo
      await CapacitorUpdater.notifyAppReady().catch(() => {})

      const currentVer = await getCurrentVersion()
      localVersion.value = currentVer

      // 1) intenta Capgo getLatest (si tienes channel configurado)
      let update = null
      try { update = await CapacitorUpdater.getLatest().catch(() => null) } catch {}
      if (update && update.version && update.version !== currentVer && update.url) {
        const failed = localStorage.getItem(FAILED_KEY)
        if (failed === update.version) { status.value = 'idle'; return { skipped: 'failed-before' } }
        remoteVersion.value = update.version
        status.value = 'downloading'
        const dl = await CapacitorUpdater.download({ url: update.url, version: update.version })
        if (dl) {
          await CapacitorUpdater.set(dl)
          try { localStorage.setItem(APPLIED_KEY, update.version) } catch {}
          status.value = 'ready'
          return { updated: true, version: update.version, restartOnNextLaunch: true }
        }
      }

      // 2) fallback manual: tu version.json en Vercel/Supabase
      const urls = [
        'https://jandocity.vercel.app/version.json',
        'https://adqhqvzkqdhujjipabgf.supabase.co/storage/v1/object/public/updates/manifest.json',
      ]
      for (const u of urls) {
        try {
          const res = await fetch(u, { cache: 'no-store' })
          if (!res.ok) continue
          const data = await res.json()
          const ver = data.version
          const url = data.url
          if (!ver || !url) continue
          remoteVersion.value = ver
          if (ver === currentVer) { status.value = 'idle'; return { upToDate: true } }
          const failed = localStorage.getItem(FAILED_KEY)
          if (failed === ver) { status.value = 'idle'; return { skipped: 'failed-before' } }
          const applied = localStorage.getItem(APPLIED_KEY)
          if (applied === ver) { status.value = 'idle'; return { upToDate: true } }
          status.value = 'downloading'
          const dl = await CapacitorUpdater.download({ url, version: ver })
          if (dl) {
            await CapacitorUpdater.set(dl)
            try { localStorage.setItem(APPLIED_KEY, ver) } catch {}
            status.value = 'ready'
            // No forzamos reload inmediato — se aplica al próximo cold start para no molestar la partida
            return { updated: true, version: ver, restartOnNextLaunch: true }
          }
        } catch {}
      }

      status.value = 'idle'
      return { upToDate: true }
    } catch (e) {
      status.value = 'error'
      console.warn('[updater]', e)
      try { localStorage.setItem(FAILED_KEY, remoteVersion.value || 'unknown') } catch {}
      return { error: e.message }
    }
  }

  function listenOnline() {
    let debounce = null
    window.addEventListener('online', () => {
      clearTimeout(debounce)
      debounce = setTimeout(() => checkAndUpdate(), 4000)
    })
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        clearTimeout(debounce)
        debounce = setTimeout(() => checkAndUpdate(), 3000)
      }
    })
  }

  return { status, progress, remoteVersion, localVersion, checkAndUpdate, listenOnline }
}
