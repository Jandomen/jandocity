import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'

const status = ref('idle') // idle | checking | available | downloading | ready | error | upToDate
const progress = ref(0)
const remoteVersion = ref(null)
const localVersion = ref('0.0.0')
const pendingUpdate = ref(null) // { version, url, notes }
const THROTTLE_MS = 30 * 60 * 1000
const LAST_CHECK_KEY = 'jandocity-last-update-check'
const APPLIED_KEY = 'jandocity-applied-version'
const FAILED_KEY = 'jandocity-failed-version'
const DISMISSED_KEY = 'jandocity-dismissed-version'

function canCheck() {
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
  try { return localStorage.getItem(APPLIED_KEY) || '0.1.32' } catch { return '0.1.32' }
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0
    const nb = pb[i] || 0
    if (na > nb) return 1
    if (na < nb) return -1
  }
  return 0
}

export function useAutoUpdater() {
  async function checkAndUpdate(force = false) {
    // No auto-descarga más: solo avisa si hay update
    if (!navigator.onLine) return { skipped: 'offline' }
    if (!force && !canCheck()) return { skipped: 'throttled' }

    status.value = 'checking'
    progress.value = 0
    try { localStorage.setItem(LAST_CHECK_KEY, String(Date.now())) } catch {}

    try {
      const currentVer = await getCurrentVersion()
      localVersion.value = currentVer

      // 1) intenta Capgo getLatest si está configurado
      let capVer = null, capUrl = null
      try {
        const { CapacitorUpdater } = await import('@capgo/capacitor-updater')
        await CapacitorUpdater.notifyAppReady().catch(() => {})
        const latest = await CapacitorUpdater.getLatest().catch(() => null)
        if (latest?.version && latest?.url) { capVer = latest.version; capUrl = latest.url }
      } catch {}

      const candidates = []
      if (capVer && capUrl) candidates.push({ version: capVer, url: capUrl, notes: 'Capgo' })

      // 2) fallback manual: version.json / manifest.json
      const urls = [
        'https://jandocity.vercel.app/version.json',
        'https://adqhqvzkqdhujjipabgf.supabase.co/storage/v1/object/public/updates/manifest.json',
      ]
      for (const u of urls) {
        try {
          const res = await fetch(u, { cache: 'no-store' })
          if (!res.ok) continue
          const data = await res.json()
          if (data.version && data.url) candidates.push({ version: data.version, url: data.url, notes: data.notes || '' })
        } catch {}
      }

      // elige el candidato más nuevo > current
      let best = null
      for (const c of candidates) {
        if (compareVersions(c.version, currentVer) <= 0) continue
        const dismissed = localStorage.getItem(DISMISSED_KEY)
        if (dismissed === c.version) continue // respeta "Más tarde" aun con force, hasta nueva versión
        const failed = localStorage.getItem(FAILED_KEY)
        if (failed === c.version) continue
        const applied = localStorage.getItem(APPLIED_KEY)
        if (applied === c.version) continue
        if (!best || compareVersions(c.version, best.version) > 0) best = c
      }

      if (!best) {
        status.value = 'idle'
        return { upToDate: true, current: currentVer }
      }

      remoteVersion.value = best.version
      pendingUpdate.value = best
      status.value = 'available'
      return { available: true, version: best.version, update: best }
    } catch (e) {
      status.value = 'error'
      console.warn('[updater]', e)
      return { error: e.message }
    }
  }

  async function startUpdate() {
    const upd = pendingUpdate.value
    if (!upd) return { error: 'no pending' }
    const isNative = Capacitor.isNativePlatform()

    if (!isNative) {
      // Web: no hay zip, solo recarga para tomar nuevo deploy Vercel
      status.value = 'downloading'
      progress.value = 12
      await new Promise(r => setTimeout(r, 280))
      progress.value = 45
      await new Promise(r => setTimeout(r, 250))
      try { localStorage.setItem(APPLIED_KEY, upd.version); localStorage.removeItem(DISMISSED_KEY); localStorage.removeItem(FAILED_KEY) } catch {}
      progress.value = 100
      status.value = 'ready'
      // recarga suave tras 700ms — después el check verá applied === remote y no volverá a molestar
      setTimeout(() => window.location.reload(), 700)
      return { updated: true, web: true }
    }

    status.value = 'downloading'
    progress.value = 0

    // barra animada mientras Capgo descarga (no hay evento nativo fiable en todas versiones)
    let progTimer = null
    progTimer = setInterval(() => {
      if (progress.value < 88) progress.value = Math.min(88, progress.value + Math.random() * 9 + 2)
    }, 260)

    // intenta listener nativo si existe
    let listener = null
    try {
      const { CapacitorUpdater } = await import('@capgo/capacitor-updater')
      try { listener = await CapacitorUpdater.addListener('downloadProgress', (e) => { if (typeof e?.percent === 'number') progress.value = Math.min(99, Math.max(progress.value, e.percent)) }) } catch {}
      const dl = await CapacitorUpdater.download({ url: upd.url, version: upd.version })
      clearInterval(progTimer)
      if (listener?.remove) try { listener.remove() } catch {}
      if (!dl) throw new Error('download failed')
      progress.value = 97
      await CapacitorUpdater.set(dl)
      try { localStorage.setItem(APPLIED_KEY, upd.version) } catch {}
      progress.value = 100
      status.value = 'ready'
      return { updated: true, version: upd.version, restartOnNextLaunch: true }
    } catch (e) {
      clearInterval(progTimer)
      if (listener?.remove) try { listener.remove() } catch {}
      status.value = 'error'
      progress.value = 0
      try { localStorage.setItem(FAILED_KEY, upd.version) } catch {}
      console.warn('[updater download]', e)
      return { error: e.message }
    }
  }

  function dismissUpdate() {
    if (pendingUpdate.value?.version) {
      try { localStorage.setItem(DISMISSED_KEY, pendingUpdate.value.version) } catch {}
    }
    pendingUpdate.value = null
    remoteVersion.value = null
    progress.value = 0
    status.value = 'idle'
  }

  function clearDismissed() { try { localStorage.removeItem(DISMISSED_KEY) } catch {} }

  async function applyReadyAndRestart() {
    try {
      const { CapacitorUpdater } = await import('@capgo/capacitor-updater')
      // en algunos builds reloadApp es necesario; si no, el set ya aplica en next cold start
      try { await CapacitorUpdater.reloadApp?.() } catch {}
      // fallback web reload
      window.location.reload()
    } catch { window.location.reload() }
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

  return { status, progress, remoteVersion, localVersion, pendingUpdate, checkAndUpdate, startUpdate, dismissUpdate, clearDismissed, applyReadyAndRestart, listenOnline }
}
