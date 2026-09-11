<script setup>
const emit = defineEmits(['select'])
</script>

<template>
  <div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden p-4">
    <!-- Fondo -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
    <div class="absolute inset-0 opacity-20" style="background: radial-gradient(ellipse at 50% 20%, rgba(56,189,248,0.2), transparent 60%);"></div>

    <div class="relative w-full max-w-[420px] flex flex-col items-center gap-6">
      <!-- Título -->
      <div class="flex flex-col items-center gap-2">
        <img src="/favicon.png" alt="Jandocity" class="w-14 h-14 rounded-xl shadow border border-white/20" />
        <h1 class="font-black tracking-[0.2em] text-2xl md:text-3xl" style="font-family:'Cinzel','Righteous',serif; background: linear-gradient(180deg,#fde68a 0%,#f59e0b 55%,#92400e 100%); -webkit-background-clip:text; background-clip:text; color:transparent;">JANDOCITY</h1>
        <p class="text-[11px] tracking-[0.3em] text-white/40 font-semibold">ELIGE UN MODO</p>
      </div>

      <!-- Botones -->
      <div class="w-full flex flex-col gap-3">
        <!-- Modo libre -->
        <button @click="emit('select','free')" class="group w-full flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-xl px-4 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-white/10 transition-all">
          <span class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg">🌍</span>
          <div class="text-left flex-1">
            <div class="font-black text-sm tracking-wide">Modo libre</div>
            <div class="text-[11px] text-white/80 leading-none">Local • sin registro • mundos ilimitados</div>
          </div>
          <span class="text-white/60 group-hover:translate-x-0.5 transition-transform">›</span>
        </button>

        <!-- Un jugador -->
        <button @click="emit('select','single')" class="w-full flex items-center gap-3 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white rounded-xl px-4 py-3.5 shadow border border-white/10 transition-all relative overflow-hidden">
          <span class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg">👤</span>
          <div class="text-left flex-1">
            <div class="font-bold text-sm">Un jugador</div>
            <div class="text-[11px] text-white/80 leading-none">Offline vs CPU • 1vs1 / 2vs2 • colores</div>
          </div>
          <span class="text-white/60">›</span>
        </button>

        <!-- Multijugador -->
        <button @click="emit('select','multi')" class="w-full flex items-center gap-3 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white rounded-xl px-4 py-3.5 shadow border border-white/10 transition-all">
          <span class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg">⚔️</span>
          <div class="text-left flex-1">
            <div class="font-bold text-sm">Multijugador</div>
            <div class="text-[11px] text-white/80 leading-none">Hasta 8 • clave JND-XXXX • elimina al rival</div>
          </div>
          <span class="text-white/60">›</span>
        </button>
      </div>

      <p class="text-[10px] text-white/30 text-center leading-tight max-w-[320px]">
        Modo libre y Un jugador en tu dispositivo.<br/>Multijugador en línea.
      </p>
    </div>
  </div>
</template>
