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
  // pesada rojo→negro 10s (edificios intactos siguen viéndose tenue), normal blanco 1.8s
  const dur = isHeavy.value ? 10000 : 1800
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
      <!-- Normal: blanco breve -->
      <div v-if="!isHeavy" class="absolute inset-0 bg-white animate-[flash_0.85s_ease-out]"></div>
      <!-- Pesada: rojo intenso → negro 10s pero edificios intactos se siguen viendo tenue -->
      <div v-if="isHeavy" class="absolute inset-0 animate-[flashHeavy_1.6s_ease-out]" style="background: radial-gradient(ellipse at 50% 38%, #fecaca 0%, #dc2626 18%, #991b1b 34%, #450a0a 58%, #000 82%); opacity:0.98;"></div>
      <div v-if="isHeavy" class="absolute inset-0 animate-[darkLinger_10s_ease-out]" style="background: radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 42%, rgba(20,0,0,0.28) 62%, rgba(0,0,0,0.52) 82%);"></div>
      <div v-if="isHeavy" class="absolute w-[240px] h-[240px] rounded-full blur-xl animate-[expand_2.4s_ease-out]" style="background: radial-gradient(circle, #fecaca 0%, #f87171 22%, #dc2626 44%, #7f1d1d 72%, transparent 72%);"></div>
      <div v-else class="absolute w-[160px] h-[160px] rounded-full bg-white/80 blur-xl animate-[expand_1.4s_ease-out]"></div>
      <div v-if="isHeavy" class="absolute w-[380px] h-[380px] rounded-full border-[3px] animate-[expand_3.0s_ease-out]" style="border-color: rgba(220,38,38,0.75);"></div>
      <div v-else class="absolute w-[240px] h-[240px] rounded-full border-4 border-amber-400/70 animate-[expand_1.8s_ease-out]"></div>
      <div class="absolute text-6xl animate-[rise_1.6s_ease-out]">{{ isHeavy ? '💥' : '☢️' }}</div>
      <div v-if="isHeavy" class="absolute bottom-1/3 text-[11px] font-black tracking-widest text-red-100 animate-[rise_1.6s_ease-out]" style="text-shadow:0 1px 6px rgba(0,0,0,0.9)">DETONACIÓN PESADA • ROJO → NEGRO 1H</div>
      <div v-else class="absolute bottom-1/3 text-[10px] font-bold tracking-widest text-amber-900/70 animate-[rise_1.2s_ease-out]">DETONACIÓN ATÓMICA • 7×7</div>
    </div>
  </Transition>
</template>

<style>
@keyframes flash { 0%{opacity:0} 8%{opacity:0.98} 35%{opacity:0.75} 100%{opacity:0} }
@keyframes flashHeavy { 0%{opacity:0} 12%{opacity:1} 30%{opacity:0.96} 100%{opacity:0} }
@keyframes darkLinger { 0%{opacity:0} 15%{opacity:0} 28%{opacity:0.62} 55%{opacity:0.52} 82%{opacity:0.28} 100%{opacity:0} }
@keyframes darkLinger_10s { 0%{opacity:0} 12%{opacity:0} 24%{opacity:0.62} 60%{opacity:0.52} 85%{opacity:0.28} 100%{opacity:0} }
@keyframes expand { 0%{transform:scale(0.2); opacity:0.9} 100%{transform:scale(3.4); opacity:0} }
@keyframes rise { 0%{transform:translateY(24px) scale(0.5); opacity:0} 25%{opacity:1} 100%{transform:translateY(-14px) scale(1.25); opacity:0} }
</style>
