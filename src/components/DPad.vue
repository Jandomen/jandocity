<script setup>
import { usePlayerStore } from '@/stores/playerStore.js'
import { useCityStore } from '@/stores/cityStore.js'

const player = usePlayerStore()
const city = useCityStore()

function move(dx, dy) { player.move(dx, dy, city.grid) }
</script>

<template>
  <div class="absolute bottom-4 right-4 z-30 md:hidden select-none touch-none">
    <div class="w-[112px] h-[112px] relative">
      <!-- cruz -->
      <button @touchstart.prevent="move(0,-1)" @mousedown.prevent="move(0,-1)" class="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 rounded-lg bg-black/40 backdrop-blur border border-white/20 text-white flex items-center justify-center active:bg-white/20">▲</button>
      <button @touchstart.prevent="move(0,1)" @mousedown.prevent="move(0,1)" class="absolute left-1/2 -translate-x-1/2 bottom-0 w-10 h-10 rounded-lg bg-black/40 backdrop-blur border border-white/20 text-white flex items-center justify-center active:bg-white/20">▼</button>
      <button @touchstart.prevent="move(-1,0)" @mousedown.prevent="move(-1,0)" class="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 rounded-lg bg-black/40 backdrop-blur border border-white/20 text-white flex items-center justify-center active:bg-white/20">◀</button>
      <button @touchstart.prevent="move(1,0)" @mousedown.prevent="move(1,0)" class="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 rounded-lg bg-black/40 backdrop-blur border border-white/20 text-white flex items-center justify-center active:bg-white/20">▶</button>
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white/10 border border-white/10 pointer-events-none"></div>
    </div>
  </div>
</template>
