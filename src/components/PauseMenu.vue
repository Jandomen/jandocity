<script setup>
import { ref, computed } from 'vue'
import AudioControls from '@/components/AudioControls.vue'
import MiniMap from '@/components/MiniMap.vue'
import PerformancePanel from '@/components/PerformancePanel.vue'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useCityStore } from '@/stores/cityStore.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { useMultiplayerSync } from '@/composables/useMultiplayerSync.js'

defineProps({
  show: { type: Boolean, default: false },
  joystickType: { type: String, default: 'thumb' }
})
const emit = defineEmits(['resume','exit','surrender','update:joystickType'])
const tab = ref('main')
const single = useSinglePlayerStore()
const city = useCityStore()
const traffic = useTrafficStore()
const isMobile = computed(() => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '') || (typeof window !== 'undefined' && window.innerWidth < 768))
const isNative = computed(() => { try { return window.Capacitor?.isNativePlatform?.() } catch { return false } })
function setJoystick(t) { emit('update:joystickType', t) }
async function exitAppNative() {
  try { const { Capacitor } = await import('@capacitor/core'); if (Capacitor.isNativePlatform()) { try { await Capacitor.Plugins?.App?.exitApp?.() } catch {} try { window.Capacitor?.Plugins?.App?.exitApp?.() } catch {} return } } catch {}
  try { window.close() } catch {}
}
function openCharacterSelect() {
  try { window.dispatchEvent(new CustomEvent('open-character-select')) } catch {}
}
const prizes = computed(() => {
  try { return JSON.parse(localStorage.getItem('jandocity-prizes') || '[]').slice(0,5) } catch { return [] }
})
const confirmDeleteAccount = ref(false)
const showThankYou = ref(false)
async function handleDeleteAccount() {
  if (!confirmDeleteAccount.value) { confirmDeleteAccount.value = true; setTimeout(()=> confirmDeleteAccount.value=false, 4000); return }
  try {
    const { supabase } = await import('@/lib/supabase.js')
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      try { await supabase.from('profiles').delete().eq('id', user.id) } catch {}
      try { await supabase.auth.signOut() } catch {}
    }
    try {
      localStorage.removeItem('jandocity-player');
      localStorage.removeItem('jandocity-prizes');
      localStorage.removeItem('jandocity-worlds-v1');
      localStorage.removeItem('jandocity-active-world');
      localStorage.removeItem('jandocity-save-v1');
      localStorage.removeItem('jandocity-character');
      localStorage.removeItem('jandocity-joystick');
    } catch {}
    try { city.deleteSave(); } catch {}
    try { traffic.clear(); } catch {}
    showThankYou.value = true
    setTimeout(() => { showThankYou.value = false; emit('exit') }, 2600)
  } catch {}
}
const multiSync = useMultiplayerSync()
const isCoop = computed(() => { try { return multiSync.isActive() && multiSync.gameMode.value === 'coop' } catch { return false } })
function toggleCoopSetting(key) {
  const cur = multiSync.coopSettings.value[key]
  multiSync.setCoopSettings({ [key]: !cur })
}
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-2xl w-full max-w-[420px] max-h-[82vh] flex flex-col overflow-hidden shadow-[0_8px_0_#0f172a,0_16px_32px_rgba(0,0,0,0.6)]">
        <div class="shrink-0 px-4 py-3 border-b-[3px] border-[#334155] flex items-center justify-between bg-[#0f172a]">
          <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif; color:#fde68a; text-shadow: 0 1px 0 #92400e;">PAUSA</h2>
          <span class="hidden md:inline text-[11px] text-white/50 font-mono bg-black/30 px-2 py-1 rounded-full border border-white/10">Esc</span>
        </div>

        <div class="flex-1 overflow-auto p-4 space-y-3 bg-[#0f172a]/50">
          <template v-if="tab==='main'">
            <button @click="emit('resume')" class="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:translate-y-[2px] text-white font-black shadow-[0_4px_0_#052e16] border-2 border-[#22c55e]">▶ Reanudar</button>
            <button @click="tab='map'" class="w-full py-3 rounded-xl bg-[#334155] hover:bg-[#475569] active:translate-y-[1px] text-white font-black shadow-[0_4px_0_#0f172a] border-2 border-[#475569]">🗺️ Mapa</button>
            <div class="grid grid-cols-4 gap-2">
              <button @click="city.isPaused ? city.resume() : city.pause()" class="py-2.5 rounded-xl border-2 text-xs font-black shadow-[0_3px_0_#0f172a]" :class="city.isPaused ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-amber-600 border-amber-400 text-white'">{{ city.isPaused ? '▶' : '⏸' }}</button>
              <button @click="city.saveCity()" class="py-2.5 rounded-xl bg-sky-600 border-2 border-sky-400 text-white text-xs font-black shadow-[0_3px_0_#0f172a]">💾</button>
              <button @click="city.loadCity()" class="py-2.5 rounded-xl bg-slate-600 border-2 border-slate-400 text-white text-xs font-black shadow-[0_3px_0_#0f172a]">📂</button>
              <button @click="city.resetCity()" class="py-2.5 rounded-xl bg-red-700 border-2 border-red-500 text-white text-xs font-black shadow-[0_3px_0_#0f172a]">🔄</button>
            </div>
            <button @click="tab='audio'" class="w-full py-3 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-black border-2 border-[#475569] shadow-[0_4px_0_#0f172a]">🔊 Audio</button>
            <button @click="tab='controls'" class="w-full py-3 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-black border-2 border-[#475569] shadow-[0_4px_0_#0f172a]">🎮 Controles</button>
            <button @click="tab='perf'" class="w-full py-3 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-black border-2 border-emerald-400 shadow-[0_4px_0_#0f172a] flex items-center justify-center gap-2">⚡ Rendimiento</button>
            <button @click="openCharacterSelect" class="w-full py-3 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-white font-black border-2 border-[#38bdf8] shadow-[0_4px_0_#0f172a] flex items-center justify-center gap-2">👤 Cambiar protagonista</button>
            <button v-if="single.isActive" @click="emit('surrender')" class="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black border-2 border-amber-400 shadow-[0_4px_0_#92400e]">🏳️ Claudicar</button>
            <button @click="emit('exit')" class="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black border-2 border-red-400 shadow-[0_4px_0_#7f1d1d]">‹ Menú</button>
            <button v-if="isNative" @click="exitAppNative" class="w-full py-3 rounded-xl bg-black hover:bg-zinc-900 text-white font-black border-2 border-white/20 shadow-[0_4px_0_#000] flex items-center justify-center gap-2">🚪 Salir del juego</button>
            <button @click="tab='cuenta'" class="w-full py-2.5 rounded-xl bg-black/30 border border-white/10 text-white/60 text-xs font-bold hover:text-white hover:bg-white/5">⚙️ Cuenta y datos</button>
            <div v-if="single.isActive" class="bg-black/30 rounded-xl border-2 border-[#334155] p-3">
              <div class="text-xs font-black text-white">📊 Métricas</div>
              <div class="text-[11px] text-white/60 leading-tight mt-1">
                Tus: {{ city.flatGrid.filter(c=>c.isOrigin && c.owner===single.humanPlayer()?.id).length }} edificios / {{ traffic.pedestrians.filter(p=>p.owner===single.humanPlayer()?.id).length + traffic.vehicles.filter(v=>v.owner===single.humanPlayer()?.id).length }} unidades<br>
                CPU: {{ city.flatGrid.filter(c=>c.isOrigin && c.owner && c.owner!==single.humanPlayer()?.id).length }} edificios
              </div>
            </div>
            <div class="bg-black/30 rounded-xl border-2 border-amber-400/30 p-3">
              <div class="text-xs font-black text-white">🏆 Historial Premios</div>
              <div v-if="prizes.length===0" class="text-[11px] text-white/40">Sin premios — gana cuando el rival se sale</div>
              <div v-for="pr in prizes" :key="pr.date" class="text-[10px] text-white/70 border-b border-white/10 py-1 flex justify-between"><span>{{ new Date(pr.date).toLocaleDateString() }} {{ pr.reason }}</span><span class="font-mono">{{ pr.room }}</span></div>
            </div>
            <div v-if="isCoop" class="bg-[#0f172a] border-2 border-emerald-400/30 rounded-xl p-3 space-y-2">
              <div class="text-xs font-black text-emerald-300">🏗️ Coop Libre 8 — Host en vivo</div>
              <label class="flex items-center justify-between text-xs cursor-pointer"><span>Demoler ajeno</span><input type="checkbox" :checked="multiSync.coopSettings.value.allowDemolishOthers" @change="toggleCoopSetting('allowDemolishOthers')" class="accent-emerald-500" /></label>
              <label class="flex items-center justify-between text-xs cursor-pointer"><span>Recursos compartidos</span><input type="checkbox" :checked="multiSync.coopSettings.value.sharedResources" @change="toggleCoopSetting('sharedResources')" class="accent-emerald-500" /></label>
              <label class="flex items-center justify-between text-xs cursor-pointer"><span>Combate</span><input type="checkbox" :checked="multiSync.coopSettings.value.allowCombat" @change="toggleCoopSetting('allowCombat')" class="accent-emerald-500" /></label>
              <p class="text-[10px] text-white/40">Cambios se notifican a todos con toast.</p>
            </div>
          </template>

          <template v-else-if="tab==='audio'">
            <button @click="tab='main'" class="text-xs text-white/60 hover:text-white mb-1">‹ Volver</button>
            <AudioControls />
          </template>

          <template v-else-if="tab==='controls'">
            <button @click="tab='main'" class="text-xs text-white/60 hover:text-white mb-1">‹ Volver</button>
            <div class="bg-[#1e293b] border-2 border-[#334155] rounded-xl p-3 space-y-2 text-xs leading-relaxed">
              <div v-if="isMobile" class="space-y-2">
                <div class="font-black text-white">Controles</div>
                <div class="text-white/80">Palanca para moverte • Botones para música, centrar, chat y demoler • Carrusel para construir</div>
                <div class="grid grid-cols-2 gap-2">
                  <button @click="setJoystick('thumb')" class="py-2.5 rounded-xl border-2 text-xs font-black shadow-[0_3px_0_#0f172a]" :class="joystickType==='thumb' ? 'bg-white text-[#1e293b] border-white' : 'bg-black/20 text-white/60 border-white/10'">◉ Circular</button>
                  <button @click="setJoystick('dpad')" class="py-2.5 rounded-xl border-2 text-xs font-black shadow-[0_3px_0_#0f172a]" :class="joystickType==='dpad' ? 'bg-white text-[#1e293b] border-white' : 'bg-black/20 text-white/60 border-white/10'">✜ Cruz</button>
                </div>
              </div>
              <div v-else class="space-y-2">
                <div class="font-black text-white">Controles</div>
                <div class="text-white/80"><span class="font-mono bg-black/30 px-1.5 py-0.5 rounded border border-white/10">WASD</span> moverte • <span class="font-mono bg-black/30 px-1.5 py-0.5 rounded">H</span> ocultar • <span class="font-mono bg-black/30 px-1.5 py-0.5 rounded">N</span> música • <span class="font-mono bg-black/30 px-1.5 py-0.5 rounded">Esc</span> pausa</div>
              </div>
            </div>
          </template>

          <template v-else-if="tab==='perf'">
            <button @click="tab='main'" class="text-xs text-white/60 hover:text-white mb-1">‹ Volver</button>
            <PerformancePanel />
          </template>

          <template v-else-if="tab==='map'">
            <MiniMap :show="true" @close="tab='main'" />
          </template>

          <template v-else-if="tab==='cuenta'">
            <button @click="tab='main'" class="text-xs text-white/60 hover:text-white mb-1">‹ Volver</button>
            <div class="bg-[#1e293b] border-2 border-[#334155] rounded-xl p-3 space-y-3">
              <div class="text-xs font-black text-white">⚙️ Cuenta y datos</div>
              <p class="text-[11px] text-white/50 leading-tight">Borra tu cuenta, progreso y mundos locales. No está en el menú principal a propósito.</p>
              <button @click="handleDeleteAccount" class="w-full py-3 rounded-xl font-bold text-xs border-2 flex items-center justify-center gap-2" :class="confirmDeleteAccount ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-black/30 border-red-500/50 text-red-300 hover:bg-red-950/30'">{{ confirmDeleteAccount ? '¿Seguro? Toca de nuevo para borrar' : '🗑️ Eliminar cuenta y todo' }}</button>
              <button @click="tab='main'" class="w-full py-2 rounded-full bg-white/10 text-white text-xs">Cancelar</button>
            </div>
          </template>
        </div>

        <div class="shrink-0 px-4 py-2 border-t-[3px] border-[#334155] bg-[#0f172a] text-center text-[10px] text-white/30 font-mono">JANDOSOFT • Pausa</div>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div v-if="showThankYou" class="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-2xl p-6 flex flex-col items-center gap-3 max-w-[360px] text-center shadow-[0_8px_0_#0f172a]">
        <span class="text-4xl">💛</span>
        <h3 class="font-black text-white" style="font-family:'Cinzel',serif;">Gracias por usar Jandocity</h3>
        <p class="text-xs text-white/60">Tu cuenta, mundos y progreso han sido eliminados. ¡Vuelve pronto!</p>
      </div>
    </div>
  </Transition>
</template>
