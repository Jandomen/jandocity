export const PERFORMANCE_PRESETS = {
  high: {
    label: 'Alto',
    maxPedestrians: 45,
    maxVehicles: 35,
    maxAccidents: 4,
    maxPlanes: 6,
    trafficTickMs: 500,
    serviceSpawnMs: 9000,
    buildTickMs: 100,
    selectionTickMs: 420,
    visibleOverscan: 2,
    terrainNoise: true,
    shadows: true,
    blur: true,
    animations: true,
  },
  medium: {
    label: 'Medio',
    maxPedestrians: 28,
    maxVehicles: 22,
    maxAccidents: 3,
    maxPlanes: 4,
    trafficTickMs: 650,
    serviceSpawnMs: 11000,
    buildTickMs: 150,
    selectionTickMs: 550,
    visibleOverscan: 1,
    terrainNoise: true,
    shadows: true,
    blur: false,
    animations: true,
  },
  low: {
    label: 'Ahorro',
    maxPedestrians: 16,
    maxVehicles: 12,
    maxAccidents: 2,
    maxPlanes: 2,
    trafficTickMs: 850,
    serviceSpawnMs: 14000,
    buildTickMs: 220,
    selectionTickMs: 700,
    visibleOverscan: 1,
    terrainNoise: false,
    shadows: false,
    blur: false,
    animations: false,
  },
}

export function detectQuality() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'high'
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '') || window.innerWidth < 768
  const mem = navigator.deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  const conn = navigator.connection?.effectiveType || '4g'
  const saveData = navigator.connection?.saveData || false
  if (saveData) return 'low'
  if (!isMobile) return 'high'
  if (mem <= 2 || cores <= 2 || conn === '2g' || conn === 'slow-2g') return 'low'
  if (mem <= 3 || cores <= 4) return 'medium'
  return 'medium'
}
