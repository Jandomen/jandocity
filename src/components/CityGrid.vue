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
import VehicleLayer from './VehicleLayer.vue'
import AirportPlaneLayer from './AirportPlaneLayer.vue'
import { watch } from 'vue'

const props = defineProps({
  class: { type: String, default: '' },
  showUi: { type: Boolean, default: true }
})
const emit = defineEmits(['toggleUi'])

const city = useCityStore()
const player = usePlayerStore()
const traffic = useTrafficStore()
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
  // Coordenadas locales (dentro del contenedor) visibles — no hay que restar ox/oy porque el contenedor ya está en coords locales
  const localLeft = (-camera.x.value) / s
  const localTop = (-camera.y.value) / s
  const localRight = (vw - camera.x.value) / s
  const localBottom = (vh - camera.y.value) / s
  const startX = Math.max(0, Math.floor(localLeft / 48) - 2)
  const endX = Math.min(gridWidth.value, Math.ceil(localRight / 48) + 2)
  const startY = Math.max(0, Math.floor(localTop / 48) - 2)
  const endY = Math.min(gridHeight.value, Math.ceil(localBottom / 48) + 2)
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

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

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
  if (!city.selectedTool) return
  if (city.selectedTool === 'demolish') {
    const res = city.demolish(cell.x, cell.y)
    if (!res.ok && res.reason) showAviso(res.reason)
    return
  }
  if (['car','pickup','moto','trailer','bus','train'].includes(city.selectedTool)) {
    const isTrain = city.selectedTool === 'train'
    const res = traffic.addVehicle(cell.x, cell.y, city.selectedTool)
    if (!res.ok) showAviso(isTrain ? 'Tren solo sobre rieles 🛤️' : res.reason)
    else {
      const cost = {car:25,pickup:35,moto:18,trailer:45,bus:40,train:50}[city.selectedTool]||25
      if (city.money >= cost) {
        city.money -= cost
        showAviso(`${city.selectedTool} colocado y circula solo ${isTrain ? '🛤️' : '🛣️'}`)
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
  const res = city.placeBuilding(cell.x, cell.y)
  if (!res.ok && res.reason) showAviso(`${res.reason} en (${cell.x},${cell.y})`)
  else {
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
  const res = city.placeBuilding(cell.x, cell.y)
  if (!res.ok && res.reason) {
    console.warn(`[Jandocity] ${res.reason} en (${cell.x},${cell.y})`)
  }
}
</script>

<template>
  <!-- Viewport principal único w-full h-full — sin bordes oscuros, fusión limpia -->
  <main
    class="absolute inset-0 w-full h-full overflow-hidden bg-[#22c55e] touch-none select-none m-0 p-0"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointerleave="handlePointerUp"
    @wheel.prevent="camera.onWheel"
    @contextmenu.prevent
  >
    <!-- Contenedor con dimensiones fijas 48×GRID — crece hacia afuera sin redimensionar celdas, fusión invisible con #22c55e -->
    <div
      class="absolute top-0 left-0 will-change-transform bg-[#22c55e] m-0 p-0 border-0 shadow-none"
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
      <button @click="() => { const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0; const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0; const lx = (player.x - ox)*48+24; const ly = (player.y - oy)*48+24; camera.x.value = window.innerWidth/2 - lx*camera.scale.value; camera.y.value = window.innerHeight/2 - ly*camera.scale.value }" class="ml-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px]">⟲ Centrar</button>
      <span class="opacity-40">|</span>
      <span class="flex items-center gap-1 text-emerald-300 font-semibold">
        <span class="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">I</span>
        <span>expande +10 hacia {{ {up:'↑ N',down:'↓ S',left:'← O',right:'→ E'}[player.dir] || '→' }}</span>
      </span>
    </div>
    </Transition>
    <!-- Botones flotantes transparentes solo móvil/APK — izquierda (joystick va a la derecha) -->
    <div class="md:hidden absolute bottom-4 left-4 z-30 flex flex-col gap-2 pointer-events-auto">
      <button @click="() => { const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0; const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0; const lx = (player.x - ox)*48+24; const ly = (player.y - oy)*48+24; camera.x.value = window.innerWidth/2 - lx*camera.scale.value; camera.y.value = window.innerHeight/2 - ly*camera.scale.value }" class="w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white flex items-center justify-center">⟲</button>
      <button @click="emit('toggleUi')" class="w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white text-lg font-bold" :class="props.showUi ? 'bg-black/30' : 'bg-emerald-600/50 border-emerald-400/50'" title="Ocultar/mostrar menú">?</button>
      <button @click="city.selectedTool = city.selectedTool==='fill' ? null : 'fill'" class="w-10 h-10 rounded-full backdrop-blur border text-white text-lg flex items-center justify-center" :class="city.selectedTool==='fill' ? 'bg-amber-600/60 border-amber-400/50 ring-1 ring-amber-400' : 'bg-black/30 border-white/20'" title="Retirar / Rellenar agua">−</button>
      <button @click="city.selectedTool = city.selectedTool==='demolish' ? null : 'demolish'" class="w-10 h-10 rounded-full backdrop-blur border text-white flex items-center justify-center" :class="city.selectedTool==='demolish' ? 'bg-red-600/60 border-red-400/50 ring-1 ring-red-400' : 'bg-red-600/40 border-white/20'" title="Demoler (mantén pulsado para borrar)">🧨</button>
    </div>
  </main>
</template>
