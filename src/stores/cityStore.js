/**
 * src/stores/cityStore.js
 * Store Pinia - ÚNICA fuente de verdad del estado de la ciudad.
 * Responsabilidades:
 *  - Estado reactivo: grid 10x10, recursos, herramienta seleccionada, estado del loop
 *  - Acciones puras: placeBuilding, demolish, tick
 *  - NO debe contener lógica de render ni setInterval (eso va en composables)
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { BUILDING_TYPES, GRID_SIZE, INITIAL_RESOURCES } from '@/constants/buildings.js'
import { TERRAIN_TYPES } from '@/constants/terrain.js'
import { canPlaceAt } from '@/composables/useCityEngine.js'
import { saveGame, loadGame, deleteSave } from '@/utils/persistence.js'
import { generateTerrainGrid } from '@/utils/terrainGenerator.js'

  // Helper: mundo centrado en 0,0 — coordenadas mundo, no esquina
  function createEmptyGrid(seed = Date.now()) {
    console.log('[' + new Date().toLocaleTimeString() + '] [Jandocity] createEmptyGrid seed', seed, 'size', GRID_SIZE)
    const size = GRID_SIZE
    const half = Math.floor(size / 2)
    const grid = Array.from({ length: size }, (_, ay) =>
      Array.from({ length: size }, (_, ax) => {
        const x = ax - half, y = ay - half
        return {
          x, y, buildingId: null,
          terrain: 'grass', terrainType: 'grass',
          tonalIndex: 0, decorSeed: 0, hasTree: false, hasBush: false, hasRock: false,
          visibility: 'visible',
          hasRoad: false, hasRail: false,
          wallVariant: null, railVariant: null, roadVariant: null,
          id: `${x},${y}`
        }
      })
    )
    return { grid, seed, offsetX: -half, offsetY: -half }
  }

  function migrateGridCell(cell, x, y) {
  if (!cell.terrain) {
    cell.terrain = 'grass'
    cell.terrainType = 'grass'
    cell.tonalIndex = (x + y) % 4
    cell.hasTree = false
    cell.hasBush = false
    cell.hasRock = false
  }
  if (!cell.terrainType) cell.terrainType = cell.terrain
  if (!cell.visibility) cell.visibility = 'unexplored'
  if (cell.tonalIndex === undefined) cell.tonalIndex = (x + y) % 4
  if (cell.occupiedBy === undefined) cell.occupiedBy = null
  if (cell.isOrigin === undefined) cell.isOrigin = false
  if (cell.isChild === undefined) cell.isChild = false
  return cell
}

export const useCityStore = defineStore('city', () => {
  const _init = createEmptyGrid()
  const grid = ref(_init.grid)
  const terrainSeed = ref(_init.seed)
  const offsetX = ref(_init.offsetX ?? 0)
  const offsetY = ref(_init.offsetY ?? 0)
  const money = ref(INITIAL_RESOURCES.money)
  const population = ref(INITIAL_RESOURCES.population)
  const energy = ref(INITIAL_RESOURCES.energy)
  const water = ref(INITIAL_RESOURCES.water)
  const oxygen = ref(INITIAL_RESOURCES.oxygen)

  const selectedTool = ref('residential')
  const selectedRoadVariant = ref('straight-h')
  const selectedRailVariant = ref('straight-h')
  const selectedWallVariant = ref('straight-h')
  const selectedHouseVariant = ref('residential')
  const tickCount = ref(0)
  const isPaused = ref(false)
  const lastTickAt = ref(null)
  const logs = ref([])

  // ============ GETTERS (computed) ============
  const flatGrid = computed(() => grid.value.flat())

  const stats = computed(() => {
    let totalPop = 0
    let energyProd = 0, energyCons = 0
    let waterProd = 0, waterCons = 0
    let oxygenProd = 0, oxygenCons = 0
    let incomePerTick = 0, taxIncome = 0, subsidyCost = 0
    for (const cell of flatGrid.value) {
      if (!cell.buildingId || cell.isChild) continue
      const b = BUILDING_TYPES[cell.buildingId]
      if (!b) continue
      totalPop += b.effects.population || 0
      const e = b.effects.energy || 0, w = b.effects.water || 0, o = b.effects.oxygen || 0
      if (e > 0) energyProd += e; else energyCons += Math.abs(e)
      if (w > 0) waterProd += w; else waterCons += Math.abs(w)
      if (o > 0) oxygenProd += o; else oxygenCons += Math.abs(o)
      const inc = b.incomePerTick || 0
      incomePerTick += inc
      if (inc > 0) taxIncome += inc
      else subsidyCost += Math.abs(inc)
    }
    return {
      totalPop,
      energyProd, energyCons, energyNet: energyProd - energyCons,
      waterProd, waterCons, waterNet: waterProd - waterCons,
      oxygenProd, oxygenCons, oxygenNet: oxygenProd - oxygenCons,
      incomePerTick, taxIncome, subsidyCost, netTax: taxIncome - subsidyCost,
      hasEnergyDeficit: energyProd < energyCons,
      hasWaterDeficit: waterProd < waterCons,
      hasOxygenDeficit: oxygenProd < oxygenCons
    }
  })

  // Recursos derivados para HUD
  const resources = computed(() => ({
    money: money.value,
    population: stats.value.totalPop,
    energy: {
      produced: stats.value.energyProd,
      consumed: stats.value.energyCons,
      net: stats.value.energyNet,
      valueOf() { return stats.value.energyNet }
    },
    water: {
      produced: stats.value.waterProd,
      consumed: stats.value.waterCons,
      net: stats.value.waterNet,
      valueOf() { return stats.value.waterNet }
    },
    oxygen: {
      produced: stats.value.oxygenProd,
      consumed: stats.value.oxygenCons,
      net: stats.value.oxygenNet,
      valueOf() { return stats.value.oxygenNet }
    }
  }))

  // gridSize dinámico — crece con expansión
  const gridSize = computed(() => grid.value.length)
  const gridWidth = computed(() => grid.value[0]?.length || 0)

  // canAfford como función directa
  const TERRAIN_TOOL_COSTS = { lake: 15, deep_lake: 20, sand_brush: 8, forest_brush: 12, grass_brush: 10, concrete_brush: 10, tile_brush: 12, wood_brush: 12, marble_brush: 14, stone_brush: 10 }
  function isTerrainTool(toolId) { return toolId in TERRAIN_TOOL_COSTS }
  function canAfford(toolId) {
    if (toolId === 'fill') return money.value >= 25
    if (toolId === 'demolish') return true
    if (isTerrainTool(toolId)) return money.value >= (TERRAIN_TOOL_COSTS[toolId] ?? 0)
    const tool = BUILDING_TYPES[toolId]
    if (!tool) return true
    return money.value >= tool.cost
  }

  // ============ ACTIONS ============
  let saveTimeout = null
  function scheduleSave(delay = 400) {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => { try { saveGame(getSaveData()) } catch(e){} }, delay)
  }
  function flushSave() { clearTimeout(saveTimeout); try { saveGame(getSaveData()) } catch(e){} }
  function immediateSave() { try { saveGame(getSaveData()) } catch(e){} }
  function log(msg) {
    logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
    if (logs.value.length > 50) logs.value.pop()
  }

  function getCell(x, y) {
    // x,y son coordenadas mundo — convertir a índices array con offset
    const ax = x - offsetX.value
    const ay = y - offsetY.value
    if (ax < 0 || ay < 0 || ay >= grid.value.length) return null
    if (ax >= (grid.value[0]?.length || 0)) return null
    return grid.value[ay]?.[ax] || null
  }

  function worldToLocal(x, y) {
    return { ax: x - offsetX.value, ay: y - offsetY.value }
  }

  function ensureGridContains(x, y) {
    // Expande hasta que (x,y) mundo esté dentro — mundo centrado en 0,0 con offset
    while (x < offsetX.value) { expandGrid('west', 10) }
    while (y < offsetY.value) { expandGrid('north', 10) }
    while (x >= offsetX.value + grid.value[0].length) expandGrid('east', 10)
    while (y >= offsetY.value + grid.value.length) expandGrid('south', 10)
    return { x, y }
  }

  function selectTool(toolId) {
    selectedTool.value = toolId
  }

  // Expansión limpia — mundo centrado en 0,0, offset se mueve
  function expandGrid(direction, count = 10) {
    const makeCell = (x, y) => ({
      x, y, buildingId: null, terrain: 'grass', terrainType: 'grass',
      tonalIndex: 0, decorSeed: 0, hasTree: false, hasBush: false, hasRock: false,
      visibility: 'visible', hasRoad: false, hasRail: false, wallVariant: null, railVariant: null, roadVariant: null, id: `${x},${y}`
    })
    if (direction === 'north') {
      const newRows = Array.from({ length: count }, (_, dy) => {
        const y = offsetY.value - count + dy
        return Array.from({ length: grid.value[0].length }, (_, ax) => {
          const x = offsetX.value + ax
          return makeCell(x, y)
        })
      })
      grid.value = [...newRows, ...grid.value]
      offsetY.value -= count
    } else if (direction === 'south') {
      const h = grid.value.length
      const newRows = Array.from({ length: count }, (_, dy) => {
        const y = offsetY.value + h + dy
        return Array.from({ length: grid.value[0].length }, (_, ax) => {
          const x = offsetX.value + ax
          return makeCell(x, y)
        })
      })
      grid.value.push(...newRows)
    } else if (direction === 'west') {
      const w = grid.value[0].length
      grid.value.forEach((row, ay) => {
        const y = offsetY.value + ay
        const newCells = Array.from({ length: count }, (_, dx) => {
          const x = offsetX.value - count + dx
          return makeCell(x, y)
        })
        row.unshift(...newCells)
      })
      offsetX.value -= count
    } else if (direction === 'east') {
      const w = grid.value[0].length
      grid.value.forEach((row, ay) => {
        const y = offsetY.value + ay
        const newCells = Array.from({ length: count }, (_, dx) => {
          const x = offsetX.value + w + dx
          return makeCell(x, y)
        })
        row.push(...newCells)
      })
    }
    scheduleSave(900)
  }

  function checkAndExpandGrid(x, y) {
    const expandBy = 10
    const h = grid.value.length
    const w = grid.value[0]?.length || h
    if (y <= 2) expandGrid('north', expandBy)
    if (y >= h - 3) expandGrid('south', expandBy)
    if (x <= 2) expandGrid('west', expandBy)
    if (x >= w - 3) expandGrid('east', expandBy)
  }

  // Niebla de guerra — revela 3-5 casillas alrededor de la construcción
  function updateFogOfWar(cx, cy, radius = 4) {
    for (let y = 0; y < grid.value.length; y++) {
      for (let x = 0; x < grid.value[y].length; x++) {
        const dist = Math.hypot(x - cx, y - cy)
        if (dist <= radius) {
          const cell = grid.value[y][x]
          if (cell.visibility === 'unexplored') cell.visibility = 'visible'
          else if (cell.visibility === 'explored') cell.visibility = 'visible'
        }
      }
    }
    // Expansión infinita con niebla: si se revela cerca del borde, expande con niebla
    const size = grid.value.length
    const w = grid.value[0]?.length || size
    let nearEdge = false
    for (let y = 0; y < size; y++) for (let x = 0; x < w; x++) {
      const c = grid.value[y][x]
      if (c.visibility === 'visible' && (x < 3 || y < 3 || x >= w - 3 || y >= size - 3)) nearEdge = true
    }
    if (nearEdge) {
      // No expandir aquí directamente para evitar loop, se hará en próximo checkAndExpandGrid
    }
  }

  function placeBuilding(x, y) {
    let effectiveTool = selectedTool.value
    if (effectiveTool === 'residential' && selectedHouseVariant.value !== 'residential') {
      effectiveTool = selectedHouseVariant.value
    }
    // Construir fuera de los 6 cuadrantes — expande silencioso hasta contener (x,y)
    const pos = ensureGridContains(x, y)
    x = pos.x; y = pos.y
    const cell = getCell(x, y)

    if (!cell) {
      return {
        ok: false,
        reason: 'Coordenada fuera del mapa'
      }
    }

    const toolId = effectiveTool

    if (selectedTool.value === 'demolish') {
      return demolish(x, y)
    }
    if (selectedTool.value === 'fill') {
      return fillTerrain(x, y)
    }

    const validation = canPlaceAt(
      grid.value,
      x,
      y,
      toolId,
      money.value
    )

    if (!validation.ok) {
      return validation
    }

    const building = BUILDING_TYPES[toolId]
    const w = building.width || 1
    const h = building.height || 1

    money.value -= building.cost
    // Cruce riel↔carretera: no sobrescribir, marcar hasRoad/hasRail para que ambos coexistan
    const ROAD_IDS = ['road','dirt_road','concrete_road','cobble_road']
    const isRail = toolId === 'rail'
    const isRoad = ROAD_IDS.includes(toolId)
    const existingIsRoad = ROAD_IDS.includes(cell.buildingId) || cell.hasRoad
    const existingIsRail = cell.buildingId === 'rail' || cell.hasRail
    if (isRail && existingIsRoad) {
      cell.hasRail = true
      cell.railVariant = selectedRailVariant.value !== 'auto' ? selectedRailVariant.value : (cell.railVariant || selectedRailVariant.value)
      cell.visibility = 'visible'
      // no tocar buildingId (sigue siendo carretera)
    } else if (isRoad && existingIsRail) {
      cell.hasRoad = true
      cell.roadVariant = selectedRoadVariant.value !== 'auto' ? selectedRoadVariant.value : (cell.roadVariant || selectedRoadVariant.value)
      cell.visibility = 'visible'
      // si venía de riel, convierte el riel en cruce
      if (!cell.hasRail) cell.hasRail = true
    } else {
      cell.buildingId = toolId
      cell.isOrigin = true
      cell.isChild = false
      cell.occupiedBy = null
      cell.visibility = 'visible'
      cell.hasRoad = isRoad
      cell.hasRail = isRail
      if (ROAD_IDS.includes(toolId) && selectedRoadVariant.value !== 'auto') {
        cell.roadVariant = selectedRoadVariant.value
      } else if (ROAD_IDS.includes(toolId)) {
        cell.roadVariant = null
      }
      if (isRail && selectedRailVariant.value !== 'auto') {
        cell.railVariant = selectedRailVariant.value
      } else if (isRail) {
        cell.railVariant = null
      }
    }
    const WALL_IDS = ['fence','wall','hedge','brick_wall','metal_fence','gate']
    if (WALL_IDS.includes(toolId) && selectedWallVariant.value !== 'auto') {
      cell.wallVariant = selectedWallVariant.value
    } else if (WALL_IDS.includes(toolId)) {
      cell.wallVariant = null
    }
    // Celdas secundarias
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (dx === 0 && dy === 0) continue
        const cx = x + dx, cy = y + dy
        const child = getCell(cx, cy)
        if (child) {
          child.occupiedBy = { x, y }
          child.isChild = true
          child.isOrigin = false
          child.buildingId = null
          child.visibility = 'visible'
        }
      }
    }

    syncDerivedResources()
    updateFogOfWar(x, y, toolId === 'road' ? 3 : 4)

    if (['road','dirt_road','concrete_road','cobble_road'].includes(toolId) && isWaterCell(cell)) {
      log(`🌉 Puente (${building.label}) en (${x},${y}) -${building.cost}💰`)
    } else {
      log(`Construido ${building.label} ${w}×${h} en (${x},${y}) -${building.cost}💰`)
    }

    immediateSave()
    scheduleSave(800)

    return {
      ok: true
    }
  }

  function demolish(x, y) {
    console.log(`[${new Date().toLocaleTimeString()}] [Jandocity] demolish`, x, y)
    const cell = getCell(x, y)
    if (!cell) return { ok: false, reason: 'Fuera del mapa' }

    // Resolver origen si es hijo
    let origin = cell
    let ox = x, oy = y
    if (cell.isChild && cell.occupiedBy) {
      ox = cell.occupiedBy.x
      oy = cell.occupiedBy.y
      origin = getCell(ox, oy)
    }

    if (origin && origin.buildingId) {
      const building = BUILDING_TYPES[origin.buildingId]
      const refund = Math.floor(building.cost * 0.5)
      money.value += refund
      log(`Demolido ${building.label} en (${ox},${oy}) +${refund}💰`)
      const w = building.width || 1
      const h = building.height || 1
      for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
          const cx = ox + dx, cy = oy + dy
          const c = getCell(cx, cy)
          if (c) {
            c.buildingId = null
            c.isOrigin = false
            c.isChild = false
            c.occupiedBy = null
            c.hasRoad = false
            c.hasRail = false
            c.roadVariant = null
            c.railVariant = null
            c.wallVariant = null
          }
        }
      }
      syncDerivedResources()
      immediateSave()
      scheduleSave(800)
      return { ok: true, refund }
    }
    if (cell.hasRail || cell.hasRoad) {
      cell.hasRail = false
      cell.hasRoad = false
      cell.railVariant = null
      cell.roadVariant = null
      if (cell.buildingId === 'rail' || ['road','dirt_road','concrete_road','cobble_road'].includes(cell.buildingId)) {
        cell.buildingId = null
        cell.isOrigin = false
        cell.isChild = false
        cell.occupiedBy = null
      }
      immediateSave()
      scheduleSave(800)
      log(`Demolido riel/carretera en (${x},${y})`)
      return { ok: true }
    }
    const t = cell.terrain || cell.terrainType
    if (t && t !== 'grass') {
      if (isWaterCell(cell)) return fillTerrain(x, y)
      cell.terrain = 'grass'
      cell.terrainType = 'grass'
      cell.hasTree = false
      cell.hasBush = false
      cell.hasRock = false
      immediateSave()
      scheduleSave(800)
      log(`⛏️ Piso ${t} en (${x},${y}) revertido a pasto`)
      return { ok: true }
    }
    return { ok: false, reason: 'Nada que demoler' }
  }

  function fillTerrain(x, y) {
    console.log(`[${new Date().toLocaleTimeString()}] [Jandocity] fillTerrain`, x, y)
    const cell = getCell(x, y)
    if (!cell) return { ok: false, reason: 'Fuera del mapa' }
    if (cell.buildingId) return { ok: false, reason: 'Hay un edificio encima' }
    if (!isWaterCell(cell)) return { ok: false, reason: 'Solo se puede rellenar agua' }
    if (money.value < 25) return { ok: false, reason: 'Fondos insuficientes (25💰)' }
    money.value -= 25
    cell.terrain = 'grass'
    cell.terrainType = 'grass'
    cell.hasTree = false
    cell.hasBush = false
    cell.hasRock = false
    immediateSave()
    scheduleSave(800)
    log(`⛏️ Terreno rellenado en (${x},${y}) → pasto -25💰`)
    return { ok: true }
  }

  function setTerrain(x, y, newTerrainId) {
    const cell = getCell(x, y)
    if (!cell) return { ok: false, reason: 'Fuera del mapa' }
    if (!TERRAIN_TYPES[newTerrainId]) return { ok: false, reason: 'Terreno desconocido' }
    if (cell.buildingId) return { ok: false, reason: 'Hay un edificio encima — demuele primero' }
    cell.terrain = newTerrainId
    cell.terrainType = newTerrainId
    cell.hasTree = newTerrainId === 'forest' && Math.random() > 0.2
    cell.hasBush = newTerrainId === 'grass' && Math.random() > 0.7
    cell.hasRock = false
    immediateSave()
    scheduleSave(800)
    log(`Terreno en (${x},${y}) → ${TERRAIN_TYPES[newTerrainId].label}`)
    return { ok: true }
  }

  // Pinta terreno con coste (para herramienta lago) — x,y son mundo
  function paintTerrain(x, y, terrainId, cost) {
    const cell = getCell(x, y)
    if (!cell) return { ok: false, reason: 'Fuera del mapa' }
    if (cell.terrain === terrainId && cell.terrainType === terrainId) return { ok: false, reason: 'Ya es ' + TERRAIN_TYPES[terrainId].label }
    if (cell.buildingId) return { ok: false, reason: 'Hay un edificio encima' }
    if (money.value < cost) return { ok: false, reason: `Fondos insuficientes (${cost}💰)` }
    money.value -= cost
    return setTerrain(x, y, terrainId)
  }

  function isWaterCell(cell) { return cell.terrain === 'water' || cell.terrain === 'deep_water' || cell.terrainType === 'water' || cell.terrainType === 'deep_water' }

  function canBuildOnTerrain(terrainId) {
    return TERRAIN_TYPES[terrainId]?.buildable ?? true
  }

  function syncDerivedResources() {
    population.value = stats.value.totalPop
    energy.value = stats.value.energyNet
    water.value = stats.value.waterNet
    oxygen.value = stats.value.oxygenNet
  }

  /**
   * TICK - Corazón de la simulación. Llamado por useGameLoop cada TICK_INTERVAL_MS.
   * Procesa ingresos, penalizaciones por déficit.
   */
  function tick() {
    if (isPaused.value) return

    tickCount.value++

    lastTickAt.value = Date.now()

    let income = stats.value.incomePerTick

    const deficitCount = [stats.value.hasEnergyDeficit, stats.value.hasWaterDeficit, stats.value.hasOxygenDeficit].filter(Boolean).length
    if (deficitCount > 0) {
      const factor = deficitCount === 1 ? 0.5 : deficitCount === 2 ? 0.3 : 0.15
      income = Math.floor(income * factor)
      if (income > 0) {
        const reasons = []
        if (stats.value.hasEnergyDeficit) reasons.push('⚡')
        if (stats.value.hasWaterDeficit) reasons.push('💧')
        if (stats.value.hasOxygenDeficit) reasons.push('🍃 O₂')
        log(`⚠️ Déficit ${reasons.join('+')}: ingresos reducidos a ${income}💰`)
      }
      if (stats.value.hasOxygenDeficit) {
        log(`😷 Aire viciado: planta más árboles — O₂ ${stats.value.oxygenProd}/${stats.value.oxygenCons}`)
      }
    }

    money.value += income

    if (money.value < 0) {
      log(`💸 Bancarrota: ${money.value}💰`)
    }

    syncDerivedResources()

    // Autosave cada 10 ticks = 20 segundos (debounced)
    if (tickCount.value % 10 === 0) {
      scheduleSave(400)
    }
  }

  function resetCity() {
    const fresh = createEmptyGrid(Date.now())
    grid.value = fresh.grid
    offsetX.value = fresh.offsetX
    offsetY.value = fresh.offsetY
    terrainSeed.value = fresh.seed

    money.value = INITIAL_RESOURCES.money

    tickCount.value = 0

    isPaused.value = false

    lastTickAt.value = null

    selectedTool.value = 'residential'

    logs.value = []

    syncDerivedResources()

    deleteSave()
    try { localStorage.removeItem('jandocity-player'); } catch {}

    log('🏙️ Ciudad reiniciada')

    saveCity()

    return {
      ok: true
    }
  }

  function togglePause() {
    isPaused.value = !isPaused.value
    log(isPaused.value ? '⏸️ Pausa' : '▶️ Reanudado')
  }

  function pause() {
    if (!isPaused.value) togglePause()
  }

  function resume() {
    if (isPaused.value) togglePause()
  }

  function compressGrid(grid) {
    const sparse = []
    for (const row of grid) for (const c of row) {
      if (c.buildingId || c.hasRoad || c.hasRail || c.terrain !== 'grass' || c.terrainType !== 'grass' || c.isChild || c.isOrigin || c.occupiedBy || c.visibility !== 'visible' || c.roadVariant || c.railVariant || c.wallVariant) {
        sparse.push({ x: c.x, y: c.y, b: c.buildingId, t: c.terrain, tt: c.terrainType, o: c.isOrigin?1:0, c2: c.isChild?1:0, ob: c.occupiedBy, v: c.visibility, rv: c.roadVariant || null, rlv: c.railVariant || null, wv: c.wallVariant || null, hr: c.hasRoad?1:0, hl: c.hasRail?1:0 })
      }
    }
    return sparse
  }
  function decompressGrid(sparse, size, offX, offY, seed) {
    const half = Math.floor(size / 2)
    const ox = offX ?? -half, oy = offY ?? -half
    const grid = Array.from({ length: size }, (_, ay) => Array.from({ length: size }, (_, ax) => {
      const x = ox + ax, y = oy + ay
      return { x, y, buildingId: null, terrain: 'grass', terrainType: 'grass', tonalIndex: 0, decorSeed: 0, hasTree: false, hasBush: false, hasRock: false, visibility: 'visible', id: `${x},${y}`, isOrigin: false, isChild: false, occupiedBy: null, hasRoad: false, hasRail: false, roadVariant: null, railVariant: null, wallVariant: null }
    }))
    const map = new Map(sparse.map(s => [`${s.x},${s.y}`, s]))
    for (let ay = 0; ay < size; ay++) for (let ax = 0; ax < size; ax++) {
      const x = ox + ax, y = oy + ay
      const s = map.get(`${x},${y}`)
      if (s) {
        const c = grid[ay][ax]
        c.buildingId = s.b || null
        c.terrain = s.t || 'grass'
        c.terrainType = s.tt || s.t || 'grass'
        c.isOrigin = !!s.o
        c.isChild = !!s.c2
        c.occupiedBy = s.ob || null
        c.visibility = s.v || 'visible'
        c.roadVariant = s.rv || null
        c.railVariant = s.rlv || null
        c.wallVariant = s.wv || null
        c.hasRoad = !!s.hr
        c.hasRail = !!s.hl
        // compat: si era cruce viejo con solo buildingId, marca hasRoad/hasRail
        if (c.buildingId === 'rail') c.hasRail = true
        if (['road','dirt_road','concrete_road','cobble_road'].includes(c.buildingId)) c.hasRoad = true
      }
    }
    return { grid, offX: ox, offY: oy }
  }

  function getSaveData() {
    const sparse = compressGrid(grid.value)
    return {
      version: 16,

      sparse,
      gridSize: grid.value.length,
      gridWidth: grid.value[0]?.length || 0,
      offsetX: offsetX.value,
      offsetY: offsetY.value,
      terrainSeed: terrainSeed.value,

      money: money.value,

      tickCount: tickCount.value,

      selectedTool: selectedTool.value,

      savedAt: Date.now()
    }
  }

  function saveCity() {
    return saveGame(getSaveData())
  }

  function loadFromData(saved) {
    if (!saved) return { ok: false, reason: 'No data' }
    if (!saved.version) {
      console.warn('[Jandocity] save sin versión, intenta migrar')
    } else if (saved.version < 9) {
      return { ok: false, reason: 'Cache vieja' }
    }
    let migratedGrid, offX, offY
    if (Array.isArray(saved.sparse)) {
      const size = saved.gridSize || GRID_SIZE
      const dec = decompressGrid(saved.sparse, size, saved.offsetX, saved.offsetY, saved.terrainSeed)
      migratedGrid = dec.grid
      offX = dec.offX
      offY = dec.offY
    } else if (Array.isArray(saved.grid) && Array.isArray(saved.grid[0])) {
      migratedGrid = saved.grid.map((row, y) => row.map((cell, x) => migrateGridCell({ ...cell }, x, y)))
      offX = saved.offsetX
      offY = saved.offsetY
    } else {
      return { ok: false, reason: 'Mapa corrupto' }
    }
    grid.value = migratedGrid
    if (typeof offX === 'number' && typeof offY === 'number') {
      offsetX.value = offX
      offsetY.value = offY
    } else if (typeof saved.offsetX === 'number' && typeof saved.offsetY === 'number') {
      offsetX.value = saved.offsetX
      offsetY.value = saved.offsetY
    } else {
      offsetX.value = migratedGrid[0]?.[0]?.x ?? 0
      offsetY.value = migratedGrid[0]?.[0]?.y ?? 0
    }
    if (typeof saved.terrainSeed === 'number') terrainSeed.value = saved.terrainSeed
    else terrainSeed.value = Date.now() % 2147483647
    money.value = typeof saved.money === 'number' ? saved.money : INITIAL_RESOURCES.money
    tickCount.value = typeof saved.tickCount === 'number' ? saved.tickCount : 0
    selectedTool.value = saved.selectedTool && (BUILDING_TYPES[saved.selectedTool] || saved.selectedTool === 'demolish') ? saved.selectedTool : 'residential'
    isPaused.value = false
    lastTickAt.value = null
    syncDerivedResources()
    log('💾 Mundo cargado')
    return { ok: true }
  }

  function loadCity() {
    const saved = loadGame()

    if (!saved) {
      return {
        ok: false,
        reason: 'No existe una partida guardada'
      }
    }

    if (!saved.version) {
      console.warn('[Jandocity] save sin versión, intenta migrar')
    } else if (saved.version < 9) {
      deleteSave()
      try { localStorage.clear(); } catch {}
      log('🗺️ Cache muy vieja limpiada')
      return { ok: false, reason: 'Cache borrada vieja' }
    }
    // v9..v16 son compatibles (sparse), no se borra — solo log
    if (saved.version && saved.version < 16) {
      console.log(`[Jandocity] migrando save v${saved.version} → v16`)
    }
    // Nuevo formato sparse (v15) vs viejo denso (array 2D)
    let migratedGrid, offX, offY
    if (Array.isArray(saved.sparse)) {
      const size = saved.gridSize || GRID_SIZE
      const width = saved.gridWidth || size
      // 150×150 cuadrado, si width != size usar size
      const s = size
      const dec = decompressGrid(saved.sparse, s, saved.offsetX, saved.offsetY, saved.terrainSeed)
      migratedGrid = dec.grid
      offX = dec.offX
      offY = dec.offY
    } else if (Array.isArray(saved.grid) && Array.isArray(saved.grid[0])) {
      migratedGrid = saved.grid.map((row, y) =>
        row.map((cell, x) => migrateGridCell({ ...cell }, x, y))
      )
      offX = saved.offsetX
      offY = saved.offsetY
    } else {
      deleteSave()
      return { ok: false, reason: 'Mapa corrupto' }
    }
    grid.value = migratedGrid
    if (typeof offX === 'number' && typeof offY === 'number') {
      offsetX.value = offX
      offsetY.value = offY
    } else if (typeof saved.offsetX === 'number' && typeof saved.offsetY === 'number') {
      offsetX.value = saved.offsetX
      offsetY.value = saved.offsetY
    } else {
      offsetX.value = migratedGrid[0]?.[0]?.x ?? 0
      offsetY.value = migratedGrid[0]?.[0]?.y ?? 0
    }
    if (typeof saved.terrainSeed === 'number') {
      terrainSeed.value = saved.terrainSeed
    } else {
      // generar seed determinístico del grid si es save antiguo
      terrainSeed.value = Date.now() % 2147483647
    }

    money.value =
      typeof saved.money === 'number'
        ? saved.money
        : INITIAL_RESOURCES.money

    tickCount.value =
      typeof saved.tickCount === 'number'
        ? saved.tickCount
        : 0

    selectedTool.value =
      saved.selectedTool &&
      (BUILDING_TYPES[saved.selectedTool] || saved.selectedTool === 'demolish')
        ? saved.selectedTool
        : 'residential'

    isPaused.value = false
    lastTickAt.value = null

    syncDerivedResources()

    log('💾 Ciudad cargada')

    return {
      ok: true
    }
  }

  return {
    // state
    grid,
    gridSize,
    gridWidth,
    offsetX,
    offsetY,
    terrainSeed,
    money,
    population,
    energy,
    water,
    oxygen,
    selectedTool,
    selectedRoadVariant,
    selectedRailVariant,
    selectedWallVariant,
    selectedHouseVariant,
    tickCount,
    isPaused,
    lastTickAt,
    logs,
    // getters
    flatGrid,
    stats,
    resources,
    canAfford,
    // actions
    getCell,
    selectTool,
    placeBuilding,
    demolish,
    fillTerrain,
    setTerrain,
    paintTerrain,
    isTerrainTool,
    canBuildOnTerrain,
    checkAndExpandGrid,
    updateFogOfWar,
    tick,
    resetCity,
    togglePause,
    pause,
    resume,
    syncDerivedResources,
    getSaveData,
    saveCity,
    flushSave,
    loadCity,
    loadFromData,
    deleteSave
  }
})
