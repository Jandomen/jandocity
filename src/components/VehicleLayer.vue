<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useSelection } from '@/composables/useSelection.js'
import { useAudioManager } from '@/audio/audioManager.js'
import { usePerformance } from '@/composables/usePerformance.js'

const city = useCityStore()
const traffic = useTrafficStore()
const single = useSinglePlayerStore()
const selection = useSelection()
const audio = useAudioManager()
const perf = usePerformance()

const vehicleIcons = { car: '🚗', pickup: '🛻', moto: '🏍️', trailer: '🚛', bus: '🚌', police_car: '🚔', ambulance: '🚑', fire_truck: '🚒', army_jeep: '🚙', tank: '🛡️', tractor: '🚜', cannon: '💣', atomic: '☢️', atomic_heavy: '☢️', rocket: '🚀', missile: '🚀', boat_small: '⛵', patrol_boat: '🚤', cargo_ship: '🚢' }

function posFor(entity) {
  const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0
  const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0
  return { x: (entity.x - ox) * 48 + 24, y: (entity.y - oy) * 48 + 24 }
}

const rotMap = { right: 0, down: 90, left: 180, up: -90 }

// panning simple izq-der según posición del vehículo respecto al centro
function panFor(x) {
  const vw = window.innerWidth
  const ox = city.offsetX ?? 0
  const localX = (x - ox) * 48 + 24
  // camera.x ya está centrado en player, pero aproximamos pan por x del mundo
  const pan = Math.max(-1, Math.min(1, (localX - vw/2) / (vw/2)))
  return pan
}

let timer = null
function startTick() {
  if (timer) clearInterval(timer)
  const ms = perf.preset.value.trafficTickMs ?? 500
  timer = setInterval(() => {
    traffic.tick()
    try {
      const v = traffic.vehicles[0]
      if (v) {
        audio.ambient.update(city.grid, { x: v.x, y: v.y })
      }
    } catch {}
  }, ms)
}
onMounted(() => {
  startTick()
  watch(() => perf.effectiveQuality.value, startTick)
})
onUnmounted(() => clearInterval(timer))

//Sprites humanos con pies y manos, no fantasmas — caminan lento
const pedBodies = {
  child: { head: '#ffecd2', hair: '#8b4513', shirt: '#60a5fa', pants: '#1e40af', h: 10 },
  girl:  { head: '#ffecd2', hair: '#f472b6', shirt: '#f9a8d4', pants: '#ec4899', h: 10 },
  boy:   { head: '#ffecd2', hair: '#5a3a1a', shirt: '#4ade80', pants: '#1e3a8a', h: 11 },
  lady:  { head: '#ffecd2', hair: '#7c2d12', shirt: '#fb7185', pants: '#1f2937', h: 12 },
  man:   { head: '#e8c4a8', hair: '#1a1a1a', shirt: '#374151', pants: '#1f2937', h: 12 },
  police: { head: '#ffecd2', hair: '#1e3a8a', shirt: '#1e40af', pants: '#1e293b', h: 12 },
  medic:  { head: '#ffecd2', hair: '#0f766e', shirt: '#ffffff', pants: '#e0f2fe', h: 12 },
  fireman:{ head: '#ffecd2', hair: '#7f1d1d', shirt: '#dc2626', pants: '#1f2937', h: 12 },
  criminal:{ head: '#e8c4a8', hair: '#1a1a1a', shirt: '#f97316', pants: '#7c2d12', h: 12 },
  student:{ head: '#ffecd2', hair: '#5b21b6', shirt: '#a5b4fc', pants: '#3730a3', h: 11 },
  uni_student:{ head: '#ffecd2', hair: '#1e293b', shirt: '#e0e7ff', pants: '#1e293b', h: 12 },
  lawyer:{ head: '#ffecd2', hair: '#334155', shirt: '#1e293b', pants: '#0f172a', h: 12 },
  judge:{ head: '#e8c4a8', hair: '#e5e7eb', shirt: '#000000', pants: '#000000', h: 12 },
  soldier:{ head: '#ffecd2', hair: '#365314', shirt: '#65a30d', pants: '#365314', h: 12 },
  swat:   { head: '#ffecd2', hair: '#1e293b', shirt: '#0f172a', pants: '#1e293b', h: 12 },
  sniper: { head: '#e8c4a8', hair: '#365314', shirt: '#57534e', pants: '#44403c', h: 12 },
}
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      v-for="v in traffic.vehicles"
      :key="'v'+v.id"
      class="absolute w-[24px] h-[24px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[16px] select-none"
      :style="{ left: posFor(v).x + 'px', top: posFor(v).y + 'px', transform: `translate(-50%,-50%) rotate(${rotMap[v.dir]||0}deg)`, transition: `left ${v.speed}ms linear, top ${v.speed}ms linear, transform 180ms` }"
      :title="v.type + (v.owner ? ' ['+v.owner+']' : '') + (v.hp ? ' HP:'+v.hp : '')"
      :class="{ 'animate-pulse': v.type==='police_car' || v.type==='ambulance', 'ring-2 ring-white rounded-full': selection.isSelected('veh', v.id), 'ring-2 ring-yellow-400': single.isActive && v.owner && v.owner !== single.humanPlayer()?.id }"
    >
      <span :class="{ 'drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]': v.type==='police_car', 'drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]': v.type==='ambulance' }">{{ vehicleIcons[v.type] || '🚗' }}</span>
      <div v-if="v.hp!==undefined && v.hp<100" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[16px] h-1 bg-black/40 rounded-full overflow-hidden border border-white/20"><div class="h-full bg-red-500" :style="{width: v.hp+'%'}"></div></div>
    </div>
    <div
      v-for="b in traffic.boats"
      :key="'b'+b.id"
      class="absolute w-[26px] h-[26px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[18px] select-none"
      :style="{ left: posFor(b).x + 'px', top: posFor(b).y + 'px', transform: `translate(-50%,-50%) rotate(${rotMap[b.dir]||0}deg)`, transition: `left ${b.speed}ms linear, top ${b.speed}ms linear, transform 180ms` }"
      :title="b.type + (b.cargo?.length ? ' cargo:'+b.cargo.length : '')"
    >
      <span class="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{{ vehicleIcons[b.type] || '⛵' }}</span>
      <div v-if="b.cargo && b.cargo.length" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border border-white text-[8px] font-black flex items-center justify-center">{{ b.cargo.length }}</div>
    </div>
    <!-- Peatones con cuerpo, pies y manos, caminando lento -->
    <div
      v-for="p in traffic.pedestrians"
      :key="'p'+p.id"
      class="absolute w-[16px] h-[18px] -translate-x-1/2 -translate-y-1/2 select-none"
      :style="{ left: posFor(p).x + 'px', top: (posFor(p).y+6) + 'px', transition: `left ${p.speed}ms linear, top ${p.speed}ms linear` }"
      :title="p.kind + (p.injured ? ' (herido)' : '') + (p.owner ? ' ['+p.owner+']' : '')"
      :class="{ 'opacity-70': p.injured, 'ring-1 ring-red-500 rounded-full': p.kind==='criminal', 'ring-2 ring-white rounded': selection.isSelected('ped', p.id), 'ring-2 ring-yellow-400': single.isActive && p.owner && p.owner !== single.humanPlayer()?.id && !selection.isSelected('ped', p.id) }"
    >
      <div class="relative w-full h-full flex flex-col items-center" :class="p.injured ? '' : 'ped-walk'">
        <!-- sombra -->
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[12px] h-[3px] bg-black/25 blur-[1px] rounded-full"></div>
        <!-- cabeza -->
        <div class="w-[9px] h-[9px] rounded-full border border-white/80 shadow-sm relative overflow-hidden" :style="{ background: (pedBodies[p.kind]||pedBodies.man).head }">
          <div class="absolute top-0 left-0 right-0 h-[4px] rounded-t-full" :style="{ background: (pedBodies[p.kind]||pedBodies.man).hair }"></div>
          <div v-if="p.kind==='criminal'" class="absolute inset-0 flex items-center justify-center text-[5px]">{{ p.weapon==='gun' ? '🔫' : p.weapon==='knife' ? '🔪' : '😠' }}</div>
          <div v-if="p.injured" class="absolute -top-1 -right-1 text-[7px]">🩹</div>
          <div v-if="p.kind==='judge'" class="absolute inset-0 flex items-center justify-center text-[5px]">⚖️</div>
        </div>
        <!-- cuerpo -->
        <div class="w-[8px] h-[6px] rounded-b-sm -mt-[1px] border border-black/10 flex items-center justify-center relative" :style="{ background: (pedBodies[p.kind]||pedBodies.man).shirt, height: (pedBodies[p.kind]||pedBodies.man).h - 4 + 'px' }">
          <div class="w-[2px] h-[4px] bg-white/80 rounded-full"></div>
          <!-- mochila estudiantes -->
          <div v-if="p.kind==='student' || p.kind==='uni_student'" class="absolute -right-[3px] top-[1px] w-[3px] h-[4px] rounded-[1px] border border-black/20" style="background:#f59e0b;"></div>
          <!-- maletín abogado -->
          <div v-if="p.kind==='lawyer'" class="absolute -right-[3px] bottom-0 w-[3px] h-[2px] rounded-[1px] bg-amber-900 border border-black/20"></div>
        </div>
        <!-- brazos -->
        <div class="absolute top-[9px] left-[1px] w-[2px] h-[4px] rounded-full ped-arm-l" :style="{ background: (pedBodies[p.kind]||pedBodies.man).head }"></div>
        <div class="absolute top-[9px] right-[1px] w-[2px] h-[4px] rounded-full ped-arm-r" :style="{ background: (pedBodies[p.kind]||pedBodies.man).head }"></div>
        <!-- piernas/pies -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-[3px]">
          <div class="w-[3px] h-[3px] rounded-[1px] ped-leg-l" :style="{ background: (pedBodies[p.kind]||pedBodies.man).pants }"></div>
          <div class="w-[3px] h-[3px] rounded-[1px] ped-leg-r" :style="{ background: (pedBodies[p.kind]||pedBodies.man).pants }"></div>
        </div>
        <div v-if="p.kind==='criminal'" class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[6px] px-1 rounded-full font-bold flex items-center gap-0.5" :class="p.weapon==='gun' ? 'bg-black text-white border border-red-500' : p.weapon==='knife' ? 'bg-orange-600 text-white' : 'bg-red-600 text-white'">{{ p.weapon==='gun' ? '🔫 FUGITIVO' : p.weapon==='knife' ? '🔪 FUGITIVO' : 'FUGITIVO' }}</div>
        <div v-else-if="p.injured" class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[6px] bg-amber-500 text-white px-1 rounded-full font-bold">HERIDO</div>
        <div v-if="p.hp!==undefined && p.hp<100 && !p.injured" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[14px] h-1 bg-black/40 rounded-full overflow-hidden border border-white/20"><div class="h-full bg-green-500" :style="{width: p.hp+'%'}"></div></div>
        <div v-else-if="p.kind==='student'" class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[6px] bg-violet-600 text-white px-1 rounded-full font-bold">ESCOLAR</div>
        <div v-else-if="p.kind==='uni_student'" class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[6px] bg-indigo-600 text-white px-1 rounded-full font-bold">UNI</div>
        <div v-else-if="p.kind==='lawyer'" class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[6px] bg-slate-700 text-white px-1 rounded-full font-bold">ABOG</div>
        <div v-else-if="p.kind==='judge'" class="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[6px] bg-black text-white px-1 rounded-full font-bold border border-white/20">JUEZ</div>
      </div>
    </div>
    <!-- Accidentes — cruz roja sobre carretera -->
    <div v-for="a in traffic.accidents" :key="'a'+a.id" class="absolute w-[28px] h-[28px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none" :style="{ left: posFor(a).x+'px', top: posFor(a).y+'px' }">
      <div class="w-6 h-6 rounded-full bg-red-600/90 border-2 border-white flex items-center justify-center text-[12px] animate-pulse shadow-[0_2px_8px_rgba(220,38,38,0.6)]">⚠️</div>
    </div>
    <div
      v-for="t in traffic.trains"
      :key="'t'+t.id"
      class="absolute w-[28px] h-[18px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[18px] select-none"
      :style="{ left: posFor(t).x + 'px', top: posFor(t).y + 'px', transform: `translate(-50%,-50%) rotate(${rotMap[t.dir]||0}deg)`, transition: `left ${t.speed}ms linear, top ${t.speed}ms linear, transform 180ms` }"
      :title="t.type"
    >
      🚂
    </div>
  </div>
</template>

<style>
.ped-walk { animation: pedBob 0.9s ease-in-out infinite; }
.ped-leg-l { animation: pedStepL 0.9s ease-in-out infinite; }
.ped-leg-r { animation: pedStepR 0.9s ease-in-out infinite; }
.ped-arm-l { animation: pedArmL 0.9s ease-in-out infinite; }
.ped-arm-r { animation: pedArmR 0.9s ease-in-out infinite; }
@keyframes pedBob { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-1px)} }
@keyframes pedStepL { 0%,100%{ transform: translateY(0)} 25%{ transform: translateY(-2px)} 50%{ transform: translateY(0)} }
@keyframes pedStepR { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-2px)} 75%{ transform: translateY(0)} }
@keyframes pedArmL { 0%,100%{ transform: rotate(8deg)} 50%{ transform: rotate(-8deg)} }
@keyframes pedArmR { 0%,100%{ transform: rotate(-8deg)} 50%{ transform: rotate(8deg)} }
</style>
