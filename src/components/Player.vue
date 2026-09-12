<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useCityStore } from '@/stores/cityStore.js'

const player = usePlayerStore()
const city = useCityStore()

const facing = computed(() => {
  const map = { up: '↑', down: '↓', left: '←', right: '→' }
  return map[player.dir] || '↓'
})

const pos = computed(() => {
  const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0
  const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0
  return { x: (player.x - ox) * 48 + 24, y: (player.y - oy) * 48 + 24 }
})

const char = computed(() => player.character || { skin:'#ffecd2', hair:'#1a1a1a', shirt:'#0f172a', shirt2:'#1e293b', pants:'#0f172a', shoes:'#0f0f0f', tie:'#1e40af' })
</script>

<template>
  <div
    class="absolute w-[36px] h-[40px] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
    :style="{ left: pos.x + 'px', top: (pos.y + 4) + 'px', zIndex: 50 }"
  >
    <!-- Sombra en el suelo -->
    <div class="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[20px] h-[7px] bg-black/30 blur-[2px] rounded-full"></div>
    <!-- Zapatos -->
    <div class="absolute bottom-[3px] left-1/2 -translate-x-1/2 flex gap-[4px] items-end">
      <div class="w-[8px] h-[4px] rounded-[2px] border border-white/10 shadow-sm relative overflow-hidden"
           :class="player.isMoving ? 'animate-[stepL_0.22s_infinite]' : ''"
           :style="{ background: char.shoes }"
           style="transform-origin: bottom center;">
        <div class="absolute top-0 left-1 right-1 h-[1px] bg-white/25 rounded-full"></div>
      </div>
      <div class="w-[8px] h-[4px] rounded-[2px] border border-white/10 shadow-sm relative overflow-hidden"
           :class="player.isMoving ? 'animate-[stepR_0.22s_infinite]' : ''"
           :style="{ background: char.shoes }"
           style="transform-origin: bottom center;">
        <div class="absolute top-0 left-1 right-1 h-[1px] bg-white/25 rounded-full"></div>
      </div>
    </div>
    <!-- Cuerpo protagonista dinámico -->
    <div class="absolute top-[1px] left-1/2 -translate-x-1/2 flex flex-col items-center"
         :class="player.isMoving ? 'animate-[bob_0.22s_infinite]' : ''">
      <!-- Cabeza -->
      <div class="w-[17px] h-[17px] rounded-full border border-white/90 shadow-sm flex items-center justify-center relative overflow-hidden" :style="{ background: char.skin }">
        <div class="absolute top-0 left-0 right-0 h-[7px] rounded-t-full" :style="{ background: char.hair }"></div>
        <div class="absolute top-[1px] left-[4px] right-[3px] h-[1px] bg-white/20 rounded-full"></div>
        <div class="absolute top-[7px] left-0 right-0 h-[1px] bg-black/10"></div>
        <div class="w-[1.7px] h-[1.7px] bg-[#0f172a] rounded-full absolute top-[8.5px] left-[5px]"></div>
        <div class="w-[1.7px] h-[1.7px] bg-[#0f172a] rounded-full absolute top-[8.5px] right-[5px]"></div>
        <div class="w-[3px] h-[0.7px] bg-[#9c6b4a] rounded-full absolute top-[11.5px]"></div>
        <!-- detalle femenino: coleta si es mujer ejecutiva/diseñadora -->
        <div v-if="['exec_female','designer_female','student_female','doctor_female','military_female'].includes(player.characterId)" class="absolute -right-[2px] top-[6px] w-[4px] h-[6px] rounded-full" :style="{ background: char.hair }"></div>
      </div>
      <!-- Torso -->
      <div class="w-[18px] h-[13px] rounded-b-[3px] -mt-[2px] border border-black/20 shadow flex items-start justify-center pt-[1px] relative overflow-hidden" :style="{ background: char.shirt }">
        <!-- Camisa interior clara si tiene corbata -->
        <div v-if="char.tie" class="w-[7px] h-[8px] bg-[#f8fafc] rounded-b-[2px] border border-slate-200"></div>
        <div v-else class="w-[7px] h-[8px] rounded-b-[2px] opacity-0"></div>
        <!-- Corbata -->
        <div v-if="char.tie" class="absolute top-[2px] left-1/2 -translate-x-1/2 w-[3px] h-[8px] rounded-b-[1px] border border-white/20" :style="{ background: char.tie }"></div>
        <!-- Solapas -->
        <div class="absolute top-0 left-[1px] w-[5px] h-[7px] rounded-br-[2px] -rotate-12 border-r border-black/15" :style="{ background: char.shirt2 }"></div>
        <div class="absolute top-0 right-[1px] w-[5px] h-[7px] rounded-bl-[2px] rotate-12 border-l border-black/15" :style="{ background: char.shirt2 }"></div>
        <!-- Pañuelo/demo -->
        <div v-if="char.id==='exec_male'" class="absolute top-[3px] right-[2px] w-[3px] h-[2px] bg-white rounded-[1px] border border-slate-300"></div>
        <!-- Botones -->
        <div class="absolute bottom-[4px] left-1/2 -translate-x-1/2 flex flex-col gap-[1.5px]">
          <div class="w-[1px] h-[1px] bg-white/60 rounded-full"></div>
          <div class="w-[1px] h-[1px] bg-white/60 rounded-full"></div>
        </div>
      </div>
    </div>
    <!-- Piernas / pantalón hint -->
    <div class="absolute bottom-[7px] left-1/2 -translate-x-1/2 w-[14px] h-[6px] rounded-b-[2px] border border-black/10" :style="{ background: char.pants }"></div>
    <!-- Dirección -->
    <div class="absolute top-[22px] left-1/2 -translate-x-1/2 text-[9px] leading-none drop-shadow">{{ facing }}</div>
  </div>
</template>

<style>
@keyframes bob { 0%,100%{ transform: translateX(-50%) translateY(0)} 50%{ transform: translateX(-50%) translateY(-1.5px)} }
@keyframes stepL { 0%,100%{ transform: translateY(0) } 25%{ transform: translateY(-3px)} 50%{ transform: translateY(0)} }
@keyframes stepR { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-3px)} 75%{ transform: translateY(0)} }
</style>
