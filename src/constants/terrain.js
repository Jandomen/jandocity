/**
 * src/constants/terrain.js
 * Sistema TERRAIN separado de BUILDINGS — cumple objetivo: lagos irregulares, terreno continuo, escalable.
 * Cada celda tiene: terrain: 'grass'|'dirt'|'water'|'sand'|'forest'
 * buildingId sigue siendo: null|'residential'|...
 */

export const TERRAIN_TYPES = {
  grass: {
    id: 'grass',
    label: 'Pasto',
    buildable: true,
    walkable: true,
    costModifier: 1,
    // Colores base para generación procedural
    palette: ['#7ec850', '#8fd460', '#6bbf45', '#8bc85a'],
    decoration: ['tree', 'bush', 'flower']
  },
  dirt: {
    id: 'dirt',
    label: 'Tierra',
    buildable: true,
    walkable: true,
    costModifier: 1,
    palette: ['#c2a878', '#b5986a', '#d4b896'],
    decoration: ['rock', 'bush']
  },
  sand: {
    id: 'sand',
    label: 'Arena',
    buildable: true,
    walkable: true,
    costModifier: 1,
    palette: ['#e8dcc0', '#f0e6d3', '#d9c9a8'],
    decoration: ['rock']
  },
  forest: {
    id: 'forest',
    label: 'Bosque',
    buildable: false, // requiere talar
    walkable: true,
    costModifier: 1.5,
    palette: ['#3a7d44', '#2d5a32', '#4a8c54'],
    decoration: ['tree', 'tree', 'tree']
  },
  water: {
    id: 'water',
    label: 'Agua',
    buildable: false,
    walkable: false,
    costModifier: 999,
    palette: ['#3b82f6', '#2563eb', '#60a5fa', '#1e40af'],
    decoration: []
  },
  deep_water: {
    id: 'deep_water',
    label: 'Agua profunda',
    buildable: false,
    walkable: false,
    costModifier: 999,
    palette: ['#1e40af', '#1e3a8a', '#172554', '#0f172a'],
    decoration: []
  },
  concrete: {
    id: 'concrete',
    label: 'Cemento',
    buildable: true,
    walkable: true,
    costModifier: 1,
    palette: ['#9ca3af', '#d1d5db', '#6b7280'],
    decoration: []
  },
  tile: {
    id: 'tile',
    label: 'Azulejo',
    icon: '🔲',
    buildable: true,
    walkable: true,
    costModifier: 1,
    palette: ['#e7e5e4', '#f5f5f4', '#d6d3d1'],
    decoration: []
  },
  wood: {
    id: 'wood',
    label: 'Madera',
    buildable: true,
    walkable: true,
    costModifier: 1,
    palette: ['#a16207', '#92400e', '#78350f'],
    decoration: []
  },
  marble: {
    id: 'marble',
    label: 'Mármol',
    buildable: true,
    walkable: true,
    costModifier: 1,
    palette: ['#f5f5f4', '#e7e5e4', '#fafaf9'],
    decoration: []
  },
  stone: {
    id: 'stone',
    label: 'Piedra laja',
    buildable: true,
    walkable: true,
    costModifier: 1,
    palette: ['#78716c', '#57534e', '#a8a29e'],
    decoration: []
  },
  rubble: {
    id: 'rubble',
    label: 'Escombros',
    buildable: true,
    walkable: true,
    costModifier: 1,
    palette: ['#57534e', '#44403c', '#78716c', '#292524'],
    decoration: []
  },
  scorched: {
    id: 'scorched',
    label: 'Tierra quemada',
    buildable: true,
    walkable: true,
    costModifier: 1.2,
    palette: ['#1c1917', '#0a0a0a', '#292524', '#44403c'],
    decoration: []
  }
}

export const TERRAIN_IDS = Object.keys(TERRAIN_TYPES)

// Orden de fallback para persistencia
export function isTerrainBuildable(terrainId) {
  return TERRAIN_TYPES[terrainId]?.buildable ?? true
}

// Para validación rápida
export function isWater(terrainId) {
  return terrainId === 'water' || terrainId === 'deep_water'
}
export function isDeepWater(terrainId) { return terrainId === 'deep_water' }
