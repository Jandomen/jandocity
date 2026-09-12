import { ref, computed, watch } from 'vue'
import { PERFORMANCE_PRESETS, detectQuality } from '@/config/performance.js'

const stored = (() => {
  try { return localStorage.getItem('jandocity-quality') } catch { return null }
})()

const quality = ref(stored || 'auto')
const effectiveQuality = computed(() => quality.value === 'auto' ? detectQuality() : quality.value)
const preset = computed(() => PERFORMANCE_PRESETS[effectiveQuality.value] || PERFORMANCE_PRESETS.medium)

const isLowEnd = computed(() => effectiveQuality.value === 'low')
const isMobile = computed(() => typeof navigator !== 'undefined' && (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '') || (typeof window !== 'undefined' && window.innerWidth < 768)))

function setQuality(q) {
  quality.value = q
  try { localStorage.setItem('jandocity-quality', q) } catch {}
}

export function usePerformance() {
  return { quality, effectiveQuality, preset, isLowEnd, isMobile, setQuality, detectQuality }
}
