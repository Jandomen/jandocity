<script setup>
import { usePerformance } from '@/composables/usePerformance.js'
import { PERFORMANCE_PRESETS } from '@/config/performance.js'
const perf = usePerformance()
</script>

<template>
  <div class="bg-[#1e293b] border-2 border-[#334155] rounded-xl p-3 space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-xs font-black text-white">⚡ Rendimiento — Móvil</span>
      <span class="text-[10px] font-mono bg-black/30 px-2 py-1 rounded-full border border-white/10" :class="perf.isLowEnd.value ? 'text-amber-300' : 'text-emerald-300'">{{ perf.effectiveQuality.value }} • {{ perf.preset.value.label }}</span>
    </div>
    <p class="text-[11px] text-white/60 leading-tight">Auto detecta tu dispositivo y limita entidades/efectos para no trabarse. Cambia a Ahorro en móviles lentos.</p>
    <div class="grid grid-cols-4 gap-1.5">
      <button
        v-for="q in ['auto','high','medium','low']"
        :key="q"
        @click="perf.setQuality(q)"
        class="py-2 rounded-lg border-2 text-xs font-black"
        :class="perf.quality.value===q ? 'bg-white text-[#0f172a] border-white' : 'bg-black/20 text-white/60 border-white/10 hover:bg-white/10'"
      >
        {{ q==='auto' ? 'Auto' : PERFORMANCE_PRESETS[q].label }}
        <div class="text-[9px] font-normal opacity-60">{{ q==='auto' ? 'detección' : q }}</div>
      </button>
    </div>
    <div class="grid grid-cols-3 gap-2 text-[10px] font-mono bg-black/20 rounded-lg p-2 border border-white/10">
      <span>👥 {{ perf.preset.value.maxPedestrians }}</span>
      <span>🚗 {{ perf.preset.value.maxVehicles }}</span>
      <span>⏱️ {{ perf.preset.value.trafficTickMs }}ms</span>
    </div>
    <div class="text-[10px] text-white/40">Menos entidades y sin blur/ruido en Ahorro = más FPS en móviles. Se guarda automático.</div>
  </div>
</template>
