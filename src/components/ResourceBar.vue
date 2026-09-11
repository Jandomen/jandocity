<script setup>
import { useCityStore } from '@/stores/cityStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'

const city = useCityStore()
const player = usePlayerStore()
</script>

<template>
  <header class="bg-slate-900/85 backdrop-blur-md text-white py-1 px-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-b border-white/10 flex flex-nowrap items-center justify-between gap-1 select-none text-xs leading-none overflow-hidden whitespace-nowrap">
    <!-- Logotipo y Nombre -->
    <div class="flex items-center gap-2 shrink-0">
      <img src="/favicon.png" alt="Jandocity" class="w-7 h-7 rounded-md shadow-sm border border-white/10" />
      <h1 class="font-black tracking-[0.18em] text-[15px] leading-none" style="font-family:'Cinzel','Righteous',serif; background: linear-gradient(180deg,#fde68a 0%,#f59e0b 55%,#92400e 100%); -webkit-background-clip:text; background-clip:text; color:transparent; filter: drop-shadow(0 1px 0 rgba(0,0,0,0.8)) drop-shadow(0 2px 6px rgba(245,158,11,0.35));">JANDOCITY</h1>
    </div>

    <!-- Recursos e Indicadores — scroll horizontal en móvil para mantener 1 línea -->
    <div class="flex items-center gap-2 md:gap-3 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 overflow-x-auto scrollbar-thin whitespace-nowrap shrink min-w-0 flex-1 justify-center mx-2">
      <!-- Fondos -->
      <div class="flex items-center gap-1" title="Dinero disponible">
        <span class="text-sm">💰</span>
        <span class="font-mono font-bold text-emerald-400 text-xs">${{ city.resources.money }}</span>
        <span class="text-[10px] text-slate-400 font-mono">
          ({{ city.stats.incomePerTick >= 0 ? '+' : '' }}{{ city.stats.incomePerTick }}/t)
        </span>
      </div>

      <!-- Población -->
      <div class="flex items-center gap-1" title="Población total">
        <span class="text-sm">👥</span>
        <span class="font-mono font-bold text-slate-200 text-xs">{{ city.resources.population }}</span>
      </div>

      <!-- Energía -->
      <div 
        class="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
        :class="city.stats.hasEnergyDeficit ? 'bg-red-950/80 text-red-400 animate-pulse border border-red-800' : 'text-slate-200'"
        title="Energía (Producida / Consumida)"
      >
        <span class="text-xs">⚡</span>
        <span class="font-mono font-bold">{{ city.resources.energy.produced - city.resources.energy.consumed }}</span>
        <span class="text-[10px] opacity-75">({{ city.resources.energy.produced }}/{{ city.resources.energy.consumed }})</span>
      </div>

      <!-- Agua -->
      <div 
        class="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
        :class="city.stats.hasWaterDeficit ? 'bg-red-950/80 text-red-400 animate-pulse border border-red-800' : 'text-slate-200'"
        title="Agua (Producida / Consumida)"
      >
        <span class="text-xs">💧</span>
        <span class="font-mono font-bold">{{ city.resources.water.produced - city.resources.water.consumed }}</span>
        <span class="text-[10px] opacity-75">({{ city.resources.water.produced }}/{{ city.resources.water.consumed }})</span>
      </div>

      <!-- Oxígeno -->
      <div 
        class="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
        :class="city.stats.hasOxygenDeficit ? 'bg-red-950/80 text-red-400 animate-pulse border border-red-800' : city.resources.oxygen.net > 10 ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-800' : 'text-slate-200'"
        title="Oxígeno — árboles producen, población/industria consume"
      >
        <span class="text-xs">🍃</span>
        <span class="font-mono font-bold">{{ city.resources.oxygen.produced - city.resources.oxygen.consumed }}</span>
        <span class="text-[10px] opacity-75">({{ city.resources.oxygen.produced }}/{{ city.resources.oxygen.consumed }})</span>
      </div>

      <!-- Impuestos / Subsidios -->
      <div class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs" title="Impuestos vs Subsidios">
        <span class="text-[10px]">🧾</span>
        <span class="font-mono font-bold text-emerald-400">+{{ city.stats.taxIncome }}</span>
        <span class="text-slate-500">/</span>
        <span class="font-mono font-bold text-red-400">-{{ city.stats.subsidyCost }}</span>
        <span class="text-[10px] text-slate-500">= {{ city.stats.netTax >=0 ? '+' : '' }}{{ city.stats.netTax }}/t</span>
      </div>

      <!-- Coordenadas protagonista -->
      <div class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs" title="Posición del protagonista (WASD)">
        <span class="text-[10px]">📍</span>
        <span class="font-mono font-bold text-sky-300">x:{{ player.x }} y:{{ player.y }}</span>
        <span class="text-[10px] text-slate-500">({{ player.dir }})</span>
      </div>
    </div>

    <!-- Controles de Tiempo y Persistencia — no wrap -->
    <div class="flex items-center gap-1.5 shrink-0">
      <div class="text-[10px] text-slate-400 font-mono mr-1">Tick: #{{ city.tickCount }}</div>
      <button 
        @click="city.isPaused ? city.resume() : city.pause()"
        class="px-2 py-1 rounded text-xs font-semibold transition-colors"
        :class="city.isPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'"
      >
        {{ city.isPaused ? '▶' : '⏸' }}
      </button>
      <div class="h-4 w-px bg-slate-700 mx-1"></div>
      <button 
        @click="city.saveCity()"
        class="px-2 py-1 rounded text-xs font-medium bg-sky-700 hover:bg-sky-600 text-white transition-colors"
        title="Guardar partida (localStorage)"
      >
        💾
      </button>
      <button 
        @click="city.loadCity()"
        class="px-2 py-1 rounded text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        title="Cargar partida guardada"
      >
        📂
      </button>
      <button 
        @click="city.resetCity()"
        class="px-2 py-1 rounded text-xs font-medium bg-red-800/80 hover:bg-red-700 text-white transition-colors"
        title="Reiniciar ciudad y borrar progreso"
      >
        🔄
      </button>
    </div>
  </header>
</template>
