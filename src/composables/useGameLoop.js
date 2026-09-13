/**
 * src/composables/useGameLoop.js
 * Game Loop desacoplado del Store.
 * Responsabilidad única: orquestar el tiempo.
 * - Usa setInterval para ticks lógicos (economía cada 2s)
 * - Usa requestAnimationFrame solo si necesitamos animaciones futuras (ahora no necesario)
 * - Controla pausa/reanudación sin tocar lógica de negocio
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { TICK_INTERVAL_MS } from '@/constants/buildings.js'

export function useGameLoop(tickCallback, options = {}) {
  const { interval = TICK_INTERVAL_MS, autoStart = true } = options

  const isRunning = ref(false)
  const isPaused = ref(false)
  let intervalId = null

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    isPaused.value = false
    intervalId = setInterval(() => {
      if (document.visibilityState === 'hidden') return
      if (!isPaused.value) tickCallback()
    }, interval)
    // pausa automática en background (ahorro batería Android gama baja)
    const vis = () => { if (document.visibilityState === 'hidden') isPaused.value = true; else if (isRunning.value) isPaused.value = false }
    document.addEventListener('visibilitychange', vis)
    // cleanup se hace en stop
    intervalId._vis = vis
  }

  function pause() {
    isPaused.value = true
  }

  function resume() {
    isPaused.value = false
  }

  function toggle() {
    isPaused.value = !isPaused.value
  }

  function stop() {
    if (intervalId) {
      if (intervalId._vis) document.removeEventListener('visibilitychange', intervalId._vis)
      clearInterval(intervalId)
    }
    intervalId = null
    isRunning.value = false
  }

  // Auto lifecycle si se usa dentro de un componente
  onMounted(() => {
    if (autoStart) start()
  })
  onUnmounted(() => stop())

  return { isRunning, isPaused, start, pause, resume, toggle, stop }
}
