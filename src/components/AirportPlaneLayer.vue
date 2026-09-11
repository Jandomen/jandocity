<script setup>
import { useCityStore } from '@/stores/cityStore.js'
import { useTrafficStore } from '@/stores/trafficStore.js'

const city = useCityStore()
const traffic = useTrafficStore()

function posFor(p) {
  const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0
  const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0
  return { x: (p.x - ox) * 48 + 24, y: (p.y - oy) * 48 + 24 }
}
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      v-for="pl in traffic.airportPlanes"
      :key="'pl'+pl.id"
      class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none"
      :style="{
        left: posFor(pl).x + 'px',
        top: posFor(pl).y + 'px',
        opacity: pl.alpha ?? 1,
        transform: `translate(-50%,-50%) scale(${pl.scale ?? 1}) rotate(${pl.phase==='landing' ? -35 : 35}deg)`,
        transition: 'left 500ms linear, top 500ms linear, opacity 400ms, transform 500ms',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
      }"
    >
      <!-- sombra diagonal -->
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[18px] h-[3px] bg-black/25 blur-[1px] rounded-full" :style="{ opacity: pl.phase==='landing' ? 0.6 - pl.progress*0.4 : 0.2 + pl.progress*0.4 }"></div>
      <span class="text-[20px] leading-none">{{ pl.phase==='landing' ? '🛬' : '🛫' }}</span>
      <span class="text-[7px] font-black tracking-widest text-sky-700 bg-white/80 px-1 rounded-full mt-0.5 border border-sky-200">{{ pl.phase==='landing' ? 'ATERRIZA' : 'DESPEGA' }}</span>
    </div>
  </div>
</template>
