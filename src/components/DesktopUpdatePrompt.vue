<script setup>
import { computed, onMounted } from 'vue'
import { useElectronUpdater } from '@/composables/useElectronUpdater.js'

const updater = useElectronUpdater()
const show = computed(() => updater.isElectron() && ['available','downloading','ready','error'].includes(updater.status.value) && !!updater.pendingUpdate.value)
const title = computed(() => {
  if (updater.status.value === 'downloading') return 'Descargando actualización…'
  if (updater.status.value === 'ready') return '¡Actualización lista!'
  if (updater.status.value === 'error') return 'Error al actualizar'
  return 'Actualización disponible (Windows)'
})
const sub = computed(() => {
  const v = updater.pendingUpdate.value?.version || updater.remoteVersion.value
  const cur = updater.localVersion.value
  if (updater.status.value === 'downloading') return `Descargando v${v} • ${Math.round(updater.progress.value)}%`
  if (updater.status.value === 'ready') return `v${v} lista. Reinicia para aplicar.`
  if (updater.status.value === 'error') return 'No se pudo descargar. Reintenta más tarde.'
  return `Nueva versión v${v} disponible (tienes v${cur}).`
})

async function accept() { await updater.downloadUpdate() }
function dismiss() { updater.dismiss() }
async function restart() { await updater.installAndRestart() }

onMounted(() => {
  updater.listen()
  // check 3s después si está empaquetado
  setTimeout(() => { if (updater.isElectron()) updater.checkForUpdates() }, 3500)
})
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-2xl w-full max-w-[420px] overflow-hidden shadow-[0_8px_0_#0f172a,0_16px_32px_rgba(0,0,0,0.6)]">
        <div class="px-4 py-3 border-b-[3px] border-[#334155] flex items-center gap-3 bg-[#0f172a]">
          <span class="w-9 h-9 rounded-xl bg-sky-600 border-2 border-sky-400 flex items-center justify-center text-lg">🪟</span>
          <div class="flex-1">
            <h2 class="font-black text-white text-sm leading-none">{{ title }}</h2>
            <p class="text-[11px] text-white/60 font-mono">JANDOSOFT • WINDOWS</p>
          </div>
          <span v-if="updater.pendingUpdate.value?.version" class="text-[11px] font-black bg-white text-slate-900 px-2 py-1 rounded-full">v{{ updater.pendingUpdate.value.version }}</span>
        </div>
        <div class="p-4 space-y-3 bg-[#0f172a]/50">
          <p class="text-xs text-white/80 leading-relaxed">{{ sub }}</p>
          <div v-if="updater.status.value==='downloading' || updater.status.value==='ready'" class="space-y-1.5">
            <div class="h-3 bg-black/40 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div class="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300" :style="{ width: updater.progress.value + '%' }"></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono">
              <span class="text-white/50">{{ updater.status.value==='ready' ? '100% completado' : Math.round(updater.progress.value) + '% • no cierres' }}</span>
              <span v-if="updater.status.value==='downloading'" class="text-sky-300 animate-pulse">● descargando</span>
              <span v-else class="text-emerald-300">● listo</span>
            </div>
          </div>
          <div class="flex gap-2 pt-1">
            <button v-if="updater.status.value==='available'" @click="dismiss" class="flex-1 py-3 rounded-xl bg-black/30 border-2 border-white/10 text-white font-bold text-sm">Más tarde</button>
            <button v-if="updater.status.value==='available'" @click="accept" class="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 border-2 border-sky-400 text-white font-black text-sm shadow-[0_4px_0_#0c4a6e]">⬇️ Descargar</button>
            <button v-if="updater.status.value==='downloading'" disabled class="flex-1 py-3 rounded-xl bg-slate-700 border-2 border-slate-500 text-white/60 font-bold text-sm">Descargando… {{ Math.round(updater.progress.value) }}%</button>
            <template v-if="updater.status.value==='ready'">
              <button @click="dismiss" class="flex-1 py-3 rounded-xl bg-black/30 border-2 border-white/10 text-white font-bold text-sm">Luego</button>
              <button @click="restart" class="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400 text-white font-black text-sm">🔄 Reiniciar</button>
            </template>
            <template v-if="updater.status.value==='error'">
              <button @click="dismiss" class="flex-1 py-3 rounded-xl bg-black/30 border-2 border-white/10 text-white font-bold text-sm">Cerrar</button>
              <button @click="accept" class="flex-1 py-3 rounded-xl bg-amber-600 border-2 border-amber-400 text-white font-black text-sm">↻ Reintentar</button>
            </template>
          </div>
          <p class="text-[10px] text-white/30 text-center font-mono">Funciona offline. Solo necesita internet para buscar la nueva versión.</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
