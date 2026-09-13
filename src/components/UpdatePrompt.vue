<script setup>
import { computed } from 'vue'
import { Capacitor } from '@capacitor/core'
import { useAutoUpdater } from '@/composables/useAutoUpdater.js'

const updater = useAutoUpdater()
const isNative = computed(() => { try { return Capacitor.isNativePlatform() } catch { return false } })
const show = computed(() => isNative.value && ['available','downloading','ready','error'].includes(updater.status.value) && !!updater.pendingUpdate.value)
const title = computed(() => {
  if (updater.status.value === 'downloading') return 'Descargando actualización…'
  if (updater.status.value === 'ready') return '¡Actualización lista!'
  if (updater.status.value === 'error') return 'Error al actualizar'
  return 'Actualización disponible'
})
const sub = computed(() => {
  const v = updater.pendingUpdate.value?.version || updater.remoteVersion.value
  const cur = updater.localVersion.value
  if (updater.status.value === 'downloading') return `Descargando v${v} • ${Math.round(updater.progress.value)}%`
  if (updater.status.value === 'ready') return `v${v} instalada. Reinicia para aplicar los cambios.`
  if (updater.status.value === 'error') return 'No se pudo descargar. Reintenta más tarde.'
  return `Nueva versión v${v} disponible (tienes v${cur}). ¿Quieres actualizar ahora?`
})

async function accept() {
  await updater.startUpdate()
}
function dismiss() {
  updater.dismissUpdate()
}
async function restart() {
  await updater.applyReadyAndRestart()
}
function retry() {
  updater.status.value = 'available'
  updater.progress.value = 0
  accept()
}
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-2xl w-full max-w-[420px] overflow-hidden shadow-[0_8px_0_#0f172a,0_16px_32px_rgba(0,0,0,0.6)]">
        <div class="px-4 py-3 border-b-[3px] border-[#334155] flex items-center gap-3 bg-[#0f172a]">
          <span class="w-9 h-9 rounded-xl bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-lg">⬇️</span>
          <div class="flex-1">
            <h2 class="font-black text-white text-sm leading-none">{{ title }}</h2>
            <p class="text-[11px] text-white/60 font-mono">JANDOSOFT • OTA</p>
          </div>
          <span v-if="updater.pendingUpdate.value?.version" class="text-[11px] font-black bg-white text-slate-900 px-2 py-1 rounded-full">v{{ updater.pendingUpdate.value.version }}</span>
        </div>

        <div class="p-4 space-y-3 bg-[#0f172a]/50">
          <p class="text-xs text-white/80 leading-relaxed">{{ sub }}</p>
          <p v-if="updater.pendingUpdate.value?.notes" class="text-[11px] text-white/50 bg-black/30 rounded-lg px-3 py-2 border border-white/10">{{ updater.pendingUpdate.value.notes }}</p>

          <!-- Barra de progreso -->
          <div v-if="updater.status.value==='downloading' || updater.status.value==='ready'" class="space-y-1.5">
            <div class="h-3 bg-black/40 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div class="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full transition-all duration-300 ease-out" :style="{ width: updater.progress.value + '%' }"></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono">
              <span class="text-white/50">{{ updater.status.value==='ready' ? '100% completado' : Math.round(updater.progress.value) + '% • no cierres la app' }}</span>
              <span v-if="updater.status.value==='downloading'" class="text-emerald-300 animate-pulse">● descargando</span>
              <span v-else class="text-emerald-300">● listo</span>
            </div>
          </div>

          <div v-if="updater.status.value==='error'" class="text-[11px] text-amber-200 bg-amber-950/40 border border-amber-700/40 rounded-lg px-3 py-2">
            Revisa tu conexión e inténtalo de nuevo. No se ha aplicado nada.
          </div>

          <div class="flex gap-2 pt-1">
            <button v-if="updater.status.value==='available'" @click="dismiss" class="flex-1 py-3 rounded-xl bg-black/30 border-2 border-white/10 text-white font-bold text-sm hover:bg-white/10">Más tarde</button>
            <button v-if="updater.status.value==='available'" @click="accept" class="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400 text-white font-black text-sm shadow-[0_4px_0_#052e16] active:translate-y-[1px]">⬇️ Actualizar ahora</button>

            <button v-if="updater.status.value==='downloading'" disabled class="flex-1 py-3 rounded-xl bg-slate-700 border-2 border-slate-500 text-white/60 font-bold text-sm cursor-not-allowed">Descargando… {{ Math.round(updater.progress.value) }}%</button>

            <template v-if="updater.status.value==='ready'">
              <button @click="dismiss" class="flex-1 py-3 rounded-xl bg-black/30 border-2 border-white/10 text-white font-bold text-sm">Luego</button>
              <button @click="restart" class="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 border-2 border-sky-400 text-white font-black text-sm shadow-[0_4px_0_#0c4a6e]">🔄 Reiniciar ahora</button>
            </template>

            <template v-if="updater.status.value==='error'">
              <button @click="dismiss" class="flex-1 py-3 rounded-xl bg-black/30 border-2 border-white/10 text-white font-bold text-sm">Cerrar</button>
              <button @click="retry" class="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 border-2 border-amber-400 text-white font-black text-sm">↻ Reintentar</button>
            </template>
          </div>
          <p class="text-[10px] text-white/30 text-center font-mono">La actualización solo empieza si la aceptas.</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
