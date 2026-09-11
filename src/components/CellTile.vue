<script setup>
import { computed } from 'vue'
import { BUILDINGS } from '@/constants/buildings.js'
import BuildingSprites from './BuildingSprites.vue'

const props = defineProps({
  cell: { type: Object, required: true },
  selectedTool: { type: String, default: null },
  validation: { type: Object, default: () => ({ ok: false, reason: null }) },
  showGrid: { type: Boolean, default: false }
})

const emit = defineEmits(['clickCell', 'mouseenter'])

const isWater = computed(() => props.cell.terrain === 'water' || props.cell.terrain === 'deep_water' || props.cell.terrainType === 'water' || props.cell.terrainType === 'deep_water')
const isForest = computed(() => props.cell.terrain === 'forest' || props.cell.terrainType === 'forest')

const isValidBuild = computed(() => props.validation?.ok === true)
const isInvalidBuild = computed(() => props.selectedTool && props.validation?.ok === false)

const terrainIcons = { lake: '🌊', deep_lake: '🌊', sand_brush: '🏖️', forest_brush: '🌲', grass_brush: '🌱' }
const previewIcon = computed(() => BUILDINGS[props.selectedTool]?.icon || terrainIcons[props.selectedTool] || '▣')
const showPreview = computed(() => {
  return props.selectedTool && !props.cell.buildingId && props.selectedTool !== 'demolish' && props.validation?.ok !== false
})
</script>

<template>
  <button
    @click="emit('clickCell', { x: cell.x, y: cell.y })"
    @mouseenter="emit('mouseenter', { x: cell.x, y: cell.y })"
    class="relative w-[48px] h-[48px] aspect-square flex items-center justify-center select-none group outline-none overflow-hidden shrink-0"
    :class="[
      isWater ? 'cursor-not-allowed' : 'cursor-pointer',
      isForest && !isValidBuild ? 'cursor-not-allowed' : ''
    ]"
    :title="validation.reason || (cell.buildingId ? BUILDINGS[cell.buildingId]?.label : `${cell.terrain} (${cell.x},${cell.y})`)"
    :style="{ aspectRatio: '1 / 1' }"
  >
    <!-- Fondo plano — agua sin 3D, solo color plano -->
    <div
      class="absolute inset-0 transition-all duration-150"
      :class="[
        !cell.buildingId && (cell.terrain === 'grass' || cell.terrainType === 'grass') ? 'bg-transparent border border-black/5' : '',
        !cell.buildingId && isWater ? 'bg-[#0284c7] border-0' : '',
        !cell.buildingId && (cell.terrain === 'sand' || cell.terrainType === 'sand') ? 'bg-[#e8dcc0]/70 border border-black/5' : '',
        !cell.buildingId && (cell.terrain === 'forest' || cell.terrainType === 'forest') ? 'bg-transparent border border-black/5' : '',
        cell.buildingId ? 'bg-transparent border border-transparent' : '',
        isValidBuild ? '!bg-emerald-400/08 !border-emerald-300/20' : '',
        isInvalidBuild ? '!bg-red-500/08 !border-red-400/25' : '',
        showGrid ? '!border-black/[0.06]' : ''
      ]"
    ></div>

    <!-- Naturaleza — sobre pasto continuo, sin pantallas oscuras -->
    <div v-if="!cell.buildingId && (cell.terrainType === 'tree' || cell.terrain === 'tree')" class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <BuildingSprites type="tree" />
    </div>
    <div v-else-if="!cell.buildingId && (cell.terrainType === 'rock' || cell.terrain === 'rock')" class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="w-6 h-4 rounded-full" style="background: radial-gradient(ellipse at 30% 30%, #a8a29e, #57534e);"></div>
    </div>

    <!-- Preview ultra transparente -->
    <span
      v-if="showPreview && isValidBuild"
      class="relative z-10 text-[20px] opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none"
    >
      {{ previewIcon }}
    </span>
    <span
      v-else-if="selectedTool && !cell.buildingId && selectedTool !== 'demolish' && isInvalidBuild"
      class="relative z-10 text-[16px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
    >
      🚫
    </span>

    <span
      v-if="selectedTool === 'demolish' && cell.buildingId"
      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-600/15 rounded-sm text-red-100 font-bold text-xs transition-opacity"
    >
      ✕
    </span>

    <span
      v-if="isInvalidBuild && validation.reason"
      class="absolute z-30 hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-[11px] font-medium leading-tight bg-[#1a221a] text-amber-200 border border-[#3a4a3a] rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.4)] whitespace-nowrap pointer-events-none"
    >
      <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a221a] border-r border-b border-[#3a4a3a] rotate-45"></span>
      ⚠️ {{ validation.reason }}
    </span>

    <span
      v-if="!cell.buildingId && isValidBuild"
      class="absolute w-1 h-1 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
    ></span>
  </button>
</template>
