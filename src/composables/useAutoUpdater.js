import { ref } from 'vue'

const status = ref('idle')
const progress = ref(0)
const remoteVersion = ref(null)
const localVersion = ref('0.1.0')

export function useAutoUpdater() {
  // OTA DESHABILITADO — causa restarts infinitos en APK
  // Cuando quieras OTA de nuevo, re-habilitar y usar solo download() sin set()
  async function checkAndUpdate() {
    return { skipped: 'disabled' }
  }

  function listenOnline() {
    // no-op: no auto-update en mobile
  }

  return { status, progress, remoteVersion, localVersion, checkAndUpdate, listenOnline }
}
