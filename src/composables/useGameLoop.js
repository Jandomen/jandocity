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
      if (!isPaused.value) tickCallback()
    }, interval)
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
    if (intervalId) clearInterval(intervalId)
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
