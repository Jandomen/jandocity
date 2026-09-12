<script setup>
import { computed } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { useMultiplayerSync } from '@/composables/useMultiplayerSync.js'
import { getCharacter } from '@/config/characters.js'

const city = useCityStore()
const multi = useMultiplayerSync()

const players = computed(() => Array.from(multi.remotePlayers.value.values()))

function posFor(p) {
  const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0
  const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0
  return { x: (p.x - ox) * 48 + 24, y: (p.y - oy) * 48 + 24 }
}
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      v-for="p in players"
      :key="p.id"
      class="absolute w-[36px] h-[40px] -translate-x-1/2 -translate-y-1/2 select-none"
      :style="{ left: posFor(p).x + 'px', top: (posFor(p).y + 4) + 'px', zIndex: 45 }"
    >
      <div class="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[20px] h-[7px] bg-black/30 blur-[2px] rounded-full"></div>
      <div class="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[14px] h-[6px] rounded-b-[2px] border border-black/10 text-[7px] font-black flex items-center justify-center text-white" :style="{ background: p.color || '#3b82f6' }">{{ (p.username||'').slice(0,2).toUpperCase() }}</div>
      <div class="absolute top-[1px] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div class="w-[17px] h-[17px] rounded-full border border-white/90 shadow-sm flex items-center justify-center relative overflow-hidden" :style="{ background: getCharacter(p.characterId)?.skin || '#ffecd2' }">
          <div class="absolute top-0 left-0 right-0 h-[7px] rounded-t-full" :style="{ background: getCharacter(p.characterId)?.hair || '#1a1a1a' }"></div>
          <div class="w-[1.7px] h-[1.7px] bg-[#0f172a] rounded-full absolute top-[8.5px] left-[5px]"></div>
          <div class="w-[1.7px] h-[1.7px] bg-[#0f172a] rounded-full absolute top-[8.5px] right-[5px]"></div>
        </div>
        <div class="w-[18px] h-[13px] rounded-b-[3px] -mt-[2px] border border-black/20 shadow relative overflow-hidden" :style="{ background: getCharacter(p.characterId)?.shirt || '#0f172a' }">
          <div class="absolute top-[2px] left-1/2 -translate-x-1/2 w-[3px] h-[6px] rounded-b-[1px] border border-white/20" :style="{ background: getCharacter(p.characterId)?.tie || 'transparent', opacity: getCharacter(p.characterId)?.tie ? 1 : 0 }"></div>
        </div>
      </div>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[8px] font-bold px-1 rounded-full border border-white/20 whitespace-nowrap">{{ p.username }}</div>
    </div>
  </div>
</template>
