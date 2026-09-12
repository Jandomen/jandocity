import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'

const status = ref('idle') // idle | checking | downloading | ready | error
const progress = ref(0)
const remoteVersion = ref(null)
const localVersion = ref('0.1.0')

export function useAutoUpdater() {
  async function checkAndUpdate() {
    if (!Capacitor.isNativePlatform()) return { skipped: 'web' }
    if (!navigator.onLine) return { skipped: 'offline' }
    status.value = 'checking'
    try {
      const { CapacitorUpdater } = await import('@capgo/capacitor-updater')
      await CapacitorUpdater.notifyAppReady()

      // Intenta OTA via Capgo manifest (Supabase/Vercel)
      // Si no hay manifest, no hace nada — offline sigue funcionando
      const update = await CapacitorUpdater.getLatest().catch(() => null)
      // Si tu manifest está en Supabase/Vercel, Capgo lo detecta automáticamente
      // Alternativa manual: fetch a tu version.json
      if (!update) {
        // fallback manual: compara version.json de tu servidor
        const manifestUrl = 'https://jandocity.vercel.app/version.json'
        const res = await fetch(manifestUrl, { cache: 'no-store' }).catch(() => null)
        if (res?.ok) {
          const data = await res.json()
          remoteVersion.value = data.version
          if (data.version && data.version !== localVersion.value && data.url) {
            status.value = 'downloading'
            const dl = await CapacitorUpdater.download({
              url: data.url,
              version: data.version,
            })
            if (dl) {
              status.value = 'ready'
              await CapacitorUpdater.set(dl)
              return { updated: true, version: data.version }
            }
          }
        }
        status.value = 'idle'
        return { upToDate: true }
      }

      if (update && update.version !== localVersion.value) {
        status.value = 'downloading'
        const downloaded = await CapacitorUpdater.download({
          url: update.url,
          version: update.version,
        })
        if (downloaded) {
          status.value = 'ready'
          await CapacitorUpdater.set(downloaded)
          return { updated: true }
        }
      }
      status.value = 'idle'
      return { upToDate: true }
    } catch (e) {
      status.value = 'error'
      console.warn('[updater]', e)
      return { error: e.message }
    }
  }

  function listenOnline() {
    window.addEventListener('online', () => {
      // auto-actualiza al reconectar
      setTimeout(checkAndUpdate, 1500)
    })
  }

  return { status, progress, remoteVersion, localVersion, checkAndUpdate, listenOnline }
}
