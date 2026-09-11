<script setup>
const props = defineProps({ grid: { type: Array, required: true }, visibleRows: { type: Array, default: null } })

const WALL_IDS = ['fence','wall','hedge','brick_wall','metal_fence','gate']

const manualMap = {
  'straight-h': { id: 'straight', rot: 0 },
  'straight-v': { id: 'straight', rot: 90 },
  'diagonal': { id: 'diagonal', rot: 45 },
  'diagonal2': { id: 'diagonal', rot: 135 },
  'curve-nw': { id: 'curve', rot: 180 },
  'curve-ne': { id: 'curve', rot: 270 },
  'curve-sw': { id: 'curve', rot: 90 },
  'curve-se': { id: 'curve', rot: 0 },
  't-n': { id: 't', rot: 0 },
  't-s': { id: 't', rot: 180 },
  't-e': { id: 't', rot: 90 },
  't-w': { id: 't', rot: 270 },
  'cross': { id: 'cross', rot: 0 },
  'end-n': { id: 'end', rot: 270 },
  'end-s': { id: 'end', rot: 90 },
  'end-e': { id: 'end', rot: 0 },
  'end-w': { id: 'end', rot: 180 },
  'double-h': { id: 'double', rot: 0 },
  'double-v': { id: 'double', rot: 90 },
  'roundabout': { id: 'roundabout', rot: 0 },
  's-curve': { id: 's-curve', rot: 0 },
}

function wallPieceAt(wx, wy) {
  const ox = props.grid[0]?.[0]?.x ?? 0
  const oy = props.grid[0]?.[0]?.y ?? 0
  const ax = wx - ox, ay = wy - oy
  const cell = props.grid[ay]?.[ax]
  if (cell?.wallVariant && manualMap[cell.wallVariant]) return manualMap[cell.wallVariant]
  return manualMap['straight-h']
}

function wallStyle(id) {
  if (id === 'fence') return { bg: '#92400e', border: '#78350f' }
  if (id === 'hedge') return { bg: '#16a34a', border: '#14532d' }
  if (id === 'brick_wall') return { bg: '#b91c1c', border: '#7f1d1d' }
  if (id === 'metal_fence') return { bg: '#71717a', border: '#52525b' }
  if (id === 'gate') return { bg: '#3f3f46', border: '#27272a' }
  return { bg: '#a8a29e', border: '#57534e' } // wall
}
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <template v-for="row in (visibleRows || grid)" :key="row[0]?.y ?? row[0]?.id">
      <template v-for="cell in row" :key="cell.id">
        <div
          v-if="WALL_IDS.includes(cell.buildingId)"
          class="absolute w-[48px] h-[48px] flex items-center justify-center"
          :style="{ left: (cell.x - (grid[0]?.[0]?.x ?? 0)) * 48 + 'px', top: (cell.y - (grid[0]?.[0]?.y ?? 0)) * 48 + 'px' }"
        >
          <div class="absolute inset-0 flex items-center justify-center" :style="{ transform: `rotate(${wallPieceAt(cell.x, cell.y)?.rot || 0}deg)` }">
            <!-- recta -->
            <div v-if="wallPieceAt(cell.x, cell.y)?.id === 'straight'" class="absolute w-full h-[14px] rounded-[2px] flex items-center justify-center" :style="{ background: wallStyle(cell.buildingId).bg, border: '2px solid ' + wallStyle(cell.buildingId).border }">
              <div v-if="cell.buildingId==='hedge'" class="w-[70%] h-[4px] bg-[#22c55e] rounded-full opacity-60"></div>
              <div v-else-if="cell.buildingId==='fence'" class="w-full h-[2px] bg-[#78350f]"></div>
            </div>
            <!-- curva -->
            <svg v-else-if="wallPieceAt(cell.x, cell.y)?.id === 'curve'" viewBox="0 0 48 48" class="absolute w-full h-full">
              <path d="M0 18 H14 A14 14 0 0 0 30 2 V0 H0 V30 Z" :fill="wallStyle(cell.buildingId).bg" :stroke="wallStyle(cell.buildingId).border" stroke-width="2"/>
            </svg>
            <!-- T / cruz / resto usa recta -->
            <div v-else class="absolute w-full h-[14px] rounded-[2px]" :style="{ background: wallStyle(cell.buildingId).bg, border: '2px solid ' + wallStyle(cell.buildingId).border }"></div>
          </div>
          <!-- identificador esquina -->
          <div v-if="wallPieceAt(cell.x, cell.y)?.id === 'curve'" class="absolute w-[6px] h-[6px] bg-white/80 rounded-full border border-black/20" style="top: 14px; left: 14px;"></div>
        </div>
      </template>
    </template>
  </div>
</template>
