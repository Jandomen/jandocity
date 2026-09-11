<script setup>
defineProps({
  show: Boolean,
  isWin: Boolean,
  winner: Object,
  metrics: Object
})
const emit = defineEmits(['menu','rematch'])
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-slate-900 rounded-2xl border border-white/15 w-full max-w-[440px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
      <div class="px-4 py-3 text-center border-b border-white/10" :class="isWin ? 'bg-emerald-900/30' : 'bg-red-900/30'">
        <div class="text-2xl">{{ isWin ? '🏆 ¡VICTORIA!' : '💀 DERROTA' }}</div>
        <div class="text-xs text-white/60 mt-1">{{ isWin ? 'Eliminaste al enemigo hasta la última unidad' : `Ganó ${winner?.color || 'CPU'}` }}</div>
      </div>
      <div class="p-4 space-y-3">
        <div class="bg-slate-800/60 rounded-xl border border-white/10 p-3">
          <div class="text-xs font-black tracking-wider text-white/80">📊 Métricas finales</div>
          <div class="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div class="bg-slate-900 rounded-lg p-2 border border-white/10">
              <div class="font-bold text-sky-300">Tú ({{ metrics?.humanColor || 'azul' }})</div>
              <div>Edificios: {{ metrics?.humanBuildings ?? 0 }}</div>
              <div>Unidades: {{ metrics?.humanUnits ?? 0 }}</div>
              <div>Tiempo: {{ metrics?.time || '0:00' }}</div>
            </div>
            <div class="bg-slate-900 rounded-lg p-2 border border-white/10">
              <div class="font-bold text-red-300">CPU</div>
              <div>Edificios: {{ metrics?.cpuBuildings ?? 0 }}</div>
              <div>Unidades: {{ metrics?.cpuUnits ?? 0 }}</div>
              <div>Eliminados: {{ metrics?.eliminated ?? 0 }}</div>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="emit('menu')" class="flex-1 py-2.5 rounded-xl bg-white text-slate-900 font-black">‹ Menú</button>
          <button @click="emit('rematch')" class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black">↻ Revancha</button>
        </div>
      </div>
    </div>
  </div>
</template>
