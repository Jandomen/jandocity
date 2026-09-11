<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close'])
const city = useCityStore()
const single = useSinglePlayerStore()
const canvasRef = ref(null)

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
}

onMounted(draw)
watch(() => [city.grid, city.grid.length, props.show], draw)
watch(() => city.tickCount, draw)
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-4">
    <div class="bg-slate-900 rounded-2xl border border-white/15 w-full max-w-[560px] max-h-[82vh] flex flex-col overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
      <div class="shrink-0 px-4 py-2 border-b border-white/10 flex items-center justify-between bg-slate-800/60">
        <span class="text-xs font-black tracking-widest">🗺️ MAPA COMPLETO</span>
        <span class="text-[10px] text-white/50">{{ city.grid.length }}×{{ city.grid[0]?.length }} • {{ single.isActive ? 'colores por jugador' : 'puntos negros' }}</span>
      </div>
      <div class="flex-1 overflow-auto p-3 flex items-center justify-center bg-[#0f172a]">
        <canvas ref="canvasRef" class="max-w-full max-h-[60vh] w-auto h-auto border border-white/10 rounded shadow" style="image-rendering: pixelated; width: 320px; height: 320px;"></canvas>
      </div>
      <div class="shrink-0 p-3 border-t border-white/10 bg-slate-800/40 flex flex-col gap-2">
        <div class="flex items-center justify-center gap-3 text-[11px]">
          <span v-if="!single.isActive" class="flex items-center gap-1"><span class="w-2 h-2 bg-black rounded-full"></span> Construido</span>
          <template v-else>
            <span v-for="p in single.players" :key="p.id" class="flex items-center gap-1"><span class="w-2 h-2 rounded-full" :style="{background:p.bg}"></span> {{ p.isHuman ? 'Tú' : 'CPU' }} {{ p.color }}</span>
          </template>
          <span class="flex items-center gap-1"><span class="w-2 h-2 bg-[#38bdf8] rounded-full"></span> Agua</span>
        </div>
        <button @click="emit('close')" class="w-full py-2.5 rounded-full bg-white text-slate-900 font-black text-sm hover:bg-slate-100">✕ Cerrar mapa</button>
      </div>
    </div>
  </div>
</template>
