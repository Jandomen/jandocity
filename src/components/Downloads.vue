<script setup>
import { onMounted } from 'vue'
import { useDownloads } from '@/composables/useDownloads.js'

const emit = defineEmits(['back'])
const { counts, total, loading, fetchCounts, track } = useDownloads()

onMounted(() => fetchCounts())

async function handleDownload(platform, href) {
  // track primero, luego descarga
  await track(platform).catch(()=>{})
  // trigger download
  try {
    const a = document.createElement('a')
    a.href = href
    a.download = href.split('/').pop()
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch {
    window.location.href = href
  }
}
</script>

<template>
  <div class="absolute inset-0 z-30 flex flex-col bg-[#0a0f1e] text-white overflow-auto p-4 py-6">
    <div class="absolute inset-0 bg-[#0a0f1e]"></div>
    <div class="absolute inset-0 opacity-40" style="background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 28px 28px;"></div>
    <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.12), transparent 50%);"></div>

    <div class="relative w-full max-w-[560px] flex flex-col gap-4 mx-auto my-2 md:my-auto">
      <!-- Header -->
      <div class="w-full bg-[#1e293b] border-[3px] border-[#334155] rounded-xl shadow-[0_8px_0_#0f172a,0_12px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] p-4 flex flex-col items-center gap-2">
        <div class="w-full flex items-center justify-between">
          <button @click="emit('back')" class="w-9 h-9 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:bg-white/10">←</button>
          <h1 class="font-black tracking-[0.16em] text-xl md:text-2xl flex-1 text-center" style="font-family:'Cinzel','Righteous',serif; color:#fde68a; text-shadow: 0 2px 0 #92400e;">DESCARGAS</h1>
          <div class="w-9 h-9"></div>
        </div>
        <div class="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-3 py-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[11px] font-black tracking-widest text-white/80">TOTAL DESCARGAS</span>
          <span class="bg-white text-slate-900 font-black text-xs px-2.5 py-1 rounded-full min-w-[40px] text-center">{{ loading ? '…' : total.toLocaleString('es') }}</span>
        </div>
        <p class="text-[10px] tracking-[0.2em] text-[#94a3b8] font-black">ELIGE TU PLATAFORMA • OFFLINE</p>
      </div>

      <!-- Android -->
      <div class="w-full bg-gradient-to-br from-[#14532d] to-[#052e16] border-[3px] border-[#16a34a] rounded-xl p-4 shadow-[0_6px_0_#052e16,0_8px_16px_rgba(0,0,0,0.4)] flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-inner border-2 border-white/20 shrink-0">
            <!-- Android logo oficial SVG -->
            <svg viewBox="0 0 24 24" class="w-9 h-9" fill="#3DDC84" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11 5 10.33 5 9.5 4.33 8 3.5 8zm13 0c-.83 0-1.5.67-1.5 1.5S15.67 11 16.5 11 18 10.33 18 9.5 17.33 8 16.5 8zm-7 0c-.83 0-1.5.67-1.5 1.5S8.67 11 9.5 11 11 10.33 11 9.5 9.5 8 9.5 8zm-3.5 2.5h8V5.5A4.5 4.5 0 0 0 9.5 1 4.5 4.5 0 0 0 5 5.5v5z"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="font-black text-white text-sm tracking-wide flex items-center gap-2">ANDROID <span class="text-[10px] bg-white text-[#14532d] px-2 py-0.5 rounded-full">{{ counts.android.toLocaleString() }} descargas</span></div>
            <div class="text-[11px] text-white/70 leading-none mt-1">APK directa • sin Play Store • offline</div>
          </div>
        </div>
        <button @click="handleDownload('android','/Jandocity.apk')" class="w-full flex items-center gap-3 bg-white hover:bg-white/90 text-[#14532d] rounded-xl px-4 py-3 font-black text-sm shadow-[0_4px_0_#052e16] active:translate-y-[1px] transition-all">
          <span class="flex-1 text-left">📲 Descargar APK <span class="font-mono text-[11px] opacity-70">7.0 MB • v0.1.40</span></span>
          <span class="bg-[#14532d] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs">⬇</span>
        </button>
        <p class="text-[10px] text-white/40 font-mono text-center">Habilita “orígenes desconocidos” si te lo pide</p>
      </div>

      <!-- Windows -->
      <div class="w-full bg-gradient-to-br from-[#1e3a8a] to-[#1e1b4b] border-[3px] border-[#38bdf8] rounded-xl p-4 shadow-[0_6px_0_#1e1b4b,0_8px_16px_rgba(0,0,0,0.4)] flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-inner border-2 border-white/20 shrink-0">
            <!-- Windows logo oficial 4 panes -->
            <svg viewBox="0 0 24 24" class="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <path fill="#00A4EF" d="M3 3.5h8v8H3z"/><path fill="#FFB900" d="M13 3.5h8v8h-8z"/><path fill="#7FBA00" d="M3 13.5h8v8H3z"/><path fill="#F25022" d="M13 13.5h8v8h-8z"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="font-black text-white text-sm tracking-wide flex items-center gap-2 flex-wrap">WINDOWS <span class="text-[10px] bg-white text-[#1e3a8a] px-2 py-0.5 rounded-full">{{ (Number(counts.windows_portable)+Number(counts.windows_installer)).toLocaleString() }} descargas</span></div>
            <div class="text-[11px] text-white/70 leading-none mt-1">Portable o instalador • offline • auto-update</div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button @click="handleDownload('windows_portable','/Jandocity-Portable-0.1.40.exe')" class="flex items-center gap-2 bg-white hover:bg-white/90 text-[#1e3a8a] rounded-xl px-3 py-3 font-black text-xs shadow-[0_4px_0_#1e1b4b] active:translate-y-[1px]">
            <span class="flex-1 text-left leading-none">Portable<br><span class="font-mono text-[10px] opacity-60">91 MB • sin instalar</span></span>
            <span class="bg-[#1e3a8a] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0">⬇</span>
          </button>
          <button @click="handleDownload('windows_installer','/Jandocity-Installer-0.1.40.exe')" class="flex items-center gap-2 bg-white/15 hover:bg-white/20 border border-white/20 text-white rounded-xl px-3 py-3 font-bold text-xs">
            <span class="flex-1 text-left leading-none">Instalador<br><span class="font-mono text-[10px] opacity-60">91 MB • NSIS</span></span>
            <span class="bg-white text-[#1e3a8a] w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0">⬇</span>
          </button>
        </div>
        <div class="flex justify-between text-[10px] font-mono text-white/40">
          <span>Portable: {{ counts.windows_portable.toLocaleString() }}</span>
          <span>Instalador: {{ counts.windows_installer.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Linux -->
      <div class="w-full bg-gradient-to-br from-[#7c2d12] to-[#431407] border-[3px] border-[#fb923c] rounded-xl p-4 shadow-[0_6px_0_#431407,0_8px_16px_rgba(0,0,0,0.4)] flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-inner border-2 border-white/20 shrink-0">
            <!-- Tux Linux logo simplificado -->
            <svg viewBox="0 0 24 24" class="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="12" cy="14.5" rx="7" ry="6.5" fill="#000"/><ellipse cx="12" cy="14.2" rx="6.2" ry="5.8" fill="#fff"/>
              <ellipse cx="9.2" cy="12.2" rx="1.1" ry="1.5" fill="#000"/><ellipse cx="14.8" cy="12.2" rx="1.1" ry="1.5" fill="#000"/>
              <ellipse cx="12" cy="15.8" rx="1.8" ry="1.2" fill="#FFC107" stroke="#000" stroke-width="0.4"/>
              <path d="M9 9c0-1.5 1.3-2.7 3-2.7S15 7.5 15 9" fill="none" stroke="#000" stroke-width="0.7"/>
              <ellipse cx="10" cy="10.2" rx="0.4" ry="0.6" fill="#fff"/><ellipse cx="14" cy="10.2" rx="0.4" ry="0.6" fill="#fff"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="font-black text-white text-sm tracking-wide flex items-center gap-2 flex-wrap">LINUX <span class="text-[10px] bg-white text-[#7c2d12] px-2 py-0.5 rounded-full">{{ (Number(counts.linux_deb)+Number(counts.linux_appimage)).toLocaleString() }} descargas</span></div>
            <div class="text-[11px] text-white/70 leading-none mt-1">Instalador • portable</div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button @click="handleDownload('linux_deb','/Jandocity-0.1.40.deb')" class="flex items-center gap-2 bg-white hover:bg-white/90 text-[#7c2d12] rounded-xl px-3 py-3 font-black text-xs shadow-[0_4px_0_#431407] active:translate-y-[1px]">
            <span class="flex-1 text-left leading-none">.DEB<br><span class="font-mono text-[10px] opacity-60">86 MB • sudo dpkg -i</span></span>
            <span class="bg-[#7c2d12] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0">⬇</span>
          </button>
          <a href="https://github.com/Jandomen/jandocity/releases/download/v0.1.40/Jandocity-Portable-0.1.40.AppImage" target="_blank" @click="track('linux_appimage')" class="flex items-center gap-2 bg-white/15 hover:bg-white/20 border border-white/20 text-white rounded-xl px-3 py-3 font-bold text-xs text-center justify-center">
            <span class="flex-1 text-left leading-none">AppImage<br><span class="font-mono text-[10px] opacity-60">123 MB • portable</span></span>
            <span class="bg-white text-[#7c2d12] w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0">⬇</span>
          </a>
        </div>
        <div class="flex justify-between text-[10px] font-mono text-white/40">
          <span>DEB: {{ counts.linux_deb.toLocaleString() }}</span>
          <span>AppImage: {{ counts.linux_appimage.toLocaleString() }}</span>
        </div>
        <p class="text-[10px] text-white/30 font-mono text-center">AppImage por límite GitHub 100MB → en Releases</p>
      </div>

      <div class="text-[10px] text-white/10 font-mono text-center py-2 opacity-0 select-none">—</div>
    </div>
  </div>
</template>

<style scoped>
</style>
