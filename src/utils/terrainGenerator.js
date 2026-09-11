/**
 * src/utils/terrainGenerator.js
 * Mapa limpio 100% pasto hiperplano — sin ríos/lagos automáticos, tú los agregas construyendo
 */

import { GRID_SIZE } from '@/constants/buildings.js'

function hashPos(x, y, seed = 1337) {
  return ((x * 374761393 + y * 668265263) ^ seed) % 2147483647
}

export function generateTerrainGrid(size = GRID_SIZE, seed = Date.now()) {
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      terrain: 'grass',
      terrainType: 'grass',
      tonalIndex: Math.abs(hashPos(x, y, seed) % 4),
      decorSeed: hashPos(x * 2, y * 3, seed + 999),
      hasTree: false,
      hasBush: false,
      hasRock: false
    }))
  )
}

export function getWaterMask(terrainGrid, x, y) {
  const isWater = (nx, ny) => {
    const t = terrainGrid[ny]?.[nx]?.terrain
    return t === 'water' || t === 'deep_water'
  }
  return {
    n: isWater(x, y - 1), s: isWater(x, y + 1), e: isWater(x + 1, y), w: isWater(x - 1, y),
    ne: isWater(x + 1, y - 1), nw: isWater(x - 1, y - 1), se: isWater(x + 1, y + 1), sw: isWater(x - 1, y + 1)
  }
}

export function setTerrainAt(terrainGrid, x, y, terrainId) {
  if (terrainGrid[y]?.[x]) { terrainGrid[y][x].terrain = terrainId; terrainGrid[y][x].terrainType = terrainId; return true }
  return false
}

export function isWaterTerrain(t) { return t === 'water' || t === 'deep_water' }
