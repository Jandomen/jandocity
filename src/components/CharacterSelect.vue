<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/stores/playerStore.js'
import { CHARACTERS } from '@/config/characters.js'

const emit = defineEmits(['select','close'])
const props = defineProps({ show: Boolean })
const player = usePlayerStore()
const selected = ref(player.characterId)

const selectedLabel = computed(() => {
  const found = CHARACTERS.find(c => c.id === selected.value)
  return found ? found.label : selected.value
})

watch(() => player.characterId, (v) => { selected.value = v })
watch(() => props.show, (v) => { if (v) selected.value = player.characterId })

function confirm() {
  player.setCharacter(selected.value)
  emit('select', selected.value)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-2xl w-full max-w-[340px] md:max-w-[560px] max-h-[86vh] flex flex-col overflow-hidden shadow-[0_8px_0_#0f172a,0_16px_32px_rgba(0,0,0,0.6)]">
      <div class="shrink-0 px-4 py-3 border-b-[3px] border-[#334155] bg-[#0f172a] flex items-center justify-between">
        <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif; color:#fde68a;">ELIGE PROTAGONISTA — 10 disponibles</h2>
        <span class="text-[11px] text-white/50 font-mono bg-black/30 px-2 py-1 rounded-full border border-white/10">{{ selected }}</span>
      </div>
      <div class="flex-1 overflow-auto p-3 bg-[#0f172a]/50">
        <p class="text-[11px] text-white/60 text-center mb-3">Incluye mujeres y estilos diversos. Se guarda automáticamente.</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="c in CHARACTERS"
            :key="c.id"
            @click="selected=c.id"
            class="relative rounded-xl border-2 p-3 flex flex-col items-center gap-1.5 text-left transition-all"
            :class="selected===c.id ? 'bg-white text-[#0f172a] border-[#38bdf8] shadow-[0_4px_0_#0f172a] scale-[1.02]' : 'bg-[#1e293b] text-white border-[#334155] hover:bg-[#27354f]'"
          >
            <span class="text-3xl">{{ c.icon }}</span>
            <span class="text-xs font-black tracking-wide">{{ c.label }} <span class="text-[9px] font-bold px-1 py-0.5 rounded" :class="c.gender==='F'?'bg-pink-500 text-white':'bg-sky-600 text-white'">{{ c.gender }}</span></span>
            <span class="text-[10px] opacity-70 leading-tight text-center">{{ c.desc }}</span>
            <span v-if="selected===c.id" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#38bdf8] text-white flex items-center justify-center text-xs">✓</span>
            <!-- mini preview colors -->
            <div class="flex gap-1 mt-1">
              <span class="w-3 h-3 rounded-full border border-black/10" :style="{background:c.skin}"></span>
              <span class="w-3 h-3 rounded-full border border-black/10" :style="{background:c.hair}"></span>
              <span class="w-3 h-3 rounded-full border border-black/10" :style="{background:c.shirt}"></span>
              <span class="w-3 h-3 rounded-full border border-black/10" :style="{background:c.pants}"></span>
            </div>
          </button>
        </div>
      </div>
      <div class="shrink-0 p-3 border-t-[3px] border-[#334155] bg-[#0f172a] flex gap-2">
        <button @click="emit('close')" class="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold border-2 border-white/15">✕ Cerrar</button>
        <button @click="confirm" class="flex-1 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-black border-2 border-[#22c55e] shadow-[0_4px_0_#052e16]">✓ Confirmar {{ selectedLabel }}</button>
      </div>
    </div>
  </div>
</template>
