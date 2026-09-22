<script setup>
import { Capacitor } from '@capacitor/core'
const emit = defineEmits(['select'])
async function exitApp() {
  try {
    if (Capacitor.isNativePlatform()) {
      try { window.Capacitor?.Plugins?.App?.exitApp?.(); return } catch {}
      try { navigator.app?.exitApp?.(); return } catch {}
      // fallback: minimiza con back
      try { history.back() } catch {}
      return
    }
    window.close()
  } catch { try { window.close() } catch {} }
}
const isNative = (() => { try { return Capacitor.isNativePlatform() } catch { return /Android/i.test(navigator.userAgent||'') } })()
const isElectron = (() => { try { return !!window.__JANDOCITY_ELECTRON__?.isElectron } catch { return false } })()
const isWeb = (() => !isNative && !isElectron)()
</script>

<template>
  <div class="absolute inset-0 z-30 flex flex-col bg-[#0a0f1e] text-white overflow-auto p-4 py-6">
    <!-- Fondo juego: grid + vignette -->
    <div class="absolute inset-0 bg-[#0a0f1e]"></div>
    <div class="absolute inset-0 opacity-40" style="background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 28px 28px;"></div>
    <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.12), transparent 50%);"></div>

    <div class="relative w-full max-w-[420px] flex flex-col items-center gap-5 mx-auto my-4 md:my-auto flex-1 justify-center">
      <!-- Placa título estilo juego -->
      <div class="w-full bg-[#1e293b] border-[3px] border-[#334155] rounded-xl shadow-[0_8px_0_#0f172a,0_12px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] p-4 flex flex-col items-center gap-2">
        <div class="w-16 h-16 rounded-xl bg-gradient-to-b from-[#fde68a] to-[#92400e] border-2 border-white/20 shadow flex items-center justify-center text-2xl">🏙️</div>
        <h1 class="font-black tracking-[0.18em] text-2xl md:text-3xl" style="font-family:'Cinzel','Righteous',serif; color:#fde68a; text-shadow: 0 2px 0 #92400e, 0 4px 12px rgba(0,0,0,0.5);">JANDOCITY</h1>
        <div class="w-full h-[2px] bg-[#334155] rounded-full overflow-hidden"><div class="h-full w-1/3 bg-[#38bdf8]"></div></div>
        <p class="text-[10px] tracking-[0.32em] text-[#94a3b8] font-black">ELIGE UN MODO</p>
      </div>

      <!-- Botones estilo madera/metal juego -->
      <div class="w-full flex flex-col gap-3">
        <button @click="emit('select','free')" class="group w-full flex items-center gap-3 bg-[#14532d] hover:bg-[#15803d] active:translate-y-[2px] text-white rounded-xl px-4 py-3.5 shadow-[0_6px_0_#052e16,0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] border-2 border-[#16a34a] transition-all">
          <span class="w-11 h-11 rounded-lg bg-black/20 border-2 border-white/20 flex items-center justify-center text-xl shadow-inner">🌍</span>
          <div class="text-left flex-1">
            <div class="font-black text-sm tracking-wide" style="text-shadow: 0 1px 0 #052e16;">MODO LIBRE</div>
            <div class="text-[11px] text-white/80 leading-none">Mundos ilimitados • sin registro</div>
          </div>
          <span class="w-7 h-7 rounded-full bg-white text-[#14532d] flex items-center justify-center font-black text-sm group-active:scale-95">›</span>
        </button>

        <button @click="emit('select','single')" class="group w-full flex items-center gap-3 bg-[#1e3a8a] hover:bg-[#1e40af] active:translate-y-[2px] text-white rounded-xl px-4 py-3.5 shadow-[0_6px_0_#1e1b4b,0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] border-2 border-[#38bdf8] transition-all">
          <span class="w-11 h-11 rounded-lg bg-black/20 border-2 border-white/20 flex items-center justify-center text-xl">👤</span>
          <div class="text-left flex-1">
            <div class="font-black text-sm" style="text-shadow: 0 1px 0 #1e1b4b;">UN JUGADOR</div>
            <div class="text-[11px] text-white/80 leading-none">Vs CPU • 1vs1 / 2vs2 • colores</div>
          </div>
          <span class="w-7 h-7 rounded-full bg-white text-[#1e3a8a] flex items-center justify-center font-black text-sm">›</span>
        </button>

        <button @click="emit('select','multi')" class="group w-full flex items-center gap-3 bg-[#581c87] hover:bg-[#6b21a8] active:translate-y-[2px] text-white rounded-xl px-4 py-3.5 shadow-[0_6px_0_#3b0764,0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] border-2 border-[#a78bfa] transition-all">
          <span class="w-11 h-11 rounded-lg bg-black/20 border-2 border-white/20 flex items-center justify-center text-xl">⚔️</span>
          <div class="text-left flex-1">
            <div class="font-black text-sm" style="text-shadow: 0 1px 0 #3b0764;">MULTIJUGADOR</div>
            <div class="text-[11px] text-white/80 leading-none">Hasta 8 • JND-XXXX</div>
          </div>
          <span class="w-7 h-7 rounded-full bg-white text-[#581c87] flex items-center justify-center font-black text-sm">›</span>
        </button>
      </div>

      <!-- Descargas — solo en web (oculto en Android APK y en Electron .exe) -->
      <a v-if="isWeb" href="/Jandocity.apk" download="Jandocity.apk" class="group w-full flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:translate-y-[2px] text-slate-900 rounded-xl px-4 py-3.5 shadow-[0_6px_0_#92400e,0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] border-2 border-white/30 transition-all">
        <span class="w-11 h-11 rounded-lg bg-white/90 border-2 border-white flex items-center justify-center text-xl shadow-inner">📲</span>
        <div class="text-left flex-1">
          <div class="font-black text-sm tracking-wide leading-none">DESCARGAR PARA ANDROID</div>
          <div class="text-[11px] text-slate-900/70 leading-none font-bold mt-1">APK directa • 7.0 MB • v0.1.40</div>
        </div>
        <span class="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs group-active:scale-95">⬇</span>
      </a>
      <a v-if="isWeb" href="/Jandocity-Portable-0.1.40.exe" download="Jandocity-Portable-0.1.40.exe" class="group w-full flex items-center gap-3 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 active:translate-y-[2px] text-white rounded-xl px-4 py-3.5 shadow-[0_6px_0_#1e1b4b,0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] border-2 border-white/30 transition-all">
        <span class="w-11 h-11 rounded-lg bg-white/90 border-2 border-white flex items-center justify-center text-xl shadow-inner">🪟</span>
        <div class="text-left flex-1">
          <div class="font-black text-sm tracking-wide leading-none" style="text-shadow:0 1px 0 #1e1b4b">DESCARGAR PARA WINDOWS</div>
          <div class="text-[11px] text-white/80 leading-none font-bold mt-1">.EXE portable • sin instalar • offline</div>
        </div>
        <span class="w-7 h-7 rounded-full bg-white text-[#1e3a8a] flex items-center justify-center font-black text-xs group-active:scale-95">⬇</span>
      </a>
      <p v-if="isWeb" class="text-[10px] text-white/30 text-center -mt-2 font-mono">Windows: portable — doble click y juega. Android: habilita “orígenes desconocidos”</p>

      <button @click="exitApp" class="w-full mt-2 flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 text-white/70 hover:text-white rounded-xl px-4 py-3 border border-white/10 text-xs font-bold tracking-widest">⏻ SALIR DEL JUEGO</button>

      <div class="flex items-center gap-1.5 text-[10px] text-white/40 font-mono pt-2 pb-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>@2026 JANDOSOFT</span>
      </div>
    </div>
  </div>
</template>
