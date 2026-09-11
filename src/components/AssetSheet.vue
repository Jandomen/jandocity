<script setup>
import RoadKit from './assets/RoadKit.vue'
import ResidentialSet from './assets/ResidentialSet.vue'
import CommercialSet from './assets/CommercialSet.vue'
import FactorySet from './assets/FactorySet.vue'
import ParkSet from './assets/ParkSet.vue'
import VegetationSet from './assets/VegetationSet.vue'
import TerrainSet from './assets/TerrainSet.vue'
import { ref } from 'vue'

const tab = ref('residential')
const tabs = [
  {id:'residential', label:'🏠 Residencial'},
  {id:'roads', label:'🛣️ Carreteras'},
  {id:'commercial', label:'🏪 Comercios'},
  {id:'factory', label:'🏭 Fábricas'},
  {id:'parks', label:'🌳 Parques'},
  {id:'vegetation', label:'🌲 Vegetación'},
  {id:'terrain', label:'🟩 Terreno'},
]
</script>

<template>
  <div class="min-h-screen bg-[#0a150a] text-white p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <header class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-black tracking-tight">JANDOCITY <span class="text-emerald-400">ASSET SHEET</span></h1>
          <p class="text-xs text-white/60 mt-1">2D top-down • semi-realista • fondo transparente • escala 1 celda ≈ 1 asset • 7 categorías • 40+ piezas</p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="px-2 py-1 rounded-full bg-white/10 border border-white/10">Vue + SVG nativo</span>
          <span class="px-2 py-1 rounded-full bg-emerald-900/40 border border-emerald-800 text-emerald-300">listo para exportar</span>
        </div>
      </header>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button v-for="t in tabs" :key="t.id" @click="tab=t.id"
          class="px-3 py-2 rounded-lg text-sm font-medium border transition"
          :class="tab===t.id ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'">
          {{ t.label }}
        </button>
      </div>

      <!-- Sheet -->
      <div class="bg-[#141f14] rounded-2xl border border-white/10 p-4 md:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="font-bold text-white/90">{{ tabs.find(t=>t.id===tab).label }}</h2>
          <span class="text-[11px] font-mono text-white/40">fondo transparente • SVG escalable • 100×100 viewBox</span>
        </div>

        <ResidentialSet v-if="tab==='residential'" />
        <RoadKit v-if="tab==='roads'" />
        <CommercialSet v-if="tab==='commercial'" />
        <FactorySet v-if="tab==='factory'" />
        <ParkSet v-if="tab==='parks'" />
        <VegetationSet v-if="tab==='vegetation'" />
        <TerrainSet v-if="tab==='terrain'" />

        <div class="mt-6 p-3 rounded-lg bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200/80 leading-relaxed">
          <strong class="text-amber-300">Reglas:</strong> TERRAIN / BUILDINGS / ROADS / DECORATION / WATER separados. Cada SVG viewBox 0 0 100–120, sin fondo, sombra incluida. Carreteras mismo ancho 40px, rotables 0/90/180/270. Escala: casa pequeña = 1 celda, bloque = 2 celdas, fábrica grande = 2 celdas.
        </div>
      </div>

      <!-- Grid preview como en tu ejemplo -->
      <div class="mt-6 grid grid-cols-3 md:grid-cols-6 gap-2 text-[10px] font-mono text-white/50">
        <div class="bg-white/5 rounded p-2 text-center border border-white/5">CASA 1 — 1 celda</div>
        <div class="bg-white/5 rounded p-2 text-center border border-white/5">CASA 2 — 2 celdas</div>
        <div class="bg-white/5 rounded p-2 text-center border border-white/5">COMERCIO</div>
        <div class="bg-white/5 rounded p-2 text-center border border-white/5">ROAD →</div>
        <div class="bg-white/5 rounded p-2 text-center border border-white/5">CURVA</div>
        <div class="bg-white/5 rounded p-2 text-center border border-white/5">CRUCE</div>
      </div>

      <p class="text-center text-xs text-white/30 mt-6">Todos los assets pertenecen al mismo universo Jandocity — coherencia visual • modularidad • reutilización • escalabilidad</p>
    </div>
  </div>
</template>
