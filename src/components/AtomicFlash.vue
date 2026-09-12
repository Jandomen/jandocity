<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ trigger: Number, heavy: Boolean, variant: String })
const show = ref(false)
const isHeavy = ref(false)
let t1=null, t2=null
watch(() => props.trigger, (v) => {
  if (!v) return
  // detect heavy from prop or global flag
  isHeavy.value = !!props.heavy || props.variant === 'heavy' || (typeof window !== 'undefined' && window.__atomicFlashHeavy)
  show.value = true
  clearTimeout(t1); clearTimeout(t2)
  const dur = isHeavy.value ? 1600 : 1200
  t1 = setTimeout(()=> show.value=false, dur)
  // clear flag
  if (typeof window !== 'undefined') window.__atomicFlashHeavy = false
})
// also listen directly for heavy flag via custom event payload stored on window
if (typeof window !== 'undefined') {
  window.addEventListener('atomic-flash', (e) => {
    if (e.detail?.heavy) window.__atomicFlashHeavy = true
  })
}
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[80] pointer-events-none flex items-center justify-center">
      <!-- heavy = naranja intenso casi negro flash, normal = blanco -->
      <div v-if="isHeavy" class="absolute inset-0 animate-[flashHeavy_0.45s_ease-out]" style="background: radial-gradient(ellipse at 50% 40%, #fb923c 0%, #ea580c 22%, #431407 55%, #000 85%); opacity:0.96;"></div>
      <div v-else class="absolute inset-0 bg-white animate-[flash_0.35s_ease-out]"></div>
      <div v-if="isHeavy" class="absolute w-[160px] h-[160px] rounded-full blur-xl animate-[expand_1.2s_ease-out]" style="background: radial-gradient(circle, #fdba74 0%, #fb923c 40%, #9a3412 75%, transparent 75%);"></div>
      <div v-else class="absolute w-[120px] h-[120px] rounded-full bg-white/80 blur-xl animate-[expand_0.9s_ease-out]"></div>
      <div v-if="isHeavy" class="absolute w-[260px] h-[260px] rounded-full border-4 animate-[expand_1.4s_ease-out]" style="border-color: rgba(251,146,60,0.7);"></div>
      <div v-else class="absolute w-[200px] h-[200px] rounded-full border-4 border-amber-400/60 animate-[expand_1.1s_ease-out]"></div>
      <div class="absolute text-5xl animate-[rise_1s_ease-out]">{{ isHeavy ? '💥' : '☢️' }}</div>
      <div v-if="isHeavy" class="absolute bottom-1/3 text-[11px] font-black tracking-widest text-orange-100/80 animate-[rise_1s_ease-out]">DETONACIÓN PESADA • SUELO CASI NEGRO</div>
    </div>
  </Transition>
</template>

<style>
@keyframes flash { 0%{opacity:0} 10%{opacity:0.95} 60%{opacity:0.7} 100%{opacity:0} }
@keyframes flashHeavy { 0%{opacity:0} 12%{opacity:1} 35%{opacity:0.88} 100%{opacity:0} }
@keyframes expand { 0%{transform:scale(0.2); opacity:0.9} 100%{transform:scale(3); opacity:0} }
@keyframes rise { 0%{transform:translateY(20px) scale(0.5); opacity:0} 30%{opacity:1} 100%{transform:translateY(-10px) scale(1.2); opacity:0} }
</style>
