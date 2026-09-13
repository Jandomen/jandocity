import { ref, computed, watch } from 'vue'
import { PERFORMANCE_PRESETS, detectQuality } from '@/config/performance.js'

const stored = (() => {
  try { return localStorage.getItem('jandocity-quality') } catch { return null }
})()

// Forzar gama alta por defecto (usuario pidió juego muy rápido)
const quality = ref(stored || 'high')
const effectiveQuality = computed(() => quality.value === 'auto' ? detectQuality() : quality.value)
const preset = computed(() => PERFORMANCE_PRESETS[effectiveQuality.value] || PERFORMANCE_PRESETS.medium)

const isLowEnd = computed(() => effectiveQuality.value === 'low')
const isMobile = computed(() => typeof navigator !== 'undefined' && (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '') || (typeof window !== 'undefined' && window.innerWidth < 768)))
// clase CSS global para optimizar estilos en low (desactiva blur/shadows vía CSS)
if (typeof document !== 'undefined') {
  watch(effectiveQuality, (q) => {
    document.documentElement.classList.toggle('perf-low', q === 'low')
    document.documentElement.classList.toggle('perf-mobile', /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || ''))
  }, { immediate: true })
}

function setQuality(q) {
  quality.value = q
  try { localStorage.setItem('jandocity-quality', q) } catch {}
}

export function usePerformance() {
  return { quality, effectiveQuality, preset, isLowEnd, isMobile, setQuality, detectQuality }
}
