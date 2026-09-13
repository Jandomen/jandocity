<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { useCamera } from '@/composables/useCamera.js'
import { usePlayerStore } from '@/stores/playerStore.js'

const city = useCityStore()
const player = usePlayerStore()
const camera = useCamera()
const canvasRef = ref(null)
const isDragging = ref(false)

// MiniMap thumbnail 150x150 -> 84x84 canvas
const isNative = computed(() => {
  try { if (window.Capacitor?.isNativePlatform?.()) return true } catch {}
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '')
})

function draw() {
  const c = canvasRef.value
  if (!c) return
  const ctx = c.getContext('2d')
  const size = city.grid.length
  const w = Math.min(size, 150), h = Math.min(size, 150)
  c.width = w; c.height = h
  ctx.fillStyle = '#22c55e'
  ctx.fillRect(0,0,w,h)
  for (let y=0;y<h;y++) for (let x=0;x<w;x++) {
    const cell = city.grid[y]?.[x]
    if (!cell) continue
    if (cell.terrain === 'water' || cell.terrain === 'deep_water') {
      ctx.fillStyle = cell.terrain === 'deep_water' ? '#0284c7' : '#38bdf8'
      ctx.fillRect(x,y,1,1)
    }
    if (cell.buildingId || cell.hasRoad || cell.hasRail) {
      ctx.fillStyle = cell.owner ? '#000' : (cell.hasRoad ? '#334155' : '#000')
      if (cell.buildingId) ctx.fillRect(x,y,1,1)
      else if (cell.hasRoad || cell.hasRail) ctx.fillRect(x,y,1,1)
    }
  }
  // viewport rect
  try {
    const s = camera.scale.value
    const vw = window.innerWidth, vh = window.innerHeight
    const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0
    const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0
    // visible area in grid coords
    const left = (-camera.x.value)/s/48 + ox
    const top = (-camera.y.value)/s/48 + oy
    const vwGrid = vw / s / 48
    const vhGrid = vh / s / 48
    // convert to canvas coords: canvas 0..size maps to world ox..ox+size
    const cx = (left - ox)
    const cy = (top - oy)
    ctx.strokeStyle = '#facc15'
    ctx.lineWidth = 0.8
    ctx.strokeRect(cx, cy, vwGrid, vhGrid)
    // player dot
    const px = player.x - ox
    const py = player.y - oy
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(px-1, py-1, 3, 3)
  } catch {}
}

function canvasToWorld(e) {
  const c = canvasRef.value
  if (!c) return null
  const rect = c.getBoundingClientRect()
  const t = e.touches ? e.touches[0] : e
  const scaleX = c.width / rect.width
  const scaleY = c.height / rect.height
  const ax = Math.floor((t.clientX - rect.left) * scaleX)
  const ay = Math.floor((t.clientY - rect.top) * scaleY)
  const worldX = (city.offsetX ?? 0) + ax
  const worldY = (city.offsetY ?? 0) + ay
  return { x: worldX, y: worldY }
}

function jumpTo(e) {
  const pos = canvasToWorld(e)
  if (!pos) return
  // mueve cámara para centrar esa zona sin mover jugador
  const s = camera.scale.value
  const vw = window.innerWidth, vh = window.innerHeight
  const ox = city.offsetX ?? 0, oy = city.offsetY ?? 0
  const localX = (pos.x - ox) * 48 + 24
  const localY = (pos.y - oy) * 48 + 24
  camera.x.value = vw/2 - localX * s
  camera.y.value = vh/2 - localY * s
}

function handleStart(e) { isDragging.value = true; jumpTo(e) }
function handleMove(e) { if (!isDragging.value) return; jumpTo(e) }
function handleEnd() { isDragging.value = false }

onMounted(() => { draw(); setInterval(draw, 800) })
watch(() => [city.grid.length, city.tickCount, player.x, player.y], draw)
</script>

<template>
  <div class="absolute right-2 top-[88px] z-20 flex flex-col items-center gap-1 pointer-events-auto select-none lg:hidden" :class="isNative ? '' : 'hidden lg:flex'">
    <!-- MiniMapa vertical para ver de arriba a abajo todo el perímetro -->
    <div class="bg-black/70 backdrop-blur border border-white/15 rounded-lg p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col items-center gap-1">
      <div class="text-[8px] font-black tracking-widest text-white/60">MAPA</div>
      <canvas ref="canvasRef" @touchstart.prevent="handleStart" @touchmove.prevent="handleMove" @touchend="handleEnd" @mousedown="handleStart" @mousemove="handleMove" @mouseup="handleEnd" class="w-[84px] h-[84px] border border-white/20 rounded bg-[#22c55e] cursor-pointer" style="image-rendering: pixelated;"></canvas>
      <div class="text-[8px] text-white/40 text-center leading-none">Toca para ir<br>amarillo=visto<br>rojo=tú</div>
      <button @click="() => { const ox = city.offsetX ?? 0, oy = city.offsetY ?? 0; const s= camera.scale.value; camera.x.value = window.innerWidth/2 - ((player.x-ox)*48+24)*s; camera.y.value = window.innerHeight/2 - ((player.y-oy)*48+24)*s }" class="w-full py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold border border-white/10">⌖ Centrar</button>
    </div>
    <!-- Slider vertical para recorrer todo el margen de arriba a abajo -->
    <div class="bg-black/50 backdrop-blur border border-white/10 rounded-full p-1 flex flex-col items-center gap-0.5">
      <span class="text-[7px] text-white/40">↑ N</span>
      <input type="range" orient="vertical" min="0" max="100" :value="50" @input="(e)=>{ const v=parseInt(e.target.value); const oy= city.offsetY ?? 0; const s=camera.scale.value; const targetY= oy + (v/100)*(city.grid.length-1); const localY=(targetY-oy)*48+24; camera.y.value= window.innerHeight/2 - localY*s }" class="w-6 h-[28vh] max-h-[220px] accent-white" style="writing-mode: bt-lr; -webkit-appearance: slider-vertical;" />
      <span class="text-[7px] text-white/40">S ↓</span>
    </div>
  </div>
</template>
