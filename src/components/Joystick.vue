<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useCityStore } from '@/stores/cityStore.js'

const player = usePlayerStore()
const city = useCityStore()
const active = ref(false)
const dx = ref(0)
const dy = ref(0)
let timer = null

function start(e) {
  active.value = true
  move(e)
  timer = setInterval(() => {
    if (!active.value) return
    const adx = Math.abs(dx.value) > 0.35 ? Math.sign(dx.value) : 0
    const ady = Math.abs(dy.value) > 0.35 ? Math.sign(dy.value) : 0
    if (adx !== 0 || ady !== 0) player.move(adx, ady, city.grid)
  }, 140)
}

function move(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const t = e.touches ? e.touches[0] : e
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  dx.value = (t.clientX - cx) / (rect.width / 2)
  dy.value = (t.clientY - cy) / (rect.height / 2)
  dx.value = Math.max(-1, Math.min(1, dx.value))
  dy.value = Math.max(-1, Math.min(1, dy.value))
}

function end() {
  active.value = false
  dx.value = 0; dy.value = 0
  clearInterval(timer)
}
</script>

<template>
  <div class="absolute bottom-4 right-4 z-30 md:hidden select-none touch-none">
    <div
      class="w-[112px] h-[112px] rounded-full bg-black/30 backdrop-blur border border-white/20 flex items-center justify-center"
      @touchstart.prevent="start" @touchmove.prevent="move" @touchend="end" @touchcancel="end"
      @mousedown.prevent="start" @mousemove.prevent="move" @mouseup="end" @mouseleave="end"
    >
      <div class="w-[44px] h-[44px] rounded-full bg-white/20 border border-white/30 shadow"
           :style="{ transform: `translate(${dx*28}px, ${dy*28}px)` }"></div>
      <div class="absolute text-white/60 text-[10px] font-bold pointer-events-none">◉ JANDOCITY</div>
    </div>
    <div class="text-center text-[10px] text-white/50 mt-1">desliza para mover</div>
  </div>
</template>
