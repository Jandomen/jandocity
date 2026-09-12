<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { canPlaceAt, isAdjacentToWater } from '@/composables/useCityEngine.js'
import { useCamera } from '@/composables/useCamera.js'
import TerrainLayer from './TerrainLayer.vue'
import RoadLayer from './RoadLayer.vue'
import RailLayer from './RailLayer.vue'
import WallLayer from './WallLayer.vue'
import BuildingLayer from './BuildingLayer.vue'
import CellTile from './CellTile.vue'
import Player from './Player.vue'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useBuildQueue } from '@/composables/useBuildQueue.js'
import { useUnitQueue } from '@/composables/useUnitQueue.js'
import { useSelection } from '@/composables/useSelection.js'
import { BUILDINGS } from '@/constants/buildings.js'
import VehicleLayer from './VehicleLayer.vue'
import AirportPlaneLayer from './AirportPlaneLayer.vue'
import MultiplayerPlayersLayer from './MultiplayerPlayersLayer.vue'
import { useAudioManager } from '@/audio/audioManager.js'
import { usePerformance } from '@/composables/usePerformance.js'
import { watch } from 'vue'

const props = defineProps({
  class: { type: String, default: '' },
  showUi: { type: Boolean, default: true }
})
const emit = defineEmits(['toggleUi','openChat'])

const city = useCityStore()
const player = usePlayerStore()
const traffic = useTrafficStore()
const single = useSinglePlayerStore()
const buildQueue = useBuildQueue()
const unitQueue = useUnitQueue()
const selection = useSelection()
const audioMgr = useAudioManager()
const perf = usePerformance()
const filteredBuildQueue = computed(() => (buildQueue.queue.value || []).filter(q=>!isNaN(q.progress) && q.progress!==undefined))
const filteredUnitQueue = computed(() => (unitQueue.queue.value || []).filter(q=>!isNaN(q.progress) && q.progress!==undefined))
const gridSize = computed(() => city.gridSize || 20)
const gridWidth = computed(() => city.gridWidth || 20)
const gridHeight = computed(() => city.gridSize || 20)
const camera = useCamera()

// Cámara sigue al protagonista como GTA — centra al jugador
// Usa coordenadas locales (con offset) para que el jugador quede en centro de pantalla
watch(() => [player.x, player.y, city.offsetX, city.offsetY], () => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0
  const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0
  const localX = (player.x - ox) * 48 + 24
  const localY = (player.y - oy) * 48 + 24
  camera.x.value = vw/2 - localX * camera.scale.value
  camera.y.value = vh/2 - localY * camera.scale.value
}, { immediate: true })

let wasDragging = false
const isHoveringGrid = ref(false)
const isPainting = ref(false)
const showQuadrants = ref(false)
const activeQuadrant = ref(null) // {qx, qy} o null

let rightDownPos = null
function handlePointerDown(e) {
  if (e.button === 2) rightDownPos = { x: e.clientX, y: e.clientY }
  if (e.button === 0 && city.selectedTool && city.selectedTool !== 'demolish') {
    isPainting.value = true
  }
  camera.onPointerDown(e)
}
function handlePointerMove(e) { camera.onPointerMove(e) }
function handlePointerUp(e) {
  const dragged = camera.onPointerUp(e)
  wasDragging = !!dragged
  isPainting.value = false
  if (wasDragging) {
    setTimeout(() => { wasDragging = false }, 50)
  }
  // Click derecho sin arrastre → demoler (funciona también en celdas hijas 2×2/3×3)
  if (e.button === 2 && !dragged && rightDownPos) {
    const dx = e.clientX - rightDownPos.x, dy = e.clientY - rightDownPos.y
    if (Math.hypot(dx, dy) < 10) {
      const rect = e.currentTarget.getBoundingClientRect()
      const localX = (e.clientX - rect.left - camera.x.value) / camera.scale.value
      const localY = (e.clientY - rect.top - camera.y.value) / camera.scale.value
      const ax = Math.floor(localX / 48), ay = Math.floor(localY / 48)
      const wx = city.offsetX + ax, wy = city.offsetY + ay
      const cell = city.getCell(wx, wy)
      if (cell && (cell.buildingId || cell.isChild || cell.terrain === 'water' || cell.terrainType === 'water' || cell.terrain === 'deep_water' || cell.terrainType === 'deep_water')) {
        const res = city.demolish(wx, wy)
        if (!res.ok && res.reason) showAviso(res.reason)
        else showAviso(`Demolido en (${wx},${wy})`)
      } else if (cell) {
        showAviso('Nada que demoler aquí')
      }
    }
  }
  rightDownPos = null
}

const showGrid = computed(() => !!city.selectedTool || isHoveringGrid.value)

const quadrants = computed(() => {
  const list = []
  const cols = Math.ceil(gridWidth.value / 10)
  const rows = Math.ceil(gridHeight.value / 10)
  for (let qy = 0; qy < rows; qy++) for (let qx = 0; qx < cols; qx++) list.push({ qx, qy })
  return list
})

const visibleRange = computed(() => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1920
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1080
  const s = camera.scale.value
  const overscan = perf.preset.value.visibleOverscan ?? 2
  const localLeft = (-camera.x.value) / s
  const localTop = (-camera.y.value) / s
  const localRight = (vw - camera.x.value) / s
  const localBottom = (vh - camera.y.value) / s
  const startX = Math.max(0, Math.floor(localLeft / 48) - overscan)
  const endX = Math.min(gridWidth.value, Math.ceil(localRight / 48) + overscan)
  const startY = Math.max(0, Math.floor(localTop / 48) - overscan)
  const endY = Math.min(gridHeight.value, Math.ceil(localBottom / 48) + overscan)
  return { startX, endX, startY, endY }
})

const visibleRows = computed(() => {
  const { startX, endX, startY, endY } = visibleRange.value
  return city.grid.slice(startY, endY).map(row => row.slice(startX, endX))
})

function onKeydown(e) {
  const isTyping = document.activeElement?.tagName === 'INPUT' || document.activeElement?.isContentEditable
  if (isTyping) return
  if (e.key.toLowerCase() === 'i' && !e.ctrlKey && !e.metaKey) {
    // Expansión manual con I — en dirección del protagonista
    const dirMap = { up: [0,-1,'north'], down: [0,1,'south'], left: [-1,0,'west'], right: [1,0,'east'] }
    const [dx, dy, dir] = dirMap[player.dir] || [1,0,'east']
    city.expandGrid(dir, 10)
    e.preventDefault()
    return
  }
  if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) {
    showQuadrants.value = !showQuadrants.value
    e.preventDefault()
    return
  }
  if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())) {
    const moves = { w:[0,-1], arrowup:[0,-1], s:[0,1], arrowdown:[0,1], a:[-1,0], arrowleft:[-1,0], d:[1,0], arrowright:[1,0] }
    const [dx,dy] = moves[e.key.toLowerCase()] || [0,0]
    if (player.move(dx, dy, city.grid)) {
      // Al moverse a nuevo cuadrante (10×10), activarlo
      const qx = Math.floor(player.x / 10), qy = Math.floor(player.y / 10)
      activeQuadrant.value = { qx, qy }
      e.preventDefault()
    }
    return
  }
  camera.onKeydown(e)
}

function toggleQuadrant(qx, qy) {
  if (activeQuadrant.value?.qx === qx && activeQuadrant.value?.qy === qy) activeQuadrant.value = null
  else activeQuadrant.value = { qx, qy }
}

let buildTick = null
let selTick = null
function startTicks() {
  if (buildTick) clearInterval(buildTick)
  if (selTick) clearInterval(selTick)
  const bMs = perf.preset.value.buildTickMs ?? 100
  const sMs = perf.preset.value.selectionTickMs ?? 420
  buildTick = setInterval(() => { if (single.isActive) { buildQueue.tick(bMs); unitQueue.tick(bMs) } }, bMs)
  selTick = setInterval(() => { if (single.isActive) selection.tick() }, sMs)
}
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  startTicks()
  // re-evaluar al cambiar calidad
  watch(() => perf.effectiveQuality.value, startTicks)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (buildTick) clearInterval(buildTick)
  if (selTick) clearInterval(selTick)
})

const terrainToolMap = { lake: 'water', deep_lake: 'deep_water', sand_brush: 'sand', forest_brush: 'forest', grass_brush: 'grass', concrete_brush: 'concrete', tile_brush: 'tile', wood_brush: 'wood', marble_brush: 'marble', stone_brush: 'stone' }
const VEHICLE_TYPES = ['car','pickup','moto','trailer','bus','train']
const aviso = ref(null)
let avisoTimer = null
function showAviso(msg) {
  aviso.value = msg
  city.logs.unshift(`[Aviso] ${msg}`)
  if (city.logs.length > 50) city.logs.pop()
  clearTimeout(avisoTimer)
  avisoTimer = setTimeout(() => aviso.value = null, 2600)
}

const hasAnyWater = computed(() => {
  for (const row of city.grid) for (const c of row) if (c.terrain === 'water' || c.terrain === 'deep_water') return true
  return false
})
function broadcastIfMulti(x,y,buildingId) {
  try { window.dispatchEvent(new CustomEvent('multi-build-local', { detail: { x, y, buildingId } })) } catch {}
}

function getValidation(cell) {
  if (!city.selectedTool) return { ok: false, reason: null }
  if (city.selectedTool === 'demolish') {
    const hasBuilding = !!cell.buildingId || !!cell.isChild
    const hasTerrain = cell.terrain && cell.terrain !== 'grass'
    const ok = hasBuilding || hasTerrain
    return { ok, reason: ok ? null : 'Nada que demoler' }
  }
  if (city.selectedTool === 'fill') {
    const isWater = cell.terrain === 'water' || cell.terrain === 'deep_water' || cell.terrainType === 'water' || cell.terrainType === 'deep_water'
    if (!isWater) return { ok: false, reason: 'Solo agua se puede retirar' }
    if (city.money < 25) return { ok: false, reason: 'Fondos insuficientes (25💰)' }
    return { ok: true, reason: null }
  }
  if (terrainToolMap[city.selectedTool]) {
    const t = terrainToolMap[city.selectedTool]
    if (cell.buildingId) return { ok: false, reason: 'Hay un edificio encima' }
    if (cell.terrain === t) return { ok: false, reason: 'Ya es ' + t }
    const cost = { lake: 15, deep_lake: 20, sand_brush: 8, forest_brush: 12, grass_brush: 10, concrete_brush: 10, tile_brush: 12, wood_brush: 12, marble_brush: 14, stone_brush: 10 }[city.selectedTool] || 0
    if (city.money < cost) return { ok: false, reason: `Fondos insuficientes (${cost}💰)` }
    if ((t === 'water' || t === 'deep_water') && hasAnyWater.value && !isAdjacentToWater(city.grid, cell.x, cell.y, 1, 1)) {
      return { ok: false, reason: 'Estanque requiere río/lago cerca — pinta pegado al agua 🌊' }
    }
    return { ok: true, reason: null }
  }
  return canPlaceAt(city.grid, cell.x, cell.y, city.selectedTool, city.money)
}

function handleCellClick(cell) {
  if (wasDragging) return
  // Un jugador: selección y órdenes
  if (single.isActive) {
    const humanId = single.humanPlayer()?.id || 'p0'
    const pedAt = traffic.pedestrians.find(p => p.x === cell.x && p.y === cell.y)
    const vehAt = traffic.vehicles.find(v => v.x === cell.x && v.y === cell.y)
    const ownPed = pedAt && pedAt.owner === humanId
    const ownVeh = vehAt && vehAt.owner === humanId
    if (ownPed) { selection.selectPed(pedAt.id, false); showAviso(`Seleccionado ${pedAt.kind} HP:${pedAt.hp||100}`); return }
    if (ownVeh) { selection.selectVeh(vehAt.id, false); showAviso(`Seleccionado ${vehAt.type} HP:${vehAt.hp||100}`); return }
    if (selection.selected.value.length > 0) {
      // click en objetivo enemigo o suelo
      let targetInfo = null
      if (pedAt && pedAt.owner !== humanId) targetInfo = { type: 'ped', id: pedAt.id, isEnemy: true }
      else if (vehAt && vehAt.owner !== humanId) targetInfo = { type: 'veh', id: vehAt.id, isEnemy: true }
      else {
        let origin = cell
        if (cell.isChild && cell.occupiedBy) origin = city.getCell(cell.occupiedBy.x, cell.occupiedBy.y) || cell
        if (origin && origin.buildingId) {
          // si tiene owner enemigo o es edificio enemigo (en single todo lo no tuyo es enemigo)
          const isEnemy = !origin.owner || origin.owner !== humanId
          if (isEnemy) targetInfo = { type: 'building', id: origin.id, isEnemy: true, buildingId: origin.buildingId }
        }
      }
      // si hay objetivo enemigo o suelo, ordena
      if (targetInfo || (!pedAt && !vehAt)) {
        selection.commandTo(cell.x, cell.y, targetInfo)
        showAviso(targetInfo ? `⚔️ Atacando ${targetInfo.type}` : `🏃 Moviendo a (${cell.x},${cell.y})`)
        return
      }
    }
    // si no hay selección y no se seleccionó unidad propia, sigue a construcción si hay herramienta
    if (!city.selectedTool) {
      // click vacío sin selección limpia selección
      if (selection.selected.value.length) selection.clear()
      return
    }
  } else {
    if (!city.selectedTool) return
  }
  if (city.selectedTool === 'demolish') {
    const res = city.demolish(cell.x, cell.y)
    if (!res.ok && res.reason) showAviso(res.reason)
    return
  }
  if (['car','pickup','moto','trailer','bus','train','boat_small','patrol_boat','cargo_ship'].includes(city.selectedTool)) {
    const isTrain = city.selectedTool === 'train'
    const isBoat = ['boat_small','patrol_boat','cargo_ship'].includes(city.selectedTool)
    const res = traffic.addVehicle(cell.x, cell.y, city.selectedTool)
    if (!res.ok) showAviso(isTrain ? 'Tren solo sobre rieles 🛤️' : isBoat ? 'Solo sobre agua' : res.reason)
    else {
      const cost = {car:25,pickup:35,moto:18,trailer:45,bus:40,train:50,boat_small:40,patrol_boat:80,cargo_ship:180}[city.selectedTool]||25
      if (city.money >= cost) {
        city.money -= cost
        showAviso(`${city.selectedTool} colocado y navega solo ${isTrain ? '🛤️' : isBoat ? '🌊' : '🛣️'}`)
      } else showAviso('Fondos insuficientes')
    }
    return
  }
  if (terrainToolMap[city.selectedTool]) {
    const t = terrainToolMap[city.selectedTool]
    const cost = { lake: 15, deep_lake: 20, sand_brush: 8, forest_brush: 12, grass_brush: 10, concrete_brush: 10, tile_brush: 12, wood_brush: 12, marble_brush: 14, stone_brush: 10 }[city.selectedTool] || 0
    const res = city.paintTerrain(cell.x, cell.y, t, cost)
    if (!res.ok && res.reason) showAviso(`${res.reason} en (${cell.x},${cell.y})`)
    return
  }
  // Un jugador: construcción con tiempo 0-100%
  if (single.isActive) {
    let effectiveTool = city.selectedTool
    if (effectiveTool === 'residential' && city.selectedHouseVariant !== 'residential') effectiveTool = city.selectedHouseVariant
    const dur = buildQueue.durationFor(effectiveTool)
    if (dur === 0) {
      const res = city.placeBuildingAt(cell.x, cell.y, effectiveTool, single.humanPlayer()?.id || 'p0')
      if (!res.ok && res.reason) showAviso(`${res.reason} en (${cell.x},${cell.y})`)
      else { single.hasEverBuilt = true; broadcastIfMulti(cell.x, cell.y, effectiveTool) }
      return
    } else {
      if (buildQueue.findAt(cell.x, cell.y)) { showAviso('Ya en construcción en ('+cell.x+','+cell.y+')'); return }
      const validation = canPlaceAt(city.grid, cell.x, cell.y, effectiveTool, city.money)
      if (!validation.ok) { showAviso(`${validation.reason} en (${cell.x},${cell.y})`); return }
      const added = buildQueue.add(cell.x, cell.y, effectiveTool, single.humanPlayer()?.id || 'p0')
      if (!added) { showAviso('Fondos insuficientes o ya en cola'); return }
      showAviso(`En construcción ${BUILDINGS[effectiveTool]?.label || effectiveTool} ${Math.round(added.progress)}%`)
      // broadcast también para cola (cuando termine se hace via buildQueue watcher en App)
      broadcastIfMulti(cell.x, cell.y, effectiveTool)
      return
    }
  }
  const res = city.placeBuilding(cell.x, cell.y)
  if (!res.ok && res.reason) showAviso(`${res.reason} en (${cell.x},${cell.y})`)
  else {
    broadcastIfMulti(cell.x, cell.y, city.selectedTool)
    // Tras 10 casas de cualquier tipo, spawnea peatones automáticamente
    const houseCount = city.grid.flat().filter(c => c.isOrigin && ['residential','residential_small','residential_medium','residential_large','tower_residential','apartment_block','skyscraper'].includes(c.buildingId)).length
    if (houseCount >= 10 && houseCount % 5 === 0 && traffic.pedestrians.length < 20) {
      const kinds = ['child','girl','lady','man','boy']
      const k = kinds[Math.floor(Math.random()*kinds.length)]
      traffic.addPedestrian(cell.x, cell.y, k)
    }
  }
}

function handleCellEnter(cell) {
  if (!isPainting.value) return
  if (wasDragging) return
  if (!city.selectedTool) return
  // Demoler arrastrando (como pintar) — sin spam de aviso
  if (city.selectedTool === 'demolish') {
    city.demolish(cell.x, cell.y)
    return
  }
  if (terrainToolMap[city.selectedTool]) {
    const t = terrainToolMap[city.selectedTool]
    const cost = { lake: 15, deep_lake: 20, sand_brush: 8, forest_brush: 12, grass_brush: 10, concrete_brush: 10, tile_brush: 12, wood_brush: 12, marble_brush: 14, stone_brush: 10 }[city.selectedTool] || 0
    const res = city.paintTerrain(cell.x, cell.y, t, cost)
    if (!res.ok && res.reason && !res.reason.startsWith('Ya es')) showAviso(res.reason)
    return
  }
  if (single.isActive) {
    let effectiveTool = city.selectedTool
    if (effectiveTool === 'residential' && city.selectedHouseVariant !== 'residential') effectiveTool = city.selectedHouseVariant
    const dur = buildQueue.durationFor(effectiveTool)
    if (dur === 0) {
      const res = city.placeBuildingAt(cell.x, cell.y, effectiveTool, single.humanPlayer()?.id || 'p0')
      if (!res.ok && res.reason) console.warn(`[Jandocity] ${res.reason} en (${cell.x},${cell.y})`)
      return
    } else {
      if (buildQueue.findAt(cell.x, cell.y)) return
      const validation = canPlaceAt(city.grid, cell.x, cell.y, effectiveTool, city.money)
      if (!validation.ok) return
      buildQueue.add(cell.x, cell.y, effectiveTool, single.humanPlayer()?.id || 'p0')
      return
    }
  }
  const res = city.placeBuilding(cell.x, cell.y)
  if (!res.ok && res.reason) {
    console.warn(`[Jandocity] ${res.reason} en (${cell.x},${cell.y})`)
  }
}
</script>

<template>
  <!-- Viewport principal único w-full h-full — fondo oscuro estrellado -->
  <main
    class="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0f1e] touch-none select-none m-0 p-0"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointerleave="handlePointerUp"
    @wheel.prevent="camera.onWheel"
    @contextmenu.prevent
  >
    <!-- Fondo estrellado -->
    <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(1px 1px at 20% 30%, #fff 100%, transparent 100%), radial-gradient(1px 1px at 40% 70%, #fff 100%, transparent 100%), radial-gradient(1px 1px at 80% 20%, #fff 100%, transparent 100%), radial-gradient(1.2px 1.2px at 60% 50%, #fff 100%, transparent 100%), radial-gradient(1px 1px at 10% 80%, #fff 100%, transparent 100%), radial-gradient(0.8px 0.8px at 90% 90%, #fff 100%, transparent 100%); background-size: 280px 280px; opacity: 0.45;"></div>
    <!-- Contenedor con dimensiones fijas 48×GRID — crece hacia afuera, matriz 150×150 -->
    <div
      class="absolute top-0 left-0 will-change-transform bg-[#0a0f1e] m-0 p-0 border-0 shadow-none"
      :style="{ 
        transform: camera.transform.value,
        width: `${gridWidth * 48}px`,
        height: `${gridHeight * 48}px`
      }"
      @mouseenter="isHoveringGrid = true"
      @mouseleave="isHoveringGrid = false"
    >
      <div class="absolute inset-0">
        <TerrainLayer :grid="city.grid" :visible-rows="visibleRows" />
        <RoadLayer :grid="city.grid" :visible-rows="visibleRows" />
        <RailLayer :grid="city.grid" :visible-rows="visibleRows" />
        <WallLayer :grid="city.grid" :visible-rows="visibleRows" />
        <BuildingLayer :grid="city.grid" :visible-rows="visibleRows" />
        <VehicleLayer />
        <AirportPlaneLayer />
        <Player />
        <MultiplayerPlayersLayer />
      </div>

      <!-- Hitbox virtualizado — celdas 48×48 fijas, coordenadas mundo corregidas con offset -->
      <div class="absolute inset-0">
        <template v-for="(row, rowIdx) in visibleRows" :key="rowIdx">
          <CellTile
            v-for="cell in row"
            :key="cell.id"
            :cell="cell"
            :selected-tool="city.selectedTool"
            :validation="getValidation(cell)"
            :show-grid="showGrid"
            @click-cell="handleCellClick(cell)"
            @mouseenter="handleCellEnter(cell)"
            :style="{ position: 'absolute', left: (cell.x - city.offsetX) * 48 + 'px', top: (cell.y - city.offsetY) * 48 + 'px' }"
          />
        </template>
      </div>

      <!-- Cola construcción Un Jugador 0-100% — solo barra, sin azul -->
      <div v-if="single.isActive" class="absolute inset-0 pointer-events-none">
        <div
          v-for="q in filteredBuildQueue"
          :key="'bq'+q.id"
          class="absolute flex flex-col items-center justify-center border-2 border-dashed rounded overflow-hidden bg-black/20 backdrop-blur-[1px]"
          :style="{
            left: (q.x - city.offsetX) * 48 + 'px',
            top: (q.y - city.offsetY) * 48 + 'px',
            width: q.w * 48 + 'px',
            height: q.h * 48 + 'px',
            borderColor: '#6b7280'
          }"
        >
          <div class="absolute inset-0 flex items-center justify-center opacity-40">
            <span class="text-[18px]">{{ BUILDINGS[q.buildingId]?.icon || '🏗️' }}</span>
          </div>
          <div class="relative z-10 flex flex-col items-center gap-0.5 bg-black/70 backdrop-blur px-2 py-1 rounded-full border border-white/20 shadow">
            <span class="text-[11px] font-black text-white leading-none">{{ Math.round(q.progress || 0) }}%</span>
            <span class="text-[7px] font-bold text-white/70 leading-none">{{ BUILDINGS[q.buildingId]?.label || q.buildingId }}</span>
          </div>
          <div class="absolute bottom-1 left-1 right-1 h-2 bg-black/60 rounded-full overflow-hidden border border-white/20">
            <div class="h-full bg-white transition-all duration-100" :style="{ width: (q.progress || 0) + '%' }"></div>
          </div>
        </div>
      </div>
      <!-- Cola unidades (policía/soldado/tanque) -->
      <div v-if="single.isActive" class="absolute inset-0 pointer-events-none">
        <div
          v-for="q in filteredUnitQueue"
          :key="'uq'+q.id"
          class="absolute flex flex-col items-center justify-center rounded border border-white/20 bg-black/50 backdrop-blur"
          :style="{
            left: (q.bx - city.offsetX) * 48 + 'px',
            top: (q.by - city.offsetY) * 48 - 14 + 'px',
            width: (BUILDINGS[q.buildingId]?.width || 2) * 48 + 'px',
            height: '14px'
          }"
        >
          <div class="w-full h-full flex items-center gap-1 px-1">
            <span class="text-[8px] leading-none">{{ q.unitType==='police' ? '👮' : q.unitType==='police_car' ? '🚔' : q.unitType==='soldier' ? '🪖' : q.unitType==='soldier_heavy' ? '🎖️' : q.unitType==='army_jeep' ? '🚙' : q.unitType==='tank' ? '🛡️' : q.unitType==='tractor' ? '🚜' : '💣' }}</span>
            <div class="flex-1 h-1 bg-black/40 rounded-full overflow-hidden border border-white/10"><div class="h-full bg-amber-400" :style="{width: q.progress+'%'}"></div></div>
            <span class="text-[7px] font-mono text-white">{{ Math.round(q.progress) }}%</span>
          </div>
        </div>
      </div>

      <!-- Overlay cuadrantes 10×10 — M para activar/desactivar -->
      <div v-if="showQuadrants" class="absolute inset-0 pointer-events-none">
        <div
          v-for="q in quadrants"
          :key="`${q.qx}-${q.qy}`"
          class="absolute border-2 pointer-events-auto cursor-pointer flex items-center justify-center text-[10px] font-bold backdrop-blur-[1px]"
          :class="activeQuadrant?.qx===q.qx && activeQuadrant?.qy===q.qy ? 'border-emerald-400 bg-emerald-400/20 text-emerald-100' : 'border-black/50 bg-black/10 text-white/70 hover:bg-white/10'"
          :style="{ left: q.qx*10*48 + 'px', top: q.qy*10*48 + 'px', width: Math.min(10, gridWidth-q.qx*10)*48 + 'px', height: Math.min(10, gridHeight-q.qy*10)*48 + 'px' }"
          @click="toggleQuadrant(q.qx, q.qy)"
        >
          {{ q.qx }},{{ q.qy }} {{ activeQuadrant?.qx===q.qx && activeQuadrant?.qy===q.qy ? '● ACTIVO' : '○' }}
        </div>
      </div>
    </div>

    <!-- Aviso centrado (casas sin camino, estanque sin agua, etc.) -->
    <Transition name="fade">
      <div v-if="aviso" class="absolute left-1/2 -translate-x-1/2 top-[88px] z-30 pointer-events-none">
        <div class="bg-amber-900/90 backdrop-blur border border-amber-600 text-amber-100 px-4 py-2 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-xs font-semibold flex items-center gap-2 max-w-[90vw]">
          <span>⚠️</span><span>{{ aviso }}</span>
        </div>
      </div>
    </Transition>

    <!-- Controles PC — solo desktop, ocultos en móvil/APK -->
    <Transition name="fade">
      <div v-show="props.showUi" class="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-[62px] z-10 items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-white/80">
      <span>🖱️ Izq pinta • Der demuele • Central arrastra • Rueda zoom • WASD</span>
      <span class="opacity-40">|</span>
      <span class="font-mono">{{ Math.round(camera.scale.value * 100) }}%</span>
      <button @click="() => { camera.scale.value = 1; const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0; const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0; const lx = (player.x - ox)*48+24; const ly = (player.y - oy)*48+24; camera.x.value = window.innerWidth/2 - lx*camera.scale.value; camera.y.value = window.innerHeight/2 - ly*camera.scale.value }" class="ml-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px]">⌖ Centrar 100%</button>
      <span class="opacity-40">|</span>
      <span class="flex items-center gap-1 text-emerald-300 font-semibold">
        <span class="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">I</span>
        <span>expande +10 hacia {{ {up:'↑ N',down:'↓ S',left:'← O',right:'→ E'}[player.dir] || '→' }}</span>
      </span>
    </div>
    </Transition>
    <!-- Botones flotantes transparentes solo móvil/APK — izquierda (joystick va a la derecha) -->
    <div class="md:hidden absolute bottom-4 left-4 z-30 flex flex-col gap-2 pointer-events-auto">
      <button @click="() => { audioMgr.init(); if(audioMgr.music.isMuted) audioMgr.music.unmute(0.34); const next = audioMgr.music.next(); city.logs.unshift(`[Audio] ▶ ${audioMgr.music.tracks[next].label} (${audioMgr.music.tracks[next].mood})`); if(city.logs.length>50) city.logs.pop(); try{ (globalThis||window).dispatchEvent(new CustomEvent('track-toast', {detail: next})) }catch{} }" class="w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white flex items-center justify-center text-[14px]" title="Cambiar música">🎵</button>
      <button @click="() => { camera.scale.value = 1; const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0; const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0; const lx = (player.x - ox)*48+24; const ly = (player.y - oy)*48+24; camera.x.value = window.innerWidth/2 - lx*camera.scale.value; camera.y.value = window.innerHeight/2 - ly*camera.scale.value }" class="w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white flex items-center justify-center text-[14px]" title="Centrar 100%">⌖</button>
      <button @click="emit('openChat')" class="w-10 h-10 rounded-full bg-sky-600/50 backdrop-blur border border-white/20 text-white flex items-center justify-center text-[14px]" title="Chat (T)">💬</button>
      <button @click="emit('toggleUi')" class="w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white flex items-center justify-center text-[16px]" :class="props.showUi ? 'bg-black/30' : 'bg-emerald-600/50 border-emerald-400/50'" :title="props.showUi ? 'Ocultar menú' : 'Mostrar menú'">{{ props.showUi ? '🙈' : '👁️' }}</button>
      <button @click="city.selectedTool = city.selectedTool==='demolish' ? null : 'demolish'" class="w-10 h-10 rounded-full backdrop-blur border text-white flex items-center justify-center" :class="city.selectedTool==='demolish' ? 'bg-red-600/60 border-red-400/50 ring-1 ring-red-400' : 'bg-red-600/40 border-white/20'" title="Demoler (mantén pulsado para borrar)">🧨</button>
    </div>
  </main>
</template>
