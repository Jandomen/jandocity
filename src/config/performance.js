export const PERFORMANCE_PRESETS = {
  high: {
    label: 'Alto',
    maxPedestrians: 40,
    maxVehicles: 30,
    maxAccidents: 3,
    maxPlanes: 4,
    trafficTickMs: 600,
    serviceSpawnMs: 10000,
    buildTickMs: 120,
    selectionTickMs: 450,
    visibleOverscan: 2,
    terrainNoise: true,
    shadows: true,
    blur: true,
    animations: true,
    simpleEntities: false,
    maxVisibleEntities: 999,
    decor: true,
    particleLimit: 20,
  },
  medium: {
    label: 'Medio',
    maxPedestrians: 20,
    maxVehicles: 16,
    maxAccidents: 2,
    maxPlanes: 2,
    trafficTickMs: 800,
    serviceSpawnMs: 13000,
    buildTickMs: 180,
    selectionTickMs: 600,
    visibleOverscan: 1,
    terrainNoise: true,
    shadows: false,
    blur: false,
    animations: true,
    simpleEntities: false,
    maxVisibleEntities: 50,
    decor: true,
    particleLimit: 12,
  },
  low: {
    label: 'Ahorro',
    maxPedestrians: 6,
    maxVehicles: 4,
    maxAccidents: 1,
    maxPlanes: 0,
    trafficTickMs: 1600,
    serviceSpawnMs: 22000,
    buildTickMs: 400,
    selectionTickMs: 1100,
    visibleOverscan: 0,
    terrainNoise: false,
    shadows: false,
    blur: false,
    animations: false,
    simpleEntities: true,
    maxVisibleEntities: 18,
    decor: false,
    particleLimit: 0,
  },
}

export function detectQuality() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'high'
  const ua = navigator.userAgent || ''
  const isAndroid = /Android/i.test(ua)
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isMobile = isAndroid || isIOS || window.innerWidth < 768
  const mem = navigator.deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  const conn = navigator.connection?.effectiveType || '4g'
  const saveData = navigator.connection?.saveData || false
  if (saveData) return 'low'
  if (!isMobile) return 'high'
  // Android gama baja: muy agresivo — la mayoría de gama baja tiene 2-3GB y 4 cores
  if (isAndroid) {
    if (mem <= 3 || cores <= 4 || conn === '2g' || conn === 'slow-2g' || conn === '3g') return 'low'
    if (mem <= 4 || cores <= 6) return 'medium'
    return 'medium'
  }
  if (mem <= 2 || cores <= 2 || conn === '2g' || conn === 'slow-2g') return 'low'
  if (mem <= 3 || cores <= 4) return 'medium'
  return 'medium'
}
