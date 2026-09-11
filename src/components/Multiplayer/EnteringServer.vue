<script setup>
defineProps({ roomKey: String })
</script>

<template>
  <div class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-md text-white">
    <div class="w-12 h-12 rounded-full border-2 border-white/20 border-t-emerald-400 animate-spin"></div>
    <div class="mt-3 text-sm font-black tracking-widest">Entrando al servidor…</div>
    <div class="text-xs text-white/60">{{ roomKey || 'JND-XXXX' }} • https://jandocity.vercel.app</div>
  </div>
</template>
