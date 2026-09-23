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

    <div class="relative w-full max-w-[340px] md:max-w-[560px] flex flex-col gap-4 mx-auto my-2 md:my-auto">
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
            <!-- Android logo oficial react-icons FaAndroid -->
            <svg viewBox="0 0 576 512" class="w-9 h-9" fill="#3DDC84" xmlns="http://www.w3.org/2000/svg">
              <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55"/>
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
            <!-- Windows logo oficial react-icons FaWindows -->
            <svg viewBox="0 0 448 512" class="w-8 h-8" fill="#0078D6" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"/>
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
            <!-- Linux logo oficial react-icons FaLinux -->
            <svg viewBox="0 0 448 512" class="w-8 h-8" fill="#000" xmlns="http://www.w3.org/2000/svg">
              <path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7z"/>
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
