<script setup>
import { ref, computed } from 'vue'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'

const emit = defineEmits(['start','back'])
const single = useSinglePlayerStore()
const enemies = ref(1)
const teamMode = ref('1vs3') // 1vs3 | 2vs2 (solo cuando enemies=3)
const myColor = ref('blue')
const enemyColors = ref(['red','green','yellow'])
const useRandom = ref(false)

const total = computed(() => enemies.value + 1)
const is2vs2 = computed(() => enemies.value === 3 && teamMode.value === '2vs2')

function pickMyColor(id) { myColor.value = id }
function pickEnemyColor(idx, id) { enemyColors.value[idx] = id }
function randomize() {
  useRandom.value = !useRandom.value
  if (useRandom.value) {
    const pool = [...single.COLORS].sort(()=>Math.random()-0.5)
    myColor.value = pool[0].id
    enemyColors.value = [pool[1]?.id || 'red', pool[2]?.id || 'green', pool[3]?.id || 'yellow']
  }
}

function start() {
  const colors = [myColor.value, ...enemyColors.value.slice(0, enemies.value)]
  single.setup(enemies.value, { teamMode: teamMode.value, colors, random: useRandom.value })
  emit('start')
}
</script>

<template>
  <div class="absolute inset-0 z-30 flex flex-col bg-[#0f172a] text-white overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-60"></div>
    <div class="relative flex-1 flex flex-col max-w-[520px] w-full mx-auto p-4 gap-4 overflow-auto">
      <div class="flex items-center justify-between shrink-0">
        <button @click="emit('back')" class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs">‹ Volver</button>
        <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif;">UN JUGADOR — VS CPU</h2>
        <span class="text-[10px] text-white/40">offline</span>
      </div>

      <div class="bg-slate-800/80 rounded-xl border border-white/10 p-4 space-y-4">
        <div class="text-xs font-bold tracking-wider text-sky-300">Elige modo (máx 4 jugadores)</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button @click="enemies=1; teamMode='1vs3'" class="py-3 rounded-xl border flex flex-col items-center gap-1" :class="enemies===1 ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-700 border-white/10 text-white/70'">
            <span class="text-sm font-black">1 vs 1</span><span class="text-[10px]">2 jugadores</span>
          </button>
          <button @click="enemies=2; teamMode='1vs3'" class="py-3 rounded-xl border flex flex-col items-center gap-1" :class="enemies===2 ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-700 border-white/10 text-white/70'">
            <span class="text-sm font-black">1 vs 2</span><span class="text-[10px]">3 jugadores</span>
          </button>
          <button @click="enemies=3; teamMode='1vs3'" class="py-2 rounded-xl border flex flex-col items-center gap-1" :class="enemies===3 && teamMode==='1vs3' ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-700 border-white/10 text-white/70'">
            <span class="text-sm font-black">1 vs 3</span><span class="text-[10px]">4 jug. todos vs tú</span>
          </button>
          <button @click="enemies=3; teamMode='2vs2'" class="py-2 rounded-xl border flex flex-col items-center gap-1" :class="teamMode==='2vs2' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-700 border-white/10 text-white/70'">
            <span class="text-sm font-black">2 vs 2</span><span class="text-[10px]">predeterminado</span>
          </button>
        </div>

        <div class="bg-slate-900/60 rounded-lg border border-white/10 p-3 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white">Colores</span>
            <button @click="randomize" class="px-2 py-1 rounded-full text-[11px] border" :class="useRandom ? 'bg-amber-500 border-amber-400 text-white' : 'bg-white/10 border-white/10 text-white/60'">🎲 {{ useRandom ? 'Aleatorio ON' : 'Aleatorio' }}</button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] w-16">Tú:</span>
            <button v-for="c in single.COLORS" :key="c.id" @click="pickMyColor(c.id)" class="w-7 h-7 rounded-full border-2 flex items-center justify-center" :style="{background:c.bg, borderColor: myColor===c.id ? '#fff' : 'transparent'}" :title="c.label"><span v-if="myColor===c.id" class="text-[10px]">✓</span></button>
            <span class="text-[11px] ml-2" :style="{color: single.COLORS.find(x=>x.id===myColor)?.bg}">{{ single.COLORS.find(x=>x.id===myColor)?.label }}</span>
          </div>
          <div v-for="i in enemies" :key="i" class="flex items-center gap-2">
            <span class="text-[11px] w-16">{{ is2vs2 && i===1 ? 'Aliado:' : `Enemigo ${i}:` }}</span>
            <button v-for="c in single.COLORS" :key="c.id" @click="pickEnemyColor(i-1,c.id)" class="w-6 h-6 rounded-full border" :style="{background:c.bg, borderColor: enemyColors[i-1]===c.id ? '#fff' : 'transparent', opacity: enemyColors[i-1]===c.id ? 1 : 0.7}"></button>
          </div>
          <div class="text-[11px] text-white/50 leading-tight">
            <span v-if="is2vs2">2 vs 2 predeterminado: Tú + aliado vs 2 CPUs.</span>
            <span v-else>1 vs {{ enemies }}: tú vs {{ enemies }} CPU(s) en extremos.</span> Puedes asignar colores o dejar aleatorio. Todo lo que construyas lleva tu color.
          </div>
        </div>

        <div class="text-[11px] text-white/50 leading-tight">Vegetación instant, calles 0.8s, edificios 2-11s con barra 0-100%.</div>
        <button @click="start" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black">▶ Iniciar partida</button>
      </div>
    </div>
  </div>
</template>
