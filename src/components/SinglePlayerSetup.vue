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
  <div class="absolute inset-0 z-30 flex flex-col bg-[#0a0f1e] text-white overflow-hidden p-4 py-6">
    <div class="absolute inset-0 bg-[#0a0f1e]"></div>
    <div class="absolute inset-0 opacity-40" style="background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 28px 28px;"></div>
    <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.12), transparent 50%);"></div>
    <div class="relative flex-1 flex flex-col max-w-[520px] w-full mx-auto gap-4 overflow-auto">
      <div class="flex items-center justify-between shrink-0">
        <button @click="emit('back')" class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs backdrop-blur">‹ Volver</button>
        <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif; color:#fde68a; text-shadow: 0 1px 0 #92400e;">UN JUGADOR — VS CPU</h2>
        <span class="text-[10px] text-white/40 bg-black/30 px-2 py-1 rounded-full border border-white/10">offline</span>
      </div>

      <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-xl shadow-[0_8px_0_#0f172a,0_12px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] p-4 space-y-4">
        <div class="text-xs font-bold tracking-wider text-sky-300">Elige modo (máx 4 jugadores)</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button @click="enemies=1; teamMode='1vs3'" class="group py-3 rounded-xl border-2 flex flex-col items-center gap-1 shadow-[0_6px_0_#052e16] active:translate-y-[2px] transition-all" :class="enemies===1 ? 'bg-[#14532d] border-[#16a34a] text-white' : 'bg-[#1e293b] border-[#334155] text-white/70'">
            <span class="text-lg">⚔️</span><span class="text-sm font-black">1 vs 1</span><span class="text-[10px]">2 jugadores</span>
          </button>
          <button @click="enemies=2; teamMode='1vs3'" class="group py-3 rounded-xl border-2 flex flex-col items-center gap-1 shadow-[0_6px_0_#1e1b4b] active:translate-y-[2px] transition-all" :class="enemies===2 ? 'bg-[#1e3a8a] border-[#38bdf8] text-white' : 'bg-[#1e293b] border-[#334155] text-white/70'">
            <span class="text-lg">⚔️</span><span class="text-sm font-black">1 vs 2</span><span class="text-[10px]">3 jugadores</span>
          </button>
          <button @click="enemies=3; teamMode='1vs3'" class="group py-2 rounded-xl border-2 flex flex-col items-center gap-1 shadow-[0_6px_0_#3b0764] active:translate-y-[2px] transition-all" :class="enemies===3 && teamMode==='1vs3' ? 'bg-[#581c87] border-[#a78bfa] text-white' : 'bg-[#1e293b] border-[#334155] text-white/70'">
            <span class="text-lg">⚔️</span><span class="text-sm font-black">1 vs 3</span><span class="text-[10px]">4 jug. todos vs tú</span>
          </button>
          <button @click="enemies=3; teamMode='2vs2'" class="group py-2 rounded-xl border-2 flex flex-col items-center gap-1 shadow-[0_6px_0_#78350f] active:translate-y-[2px] transition-all" :class="teamMode==='2vs2' ? 'bg-[#92400e] border-[#f59e0b] text-white' : 'bg-[#1e293b] border-[#334155] text-white/70'">
            <span class="text-lg">🤝</span><span class="text-sm font-black">2 vs 2</span><span class="text-[10px]">predeterminado</span>
          </button>
        </div>

        <div class="bg-[#0f172a]/60 rounded-lg border-2 border-[#334155] p-3 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white" style="color:#fde68a;">Colores</span>
            <button @click="randomize" class="px-2 py-1 rounded-full text-[11px] border-2 shadow-[0_2px_0_#0f172a]" :class="useRandom ? 'bg-amber-500 border-amber-400 text-white' : 'bg-[#1e293b] border-[#334155] text-white/60'">🎲 {{ useRandom ? 'Aleatorio ON' : 'Aleatorio' }}</button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] w-16">Tú:</span>
            <button v-for="c in single.COLORS" :key="c.id" @click="pickMyColor(c.id)" class="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-[0_2px_0_#0f172a]" :style="{background:c.bg, borderColor: myColor===c.id ? '#fff' : 'transparent'}" :title="c.label"><span v-if="myColor===c.id" class="text-[10px]">✓</span></button>
            <span class="text-[11px] ml-2" :style="{color: single.COLORS.find(x=>x.id===myColor)?.bg}">{{ single.COLORS.find(x=>x.id===myColor)?.label }}</span>
          </div>
          <div v-for="i in enemies" :key="i" class="flex items-center gap-2">
            <span class="text-[11px] w-16">{{ is2vs2 && i===1 ? 'Aliado:' : `Enemigo ${i}:` }}</span>
            <button v-for="c in single.COLORS" :key="c.id" @click="pickEnemyColor(i-1,c.id)" class="w-6 h-6 rounded-full border-2 shadow-[0_2px_0_#0f172a]" :style="{background:c.bg, borderColor: enemyColors[i-1]===c.id ? '#fff' : 'transparent', opacity: enemyColors[i-1]===c.id ? 1 : 0.7}"></button>
          </div>
          <div class="text-[11px] text-white/50 leading-tight">
            <span v-if="is2vs2">2 vs 2 predeterminado: Tú + aliado vs 2 CPUs.</span>
            <span v-else>1 vs {{ enemies }}: tú vs {{ enemies }} CPU(s) en extremos.</span> Puedes asignar colores o dejar aleatorio. Todo lo que construyas lleva tu color.
          </div>
        </div>

        <div class="text-[11px] text-white/50 leading-tight">Vegetación instant, calles 0.8s, edificios 2-11s con barra 0-100%.</div>
        <button @click="start" class="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] border-2 border-[#22c55e] shadow-[0_6px_0_#052e16] text-white font-black active:translate-y-[2px] transition-all">▶ Iniciar partida</button>
      </div>
    </div>
  </div>
</template>
