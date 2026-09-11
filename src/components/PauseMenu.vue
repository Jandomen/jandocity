<script setup>
import { ref } from 'vue'
import AudioControls from '@/components/AudioControls.vue'
import MiniMap from '@/components/MiniMap.vue'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useCityStore } from '@/stores/cityStore.js'
import { useTrafficStore } from '@/stores/trafficStore.js'

defineProps({
  show: { type: Boolean, default: false },
  joystickType: { type: String, default: 'thumb' } // thumb | dpad
})
const emit = defineEmits(['resume','exit','surrender','update:joystickType'])
const tab = ref('main') // main | audio | controls | map
const single = useSinglePlayerStore()
const city = useCityStore()
const traffic = useTrafficStore()
function setJoystick(t) { emit('update:joystickType', t) }
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-slate-900 rounded-2xl border border-white/15 w-full max-w-[420px] max-h-[82vh] flex flex-col overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
        <!-- header -->
        <div class="shrink-0 px-4 py-3 border-b border-white/10 flex items-center justify-between bg-slate-800/60">
          <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif;">PAUSA</h2>
          <span class="text-[11px] text-white/50">Esc para reanudar</span>
        </div>

        <!-- content -->
        <div class="flex-1 overflow-auto p-4 space-y-3">
          <!-- tabs main -->
          <template v-if="tab==='main'">
            <button @click="emit('resume')" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm">▶ Reanudar</button>
            <button @click="tab='map'" class="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2">🗺️ Mapa <span class="text-white/40">›</span></button>
            <div class="grid grid-cols-4 gap-2">
              <button @click="city.isPaused ? city.resume() : city.pause()" class="py-2.5 rounded-xl border text-xs font-bold" :class="city.isPaused ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-amber-600 border-amber-500 text-white'">{{ city.isPaused ? '▶' : '⏸' }}</button>
              <button @click="city.saveCity()" class="py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold border border-sky-600">💾 Guardar</button>
              <button @click="city.loadCity()" class="py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold border border-white/10">📂 Cargar</button>
              <button @click="city.resetCity()" class="py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold border border-red-700">🔄 Reset</button>
            </div>
            <button @click="tab='audio'" class="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2">🔊 Configuración de Audio <span class="text-white/40">›</span></button>
            <button @click="tab='controls'" class="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2">🎮 Controles <span class="text-white/40">›</span></button>

            <!-- móvil: cambio de palanca -->
            <div class="md:hidden bg-slate-800/60 rounded-xl border border-white/10 p-3">
              <div class="text-xs font-bold tracking-wider text-white/80 mb-2">Palanca móvil</div>
              <div class="grid grid-cols-2 gap-2">
                <button @click="setJoystick('thumb')" class="py-2.5 rounded-lg border text-xs font-bold" :class="joystickType==='thumb' ? 'bg-white text-slate-900 border-white' : 'bg-white/10 text-white/70 border-white/10'">◉ Thumb</button>
                <button @click="setJoystick('dpad')" class="py-2.5 rounded-lg border text-xs font-bold" :class="joystickType==='dpad' ? 'bg-white text-slate-900 border-white' : 'bg-white/10 text-white/70 border-white/10'">✜ Cruz 4 botones</button>
              </div>
              <p class="text-[10px] text-white/40 mt-1.5 leading-tight">Cambia entre palanca circular y D-Pad. Se guarda local.</p>
            </div>

            <button v-if="single.isActive" @click="emit('surrender')" class="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm border border-amber-500/30">🏳️ Claudicar</button>
            <button @click="emit('exit')" class="w-full py-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-sm border border-red-500/30">‹ Salir al menú (mundos)</button>
            <div v-if="single.isActive" class="bg-slate-800/60 rounded-xl border border-white/10 p-3">
              <div class="text-xs font-bold text-white/80">📊 Métricas</div>
              <div class="text-[11px] text-white/60 leading-tight">
                Tus edificios: {{ city.flatGrid.filter(c=>c.isOrigin && c.owner===single.humanPlayer()?.id).length }}<br>
                CPU edificios: {{ city.flatGrid.filter(c=>c.isOrigin && c.owner && c.owner!==single.humanPlayer()?.id).length }}<br>
                Tus unidades: {{ traffic.pedestrians.filter(p=>p.owner===single.humanPlayer()?.id).length + traffic.vehicles.filter(v=>v.owner===single.humanPlayer()?.id).length }}<br>
                CPU unidades: {{ traffic.pedestrians.filter(p=>p.owner && p.owner!==single.humanPlayer()?.id).length + traffic.vehicles.filter(v=>v.owner && v.owner!==single.humanPlayer()?.id).length }}
              </div>
            </div>
          </template>

          <!-- audio tab -->
          <template v-else-if="tab==='audio'">
            <button @click="tab='main'" class="text-xs text-white/60 hover:text-white mb-1">‹ Volver</button>
            <AudioControls />
            <div class="text-[11px] text-white/40 leading-tight">Ajusta música, ambiente y efectos. También puedes pulsar <span class="font-mono text-white">N</span> para cambiar pista.</div>
          </template>

          <!-- controls tab -->
          <template v-else-if="tab==='controls'">
            <button @click="tab='main'" class="text-xs text-white/60 hover:text-white mb-1">‹ Volver</button>
            <div class="bg-slate-800/60 rounded-xl border border-white/10 p-3 space-y-2 text-xs leading-relaxed">
              <div class="font-bold text-white">Web / PC</div>
              <div><span class="font-mono bg-white/10 px-1.5 py-0.5 rounded">WASD / Flechas</span> mover • <span class="font-mono bg-white/10 px-1.5 py-0.5 rounded">H</span> ocultar UI • <span class="font-mono bg-white/10 px-1.5 py-0.5 rounded">N</span> siguiente pista • <span class="font-mono bg-white/10 px-1.5 py-0.5 rounded">I</span> expandir +10 • <span class="font-mono bg-white/10 px-1.5 py-0.5 rounded">M</span> cuadrantes • <span class="font-mono bg-white/10 px-1.5 py-0.5 rounded">Esc</span> pausa • Click izq pinta, der demuele, rueda zoom, arrastre cámara</div>
              <div class="font-bold text-white pt-2">Móvil / APK</div>
              <div>Palanca derecha (thumb o cruz) para mover • Botones izq: ⟲ centrar, ? menú, − retirar, 🧨 demoler (mantén pulsado para borrar) • Carrusel inferior para categorías • Toca modal y ✕ para cerrar</div>
            </div>
            <div class="md:hidden bg-slate-800/60 rounded-xl border border-white/10 p-3">
              <div class="text-xs font-bold tracking-wider text-white/80 mb-2">Palanca móvil</div>
              <div class="grid grid-cols-2 gap-2">
                <button @click="setJoystick('thumb')" class="py-2.5 rounded-lg border text-xs font-bold" :class="joystickType==='thumb' ? 'bg-white text-slate-900 border-white' : 'bg-white/10 text-white/70 border-white/10'">◉ Thumb</button>
                <button @click="setJoystick('dpad')" class="py-2.5 rounded-lg border text-xs font-bold" :class="joystickType==='dpad' ? 'bg-white text-slate-900 border-white' : 'bg-white/10 text-white/70 border-white/10'">✜ Cruz</button>
              </div>
            </div>
          </template>

          <!-- map tab -->
          <template v-else-if="tab==='map'">
            <MiniMap :show="true" @close="tab='main'" />
          </template>
        </div>

        <div class="shrink-0 px-4 py-2 border-t border-white/10 bg-slate-800/40 text-center text-[10px] text-white/30">JANDOSOFT • Pausa</div>
      </div>
    </div>
  </Transition>
</template>
