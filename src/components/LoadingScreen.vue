<script setup>
defineProps({
  text: { type: String, default: 'Cargando...' },
  subtext: { type: String, default: '' }
})
</script>

<template>
  <div class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-md text-white">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 rounded-full border-2 border-white/20 border-t-emerald-400 animate-spin"></div>
      <div class="text-sm md:text-base font-bold tracking-wide">{{ text }}</div>
      <div v-if="subtext" class="text-xs text-white/60 font-mono text-center max-w-[80vw]">{{ subtext }}</div>
      <div class="flex gap-1 mt-1">
        <span class="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style="animation-delay:0ms"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style="animation-delay:150ms"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style="animation-delay:300ms"></span>
      </div>
    </div>
  </div>
</template>
