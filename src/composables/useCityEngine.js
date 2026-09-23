/**
 * src/composables/useCityEngine.js
 *
 * Engine puro.
 * Sin Pinia, sin Vue y sin efectos secundarios.
 */

import { BUILDING_TYPES } from '@/constants/buildings.js'
import { TERRAIN_TYPES, isWater } from '@/constants/terrain.js'

/**
 * Calcula el resultado de un tick sin mutar estado.
 */
export function calculateTickResult(flatGrid) {
  let income = 0
  let energyProd = 0, energyCons = 0
  let waterProd = 0, waterCons = 0
  let oxygenProd = 0, oxygenCons = 0
  for (const cell of flatGrid) {
    if (!cell.buildingId) continue
    const b = BUILDING_TYPES[cell.buildingId]
    if (!b) continue
    income += b.incomePerTick || 0
    const e = b.effects.energy || 0, w = b.effects.water || 0, o = b.effects.oxygen || 0
    if (e > 0) energyProd += e; else energyCons += Math.abs(e)
    if (w > 0) waterProd += w; else waterCons += Math.abs(w)
    if (o > 0) oxygenProd += o; else oxygenCons += Math.abs(o)
  }
  const hasEnergyDeficit = energyProd < energyCons
  const hasWaterDeficit = waterProd < waterCons
  const hasOxygenDeficit = oxygenProd < oxygenCons
  const deficitCount = [hasEnergyDeficit, hasWaterDeficit, hasOxygenDeficit].filter(Boolean).length
  if (deficitCount > 0 && income > 0) {
    const factor = deficitCount === 1 ? 0.5 : deficitCount === 2 ? 0.3 : 0.15
    income = Math.floor(income * factor)
  }
  return {
    income,
    hasDeficit: deficitCount > 0,
    hasEnergyDeficit, hasWaterDeficit, hasOxygenDeficit,
    energyProd, energyCons, waterProd, waterCons, oxygenProd, oxygenCons
  }
}

function worldToLocal(grid, x, y) {
  const ox = grid[0]?.[0]?.x ?? 0
  const oy = grid[0]?.[0]?.y ?? 0
  return { ax: x - ox, ay: y - oy }
}

function getCellWorld(grid, x, y) {
  const { ax, ay } = worldToLocal(grid, x, y)
  return grid[ay]?.[ax] || null
}

/**
 * Comprueba si una coordenada mundo está dentro del grid.
 */
export function isInsideGrid(grid, x, y) {
  const c = getCellWorld(grid, x, y)
  return !!c
}

/**
 * Devuelve las cuatro celdas ortogonales adyacentes.
 */
export function getAdjacentCells(grid, x, y) {
  const positions = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ]
  return positions.filter(({ x, y }) => isInsideGrid(grid, x, y))
}

/**
 * Comprueba si una celda toca una carretera (cualquier pavimento).
 */
export function isAdjacentToRoad(grid, x, y) {
  const ROAD_IDS = ['road','dirt_road','concrete_road','cobble_road']
  return getAdjacentCells(grid, x, y).some(
    ({ x, y }) => ROAD_IDS.includes(getCellWorld(grid, x, y)?.buildingId)
  )
}

/**
 * Comprueba si una celda toca agua (terrain water/deep_water).
 * Revisa las 4 ortogonales + las 8 alrededor para muelles grandes.
 */
export function isAdjacentToWater(grid, x, y, w = 1, h = 1) {
  // Para edificios multi-tile, comprobar perímetro
  for (let dy = -1; dy <= h; dy++) {
    for (let dx = -1; dx <= w; dx++) {
      // solo perímetro exterior
      const isInterior = dx >= 0 && dx < w && dy >= 0 && dy < h
      if (isInterior) continue
      const cx = x + dx, cy = y + dy
      const c = getCellWorld(grid, cx, cy)
      if (!c) continue
      const t = c.terrain || c.terrainType
      if (t === 'water' || t === 'deep_water') return true
    }
  }
  return false
}

/**
 * Edificios que necesitan estar conectados
 * directamente a una carretera.
 *
 * IMPORTANTE:
 * Estos IDs deben coincidir con BUILDING_TYPES.
 */
export const ROAD_REQUIRED_BUILDINGS = [
  'residential','residential_small','residential_medium','residential_large',
  'tower_residential','tower_commercial','apartment_block','skyscraper',
  'commercial','shop','supermarket','mall','bank',
  'hotel','hotel_large','restaurant','restaurant_small',
  'school','university','hospital','police_station','fire_station','courthouse','prison','gym',
  'church','cathedral','castle','stadium','airport',
  'city_hall','museum','port','solar_farm','financial_district','opera',
  'olympic_stadium','nuclear_plant','intl_airport',
  'factory','warehouse','telecom_tower','data_center','sewage_plant','recycling_plant','library','convention_center',
  'lab','observatory','ai_center','clinic','medical_uni','cinema','theme_park','zoo','nursery','wetland','bunker','radar_tower','heliport','metro_entry'
]

export const WATER_REQUIRED_BUILDINGS = [
  'dock',
  'pier',
  'fishing_hut'
]

/**
 * Comprueba si un edificio necesita carretera.
 */
export function requiresRoad(buildingId) {
  return ROAD_REQUIRED_BUILDINGS.includes(buildingId)
}

export function requiresWater(buildingId) {
  return WATER_REQUIRED_BUILDINGS.includes(buildingId)
}

/**
 * Validación completa de construcción.
 *
 * Devuelve:
 *
 * {
 *   ok: true
 * }
 *
 * o:
 *
 * {
 *   ok: false,
 *   reason: '...'
 * }
 */
export function canPlaceAt(
  grid,
  x,
  y,
  buildingId,
  money
) {
  const building = BUILDING_TYPES[buildingId]

  if (!building) {
    return {
      ok: false,
      reason: 'Edificio desconocido'
    }
  }

  if (!isInsideGrid(grid, x, y)) {
    return {
      ok: false,
      reason: 'Fuera del mapa'
    }
  }

  const w = building.width || 1
  const h = building.height || 1

  // Verificar área completa W×H — permite cruce riel↔carretera (pavimento)
  const ROAD_IDS = ['road','dirt_road','concrete_road','cobble_road']
  const RAIL_IDS = ['rail']
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const cx = x + dx, cy = y + dy
      if (!isInsideGrid(grid, cx, cy)) {
        return { ok: false, reason: 'Fuera del mapa' }
      }
      const c = getCellWorld(grid, cx, cy)
      if (c.visibility === 'unexplored') {
        return { ok: false, reason: 'Terreno por descubrir' }
      }
      const isCrossing = (ROAD_IDS.includes(buildingId) && (RAIL_IDS.includes(c.buildingId) || c.hasRail)) || (RAIL_IDS.includes(buildingId) && (ROAD_IDS.includes(c.buildingId) || c.hasRoad))
      if ((c.buildingId || c.occupiedBy) && !isCrossing) {
        return { ok: false, reason: 'Casilla ocupada' }
      }
      const t = c.terrain || c.terrainType
      const isRoadId = [...ROAD_IDS, ...RAIL_IDS].includes(buildingId)
      if ((t === 'water' || t === 'deep_water') && !isRoadId) {
        const terr = TERRAIN_TYPES[t]
        if (terr && !terr.buildable) {
          return { ok: false, reason: 'No se puede construir sobre agua — usa puente o rellena' }
        }
      }
    }
  }

  const cell = getCellWorld(grid, x, y)

  if (money < building.cost) {
    return {
      ok: false,
      reason: 'Fondos insuficientes'
    }
  }

  // === TERRAIN como propiedad de celda ===
  const terrainId = cell.terrain || 'grass'
  const terrain = TERRAIN_TYPES[terrainId]
  const ROAD_RAIL_IDS = ['road','dirt_road','concrete_road','cobble_road','rail']
  if (terrain && !terrain.buildable) {
    if (isWater(terrainId)) {
      // Puente: cualquier carretera/riel SÍ puede ir sobre agua
      if (ROAD_RAIL_IDS.includes(buildingId)) {
        // Permitir puente — validación pasa
      } else {
        return {
          ok: false,
          reason: 'No se puede construir sobre agua — usa puente o rellena'
        }
      }
    } else if (terrainId === 'forest') {
      return {
        ok: false,
        reason: 'Tala el bosque primero'
      }
    } else {
      return {
        ok: false,
        reason: `Terreno no edificable: ${terrain.label}`
      }
    }
  }

  /**
   * Las carreteras no necesitan carretera.
   * Power y water tampoco.
   *
   * Residential y commercial sí.
   */
  if (
    requiresRoad(buildingId) &&
    !isAdjacentToRoad(grid, x, y)
  ) {
    return {
      ok: false,
      reason: 'Requiere una carretera adyacente'
    }
  }

  if (
    requiresWater(buildingId) &&
    !isAdjacentToWater(grid, x, y, building.width || 1, building.height || 1)
  ) {
    return {
      ok: false,
      reason: 'Requiere estar al lado del agua — pinta un lago primero 🌊'
    }
  }

  return {
    ok: true,
    reason: null
  }
}