export const PERFORMANCE_PRESETS = {
  high: {
    label: 'Gama alta ⚡',
    maxPedestrians: 55,
    maxVehicles: 40,
    maxAccidents: 4,
    maxPlanes: 5,
    trafficTickMs: 320,
    serviceSpawnMs: 6500,
    buildTickMs: 65,
    selectionTickMs: 220,
    visibleOverscan: 3,
    terrainNoise: true,
    shadows: true,
    blur: true,
    animations: true,
    simpleEntities: false,
    maxVisibleEntities: 999,
    decor: true,
    particleLimit: 28,
  },
  medium: {
    label: 'Medio',
    maxPedestrians: 28,
    maxVehicles: 22,
    maxAccidents: 2,
    maxPlanes: 3,
    trafficTickMs: 520,
    serviceSpawnMs: 9000,
    buildTickMs: 110,
    selectionTickMs: 380,
    visibleOverscan: 2,
    terrainNoise: true,
    shadows: false,
    blur: false,
    animations: true,
    simpleEntities: false,
    maxVisibleEntities: 120,
    decor: true,
    particleLimit: 16,
  },
  low: {
    label: 'Ahorro',
    maxPedestrians: 8,
    maxVehicles: 6,
    maxAccidents: 1,
    maxPlanes: 1,
    trafficTickMs: 900,
    serviceSpawnMs: 14000,
    buildTickMs: 220,
    selectionTickMs: 600,
    visibleOverscan: 1,
    terrainNoise: false,
    shadows: false,
    blur: false,
    animations: true,
    simpleEntities: true,
    maxVisibleEntities: 40,
    decor: false,
    particleLimit: 8,
  },
}

export function detectQuality() {
  // Usuario pidió juego muy rápido como gama alta: forzamos high por defecto
  // Solo respeta Ahorro si el usuario lo eligió manualmente o saveData extremo
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'high'
  try {
    const stored = localStorage.getItem('jandocity-quality')
    if (stored === 'low' || stored === 'medium' || stored === 'high') return stored === 'auto' ? 'high' : stored
    if (stored === 'high') return 'high'
  } catch {}
  const saveData = navigator.connection?.saveData || false
  if (saveData) return 'medium'
  return 'high'
}
