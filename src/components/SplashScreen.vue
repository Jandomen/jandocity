<script setup>
</script>

<template>
  <div class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden">
    <!-- Fondo sutil -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
    <div class="absolute inset-0 opacity-20" style="background: radial-gradient(ellipse at 50% 30%, rgba(56,189,248,0.25), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(34,197,94,0.15), transparent 50%);"></div>

    <!-- Logo -->
    <div class="relative flex flex-col items-center gap-4 animate-[fadeIn_0.6s_ease]">
      <img src="/favicon.png" alt="Jandocity" class="w-20 h-20 md:w-28 md:h-28 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 animate-[pulse_2s_ease_infinite]" />
      <h1 class="font-black tracking-[0.22em] text-3xl md:text-5xl leading-none select-none" style="font-family:'Cinzel','Righteous',serif; background: linear-gradient(180deg,#fde68a 0%,#f59e0b 55%,#92400e 100%); -webkit-background-clip:text; background-clip:text; color:transparent; filter: drop-shadow(0 2px 0 rgba(0,0,0,0.8)) drop-shadow(0 4px 12px rgba(245,158,11,0.4));">
        JANDOCITY
      </h1>
      <p class="text-[11px] md:text-xs tracking-[0.35em] text-white/50 font-semibold">CONSTRUYE • GESTIONA • EXPANDE</p>
      <div class="mt-4 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-[11px] text-white/60 font-mono tracking-wider">Cargando...</span>
      </div>
    </div>

    <div class="absolute bottom-6 text-[10px] text-white/30 font-mono">© 2026 Jandocity • offline ✓</div>
  </div>
</template>

<style>
@keyframes fadeIn { from { opacity:0; transform: scale(0.96); } to { opacity:1; transform: scale(1); } }
</style>
