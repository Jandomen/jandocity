/**
 * src/composables/useCamera.js
 * Cámara 2D para mapa continuo — pan (arrastrar) + zoom (rueda) + teclado (WASD/flechas)
 * No toca cityStore, solo transform visual. Preparado para 10x10 → 50x50.
 */
import { ref, computed } from 'vue'

export function useCamera() {
  const x = ref(0)
  const y = ref(0)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const scale = ref(isMobile ? 0.78 : 1)

  const MIN_SCALE = isMobile ? 0.45 : 0.6
  const MAX_SCALE = 2.2

  let isDragging = false
  let lastX = 0
  let lastY = 0
  let startX = 0
  let startY = 0

  const transform = computed(() => `translate(${x.value}px, ${y.value}px) scale(${scale.value})`)

  function onPointerDown(e) {
    // Pan solo con derecho (2) o central (1) — izquierdo (0) es para pintar como Minecraft
    const isPanButton = e.button === 2 || e.button === 1
    const isTouch = e.touches !== undefined
    if (!isPanButton && !isTouch) return
    if (e.button === 2) e.preventDefault()
    isDragging = true
    const p = e.touches ? e.touches[0] : e
    lastX = p.clientX
    lastY = p.clientY
    startX = p.clientX
    startY = p.clientY
  }

  function onPointerMove(e) {
    if (!isDragging) return
    const p = e.touches ? e.touches[0] : e
    x.value += p.clientX - lastX
    y.value += p.clientY - lastY
    lastX = p.clientX
    lastY = p.clientY
  }

  function onPointerUp(e) {
    if (!isDragging) return
    const p = e.changedTouches ? e.changedTouches[0] : e
    // Si fue un click sin apenas movimiento, no consumir el evento (dejar que CellTile reciba click)
    const moved = Math.hypot((p.clientX - startX), (p.clientY - startY))
    isDragging = false
    // Devolver si fue drag para que el click de construcción no se dispare tras pan
    return moved > 6
  }

  function onWheel(e) {
    e.preventDefault()
    const delta = -e.deltaY * 0.001
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value + delta))
    // Zoom centrado en el cursor — ajustar pan para que el punto bajo el cursor quede fijo
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const ratio = newScale / scale.value
    x.value = cx - ratio * (cx - x.value)
    y.value = cy - ratio * (cy - y.value)
    scale.value = newScale
  }

  function onKeydown(e) {
    const step = e.shiftKey ? 40 : 20
    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup': y.value += step; break
      case 's':
      case 'arrowdown': y.value -= step; break
      case 'a':
      case 'arrowleft': x.value += step; break
      case 'd':
      case 'arrowright': x.value -= step; break
      case '0': reset(); break
      case '+':
      case '=': scale.value = Math.min(MAX_SCALE, scale.value + 0.1); break
      case '-':
      case '_': scale.value = Math.max(MIN_SCALE, scale.value - 0.1); break
      default: return
    }
    e.preventDefault()
  }

  function reset() {
    x.value = 0
    y.value = 0
    scale.value = 1
  }

  return { x, y, scale, transform, onPointerDown, onPointerMove, onPointerUp, onWheel, onKeydown, reset }
}
