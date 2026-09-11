<script setup>
const props = defineProps({ grid: { type: Array, required: true }, visibleRows: { type: Array, default: null } })

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

function railPieceAt(wx, wy) {
  const ox = props.grid[0]?.[0]?.x ?? 0
  const oy = props.grid[0]?.[0]?.y ?? 0
  const ax = wx - ox, ay = wy - oy
  const cell = props.grid[ay]?.[ax]
  if (cell?.railVariant && manualMap[cell.railVariant]) return manualMap[cell.railVariant]
  if (cell?.roadVariant && manualMap[cell.roadVariant]) return manualMap[cell.roadVariant]
  return manualMap['straight-h']
}
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <template v-for="row in (visibleRows || grid)" :key="row[0]?.y ?? row[0]?.id">
      <template v-for="cell in row" :key="cell.id">
        <div
          v-if="cell.buildingId === 'rail' || cell.hasRail"
          class="absolute w-[48px] h-[48px] flex items-center justify-center"
          :style="{ left: (cell.x - (grid[0]?.[0]?.x ?? 0)) * 48 + 'px', top: (cell.y - (grid[0]?.[0]?.y ?? 0)) * 48 + 'px' }"
        >
          <div class="absolute inset-0 flex items-center justify-center" :style="{ transform: `rotate(${railPieceAt(cell.x, cell.y)?.rot || 0}deg)` }">
            <!-- recta -->
            <div v-if="railPieceAt(cell.x, cell.y)?.id === 'straight'" class="absolute w-full h-[36%] flex flex-col justify-between py-[5px]">
              <div class="w-full h-[3px] bg-[#44403c] rounded-full"></div>
              <div class="w-full h-[3px] bg-[#44403c] rounded-full"></div>
              <div class="absolute inset-0 flex justify-between px-1">
                <div class="w-[2px] h-full bg-[#a8a29e] opacity-60" v-for="i in 6" :key="i" :style="{ marginLeft: i===1? '2px':'0' }"></div>
              </div>
            </div>
            <!-- curva -->
            <svg v-else-if="railPieceAt(cell.x, cell.y)?.id === 'curve'" viewBox="0 0 48 48" class="absolute w-full h-full">
              <path d="M0 18 H14 A14 14 0 0 0 30 2 V0 H0 V30 Z" fill="none" stroke="#44403c" stroke-width="3" />
              <path d="M0 21 H12 A12 12 0 0 0 32 2" fill="none" stroke="#a8a29e" stroke-width="1.5" />
              <path d="M0 15 H14 A14 14 0 0 0 30 0" fill="none" stroke="#57534e" stroke-width="0.7" opacity="0.5" />
            </svg>
            <!-- T / cruz -->
            <div v-else-if="['t','cross'].includes(railPieceAt(cell.x, cell.y)?.id)" class="absolute w-full h-full">
              <div class="absolute w-full h-[10px] top-1/2 -translate-y-1/2 bg-[#44403c] rounded-full"></div>
              <div class="absolute h-full w-[10px] left-1/2 -translate-x-1/2 bg-[#44403c] rounded-full" :style="{ opacity: railPieceAt(cell.x, cell.y)?.id==='t' && railPieceAt(cell.x, cell.y)?.rot===0 ? '0' : '1' }"></div>
            </div>
            <!-- por defecto recta -->
            <div v-else class="absolute w-full h-[36%] flex flex-col justify-between py-[5px]">
              <div class="w-full h-[3px] bg-[#44403c] rounded-full"></div>
              <div class="w-full h-[3px] bg-[#44403c] rounded-full"></div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
