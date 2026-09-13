<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useCamera } from '@/composables/useCamera.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { WEAPONS } from '@/config/weapons.js'

const props = defineProps({ show: Boolean, targeting: Boolean })
const emit = defineEmits(['close','strike','cancelTargeting'])
const city = useCityStore()
const single = useSinglePlayerStore()
const camera = useCamera()
const player = usePlayerStore()
const canvasRef = ref(null)
const hoverPos = ref(null)
const sliderX = ref(50)
const sliderY = ref(50)
const pendingWeapon = computed(() => city.pendingRemoteWeapon || null)
const isTargeting = computed(() => props.targeting || !!pendingWeapon.value)
const weaponInfo = computed(() => WEAPONS.find(w => w.id === pendingWeapon.value) || null)
const radius = computed(() => weaponInfo.value?.radius ?? 1)

function draw() {
  const c = canvasRef.value
  if (!c) return
  const ctx = c.getContext('2d')
  const size = city.grid.length
  const w = size, h = size
  c.width = w
  c.height = h
  // fondo verde terreno
  ctx.fillStyle = '#22c55e'
  ctx.fillRect(0,0,w,h)
  // agua
  for (let y=0; y<h; y++) for (let x=0; x<w; x++) {
    const cell = city.grid[y]?.[x]
    if (!cell) continue
    if (cell.terrain === 'water' || cell.terrain === 'deep_water') {
      ctx.fillStyle = cell.terrain === 'deep_water' ? '#0284c7' : '#38bdf8'
      ctx.fillRect(x,y,1,1)
    } else if (cell.terrain === 'rubble') {
      ctx.fillStyle = '#57534e'
      ctx.fillRect(x,y,1,1)
    } else if (cell.terrain === 'scorched') {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(x,y,1,1)
    } else if (cell.terrain === 'dirt') {
      ctx.fillStyle = '#a16207'
      ctx.fillRect(x,y,1,1)
    } else if (cell.terrain === 'concrete' || cell.terrain === 'tile' || cell.terrain === 'stone') {
      ctx.fillStyle = '#9ca3af'
      ctx.fillRect(x,y,1,1)
    }
  }
  // edificios / carreteras como puntitos
  for (let y=0; y<h; y++) for (let x=0; x<w; x++) {
    const cell = city.grid[y]?.[x]
    if (!cell) continue
    if (cell.buildingId) {
      if (single.isActive && cell.owner) {
        const p = single.players.find(pl=>pl.id===cell.owner)
        ctx.fillStyle = p ? p.bg : '#000'
      } else {
        ctx.fillStyle = '#000'
      }
      ctx.fillRect(x,y,1,1)
    } else if (cell.hasRoad || cell.hasRail) {
      ctx.fillStyle = single.isActive && cell.owner ? (single.players.find(pl=>pl.id===cell.owner)?.bg || '#334155') : '#1f2937'
      ctx.fillRect(x,y,1,1)
    }
  }
  // rubble overlay ya pintado, preview targeting
  if (hoverPos.value && isTargeting.value) {
    const r = radius.value
    ctx.fillStyle = 'rgba(239,68,68,0.35)'
    ctx.strokeStyle = 'rgba(239,68,68,0.9)'
    ctx.lineWidth = 0.6
    const gx = hoverPos.value.ax
    const gy = hoverPos.value.ay
    for (let dy=-r; dy<=r; dy++) for (let dx=-r; dx<=r; dx++) {
      const px = gx + dx
      const py = gy + dy
      if (px>=0 && px<w && py>=0 && py<h) {
        ctx.fillRect(px, py, 1, 1)
      }
    }
    // borde
    ctx.strokeRect(gx - r + 0.15, gy - r + 0.15, r*2+0.7, r*2+0.7)
    // cruz central
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(gx, gy, 1, 1)
  }
  // viewport rect + player dot (solo en pausa, no en targeting)
  if (!isTargeting.value) {
    try {
      const s = camera.scale.value
      const vw = window.innerWidth, vh = window.innerHeight
      const ox = city.offsetX ?? 0
      const oy = city.offsetY ?? 0
      const left = (-camera.x.value)/s/48 + ox
      const top = (-camera.y.value)/s/48 + oy
      const vwGrid = vw / s / 48
      const vhGrid = vh / s / 48
      const cx = (left - ox)
      const cy = (top - oy)
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 0.7
      ctx.strokeRect(cx, cy, vwGrid, vhGrid)
      const px = player.x - ox
      const py = player.y - oy
      if (px>=0 && px<w && py>=0 && py<h) {
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(px-1, py-1, 2, 2)
      }
    } catch {}
  }
}

function canvasToAxAy(e) {
  const c = canvasRef.value
  if (!c) return null
  const rect = c.getBoundingClientRect()
  const scaleX = c.width / rect.width
  const scaleY = c.height / rect.height
  const cx = (e.clientX - rect.left) * scaleX
  const cy = (e.clientY - rect.top) * scaleY
  const ax = Math.floor(cx)
  const ay = Math.floor(cy)
  if (ax <0 || ay<0 || ax>=c.width || ay>=c.height) return null
  return { ax, ay }
}

function handleCanvasClick(e) {
  if (!isTargeting.value) return
  const pos = canvasToAxAy(e)
  if (!pos) return
  const worldX = (city.offsetX ?? 0) + pos.ax
  const worldY = (city.offsetY ?? 0) + pos.ay
  const weaponId = pendingWeapon.value
  if (!weaponId) return
  // dispara
  const res = city.remoteStrike(worldX, worldY, weaponId)
  if (!res.ok) {
    city.logs.unshift(`[Remoto] ${res.reason}`)
  }
  emit('strike', { x: worldX, y: worldY, weaponId, res })
  city.pendingRemoteWeapon = null
  draw()
}

function handleCanvasMove(e) {
  if (!isTargeting.value) { hoverPos.value = null; return }
  const pos = canvasToAxAy(e)
  hoverPos.value = pos
  draw()
}

function handleClose() {
  if (isTargeting.value) {
    city.pendingRemoteWeapon = null
    emit('cancelTargeting')
  }
  emit('close')
}

function onSliderX(e) {
  const v = parseInt(e.target.value)
  sliderX.value = v
  const s = camera.scale.value
  const ox = city.offsetX ?? 0
  const size = city.grid.length
  const targetX = ox + (v/100)*(size-1)
  const localX = (targetX - ox) * 48 + 24
  camera.x.value = window.innerWidth/2 - localX * s
  draw()
}
function onSliderY(e) {
  const v = parseInt(e.target.value)
  sliderY.value = v
  const s = camera.scale.value
  const oy = city.offsetY ?? 0
  const size = city.grid.length
  const targetY = oy + (v/100)*(size-1)
  const localY = (targetY - oy) * 48 + 24
  camera.y.value = window.innerHeight/2 - localY * s
  draw()
}
function centerOnPlayer() {
  const ox = city.offsetX ?? 0, oy = city.offsetY ?? 0
  const s = camera.scale.value
  camera.x.value = window.innerWidth/2 - ((player.x-ox)*48+24)*s
  camera.y.value = window.innerHeight/2 - ((player.y-oy)*48+24)*s
  // update sliders to reflect
  const size = city.grid.length
  sliderX.value = Math.round(((player.x - ox)/(size-1))*100)
  sliderY.value = Math.round(((player.y - oy)/(size-1))*100)
  draw()
}

onMounted(() => { draw(); setInterval(draw, 600) })
watch(() => [city.grid, city.grid.length, props.show, hoverPos.value, pendingWeapon.value], draw)
watch(() => city.tickCount, draw)
watch(() => pendingWeapon.value, draw)
watch(() => [camera.x.value, camera.y.value, player.x, player.y], draw)
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-4">
    <div class="bg-slate-900 rounded-2xl border border-white/15 w-full max-w-[560px] max-h-[82vh] flex flex-col overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
      <div class="shrink-0 px-4 py-2 border-b border-white/10 flex items-center justify-between" :class="isTargeting ? 'bg-red-900/60' : 'bg-slate-800/60'">
        <span class="text-xs font-black tracking-widest flex items-center gap-2">
          <span v-if="isTargeting">🎯 MODO ATAQUE REMOTO</span>
          <span v-else>🗺️ MAPA COMPLETO</span>
          <span v-if="weaponInfo" class="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full border border-white/20">{{ weaponInfo.icon }} {{ weaponInfo.label }} {{ (radius*2+1) }}x{{ (radius*2+1) }}</span>
        </span>
        <span class="text-[10px] text-white/50">{{ city.grid.length }}×{{ city.grid[0]?.length }} • {{ isTargeting ? 'toca para disparar' : single.isActive ? 'colores por jugador' : 'puntos negros' }}</span>
      </div>
      <div v-if="isTargeting" class="shrink-0 px-3 py-2 bg-red-950/60 border-b border-red-800/50 text-[11px] text-red-200 flex items-center gap-2">
        <span class="animate-pulse">●</span>
        <span>Selecciona en el mapa dónde caerá el ataque. El suelo quedará <b class="text-white">gris con escombros</b> hasta que vuelva el pasto (12s → tierra, 37s → pasto).</span>
      </div>
      <div class="flex-1 min-h-0 overflow-hidden p-2 sm:p-3 flex items-center justify-center bg-[#0f172a] gap-2">
        <canvas ref="canvasRef" @click="handleCanvasClick" @mousemove="handleCanvasMove" @mouseleave="hoverPos=null; draw()" class="w-full h-auto aspect-square border border-white/10 rounded shadow shrink min-w-0" :class="isTargeting ? 'cursor-crosshair ring-2 ring-red-500' : 'cursor-default'" style="image-rendering: pixelated; max-width: min(72vw, 340px); max-height: min(54vh, 340px);"></canvas>
        <!-- Y vertical al lado del canvas — X/Y lateral, ocupa toda la altura disponible sin tapar mapa -->
        <div v-if="!isTargeting" class="flex flex-col items-center gap-1 bg-black/40 border border-white/10 rounded-full p-1.5 shrink-0 self-center">
          <span class="text-[7px] text-white/40 font-black">↑ N</span>
          <input type="range" orient="vertical" min="0" max="100" :value="sliderY" @input="onSliderY" class="w-6 h-[120px] sm:h-[140px] md:h-[220px] accent-white shrink-0" style="writing-mode: bt-lr; -webkit-appearance: slider-vertical;" />
          <span class="text-[7px] text-white/40 font-black">S ↓</span>
        </div>
      </div>
      <!-- X horizontal abajo — solo X, Y ya está al lado -->
      <div v-if="!isTargeting" class="shrink-0 px-3 py-2 bg-black/30 border-t border-white/10 flex items-center gap-2 md:hidden">
        <span class="text-[8px] text-white/50 font-black">◀ O</span>
        <input type="range" min="0" max="100" :value="sliderX" @input="onSliderX" class="flex-1 accent-white h-1" />
        <span class="text-[8px] text-white/50 font-black">E ▶</span>
        <button @click="centerOnPlayer" class="ml-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[9px] font-bold whitespace-nowrap">⌖</button>
      </div>
      <div v-if="!isTargeting" class="hidden md:flex shrink-0 px-3 py-1.5 bg-black/30 border-t border-white/10 items-center gap-2">
        <span class="text-[8px] text-white/50 font-black">◀ O</span>
        <input type="range" min="0" max="100" :value="sliderX" @input="onSliderX" class="flex-1 accent-white h-1" />
        <span class="text-[8px] text-white/50 font-black">E ▶</span>
        <button @click="centerOnPlayer" class="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[10px] font-bold whitespace-nowrap">⌖ Centrar</button>
      </div>
      <div class="shrink-0 p-3 border-t border-white/10 bg-slate-800/40 flex flex-col gap-2">
        <div v-if="hoverPos && isTargeting" class="text-center text-[11px] font-mono text-white/70">
          Apuntando: mundo ({{ (city.offsetX ?? 0) + hoverPos.ax }}, {{ (city.offsetY ?? 0) + hoverPos.ay }}) • área {{ (radius*2+1) }}x{{ (radius*2+1) }}
        </div>
        <div class="flex items-center justify-center gap-3 text-[11px]">
          <span v-if="!single.isActive" class="flex items-center gap-1"><span class="w-2 h-2 bg-black rounded-full"></span> Construido</span>
          <template v-else>
            <span v-for="p in single.players" :key="p.id" class="flex items-center gap-1"><span class="w-2 h-2 rounded-full" :style="{background:p.bg}"></span> {{ p.isHuman ? 'Tú' : 'CPU' }} {{ p.color }}</span>
          </template>
          <span class="flex items-center gap-1"><span class="w-2 h-2 bg-[#38bdf8] rounded-full"></span> Agua</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 bg-[#57534e] rounded-full"></span> Escombros</span>
        </div>
        <div class="flex gap-2">
          <button v-if="isTargeting" @click="city.pendingRemoteWeapon=null; emit('cancelTargeting')" class="flex-1 py-2.5 rounded-full bg-white/10 border border-white/15 text-white font-bold text-sm hover:bg-white/15">✕ Cancelar</button>
          <button @click="handleClose" class="flex-1 py-2.5 rounded-full bg-white text-slate-900 font-black text-sm hover:bg-slate-100">{{ isTargeting ? 'Cerrar sin disparar' : '✕ Cerrar mapa' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
