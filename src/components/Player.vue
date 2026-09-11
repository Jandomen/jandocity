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
</script>

<template>
  <div
    class="absolute w-[36px] h-[40px] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
    :style="{ left: pos.x + 'px', top: (pos.y + 4) + 'px', zIndex: 50 }"
  >
    <!-- Sombra en el suelo -->
    <div class="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[20px] h-[7px] bg-black/30 blur-[2px] rounded-full"></div>
    <!-- Zapatos elegantes lustrados -->
    <div class="absolute bottom-[3px] left-1/2 -translate-x-1/2 flex gap-[4px] items-end">
      <div class="w-[8px] h-[4px] bg-[#0f0f0f] rounded-[2px] border border-white/10 shadow-sm relative overflow-hidden"
           :class="player.isMoving ? 'animate-[stepL_0.22s_infinite]' : ''"
           style="transform-origin: bottom center;">
        <div class="absolute top-0 left-1 right-1 h-[1px] bg-white/25 rounded-full"></div>
      </div>
      <div class="w-[8px] h-[4px] bg-[#0f0f0f] rounded-[2px] border border-white/10 shadow-sm relative overflow-hidden"
           :class="player.isMoving ? 'animate-[stepR_0.22s_infinite]' : ''"
           style="transform-origin: bottom center;">
        <div class="absolute top-0 left-1 right-1 h-[1px] bg-white/25 rounded-full"></div>
      </div>
    </div>
    <!-- Protagonista elegante — traje sastre con chaleco y zapatos lustrados -->
    <div class="absolute top-[1px] left-1/2 -translate-x-1/2 flex flex-col items-center"
         :class="player.isMoving ? 'animate-[bob_0.22s_infinite]' : ''">
      <!-- Cabeza elegante: piel clara, pelo peinado con raya, ojos finos -->
      <div class="w-[17px] h-[17px] rounded-full bg-[#ffecd2] border border-white/90 shadow-sm flex items-center justify-center relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-[7px] bg-[#1a1a1a] rounded-t-full"></div>
        <div class="absolute top-[1px] left-[4px] right-[3px] h-[1px] bg-white/20 rounded-full"></div>
        <div class="absolute top-[7px] left-0 right-0 h-[1px] bg-black/10"></div>
        <div class="w-[1.7px] h-[1.7px] bg-[#0f172a] rounded-full absolute top-[8.5px] left-[5px]"></div>
        <div class="w-[1.7px] h-[1.7px] bg-[#0f172a] rounded-full absolute top-[8.5px] right-[5px]"></div>
        <div class="w-[3px] h-[0.7px] bg-[#9c6b4a] rounded-full absolute top-[11.5px]"></div>
      </div>
      <!-- Traje elegante: chaqueta cruzada marino, camisa, corbata y pañuelo -->
      <div class="w-[18px] h-[13px] bg-[#0f172a] rounded-b-[3px] -mt-[2px] border border-slate-800 shadow flex items-start justify-center pt-[1px] relative overflow-hidden">
        <!-- Camisa -->
        <div class="w-[7px] h-[8px] bg-[#f8fafc] rounded-b-[2px] border border-slate-200"></div>
        <!-- Corbata seda -->
        <div class="absolute top-[2px] left-1/2 -translate-x-1/2 w-[3px] h-[8px] bg-gradient-to-b from-[#1e40af] to-[#1e3a8a] rounded-b-[1px] border border-white/20"></div>
        <!-- Solapas satinadas -->
        <div class="absolute top-0 left-[1px] w-[5px] h-[7px] bg-[#1e293b] rounded-br-[2px] -rotate-12 border-r border-slate-700"></div>
        <div class="absolute top-0 right-[1px] w-[5px] h-[7px] bg-[#1e293b] rounded-bl-[2px] rotate-12 border-l border-slate-700"></div>
        <!-- Pañuelo bolsillo -->
        <div class="absolute top-[3px] right-[2px] w-[3px] h-[2px] bg-white rounded-[1px] border border-slate-300"></div>
        <!-- Botones -->
        <div class="absolute bottom-[4px] left-1/2 -translate-x-1/2 flex flex-col gap-[1.5px]">
          <div class="w-[1px] h-[1px] bg-slate-400 rounded-full"></div>
          <div class="w-[1px] h-[1px] bg-slate-400 rounded-full"></div>
        </div>
      </div>
    </div>
    <!-- Dirección -->
    <div class="absolute top-[22px] left-1/2 -translate-x-1/2 text-[9px] leading-none drop-shadow">{{ facing }}</div>
  </div>
</template>

<style>
@keyframes bob { 0%,100%{ transform: translateX(-50%) translateY(0)} 50%{ transform: translateX(-50%) translateY(-1.5px)} }
@keyframes stepL { 0%,100%{ transform: translateY(0) } 25%{ transform: translateY(-3px)} 50%{ transform: translateY(0)} }
@keyframes stepR { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-3px)} 75%{ transform: translateY(0)} }
</style>
