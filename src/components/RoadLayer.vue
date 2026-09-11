<script setup>
import { getRoadPiece } from '@/composables/useRoads.js'

const props = defineProps({
  grid: { type: Array, required: true },
  visibleRows: { type: Array, default: null }
})

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

function roadPieceAt(wx, wy) {
  const ox = props.grid[0]?.[0]?.x ?? 0
  const oy = props.grid[0]?.[0]?.y ?? 0
  const ax = wx - ox
  const ay = wy - oy
  const cell = props.grid[ay]?.[ax]
  if (cell?.roadVariant && manualMap[cell.roadVariant]) {
    return manualMap[cell.roadVariant]
  }
  return manualMap['straight-h']
}

function roadMaterial(cell) {
  if (cell.buildingId === 'dirt_road') return { bg: 'linear-gradient(180deg, #a16207 0%, #78350f 100%)', border: '#92400e', line: '#fef3c7', dash: 'rgba(255,255,255,0.0)' }
  if (cell.buildingId === 'concrete_road') return { bg: '#d6d3d1', border: '#a8a29e', line: '#44403c', dash: '4 4' }
  if (cell.buildingId === 'cobble_road') return { bg: '#57534e', border: '#44403c', line: '#e7e5e4', dash: '3 3' }
  return { bg: 'linear-gradient(180deg, #323744, #1e222b)', border: 'rgba(255,255,255,0.5)', line: '#fde68a', dash: '7 7' }
}
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <template v-for="row in (visibleRows || grid)" :key="row[0]?.y ?? row[0]?.id">
      <template v-for="cell in row" :key="cell.id">
        <div
          v-if="['road','dirt_road','concrete_road','cobble_road'].includes(cell.buildingId) || cell.hasRoad"
          class="absolute w-[48px] h-[48px] flex items-center justify-center"
          :style="{ left: (cell.x - (grid[0]?.[0]?.x ?? 0)) * 48 + 'px', top: (cell.y - (grid[0]?.[0]?.y ?? 0)) * 48 + 'px' }"
        >
          <!-- Puente sobre agua — cualquier pieza hace puente automático (water + deep_water + lake/deep_lake) -->
          <div v-if="cell.terrain === 'water' || cell.terrain === 'deep_water' || cell.terrainType === 'water' || cell.terrainType === 'deep_water'" class="absolute inset-0 flex items-center justify-center" :style="{ transform: `rotate(${roadPieceAt(cell.x, cell.y)?.rot || 0}deg)` }">
            <!-- Base madera puente + forma según pieza elegida -->
            <div v-if="roadPieceAt(cell.x, cell.y)?.id === 'straight'" class="absolute w-full h-[68%] rounded-[4px] flex items-center justify-center" style="background: linear-gradient(180deg, #8b7355 0%, #6b5438 100%); border: 2px solid #4a3721; box-shadow: 0 2px 4px rgba(0,0,0,0.35);">
              <div class="w-[70%] h-[3px] rounded-full" style="background: repeating-linear-gradient(90deg, #fde68a 0 7px, transparent 7px 12px);"></div>
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px]">🌉</div>
            </div>
            <svg v-else-if="roadPieceAt(cell.x, cell.y)?.id === 'curve'" viewBox="0 0 48 48" class="absolute w-full h-full">
              <path d="M0 18 H14 A14 14 0 0 0 30 2 V0 H0 V30 Z" fill="#8b7355" stroke="#4a3721" stroke-width="1.2"/>
              <path d="M0 18 H14 A14 14 0 0 0 30 2" fill="none" stroke="#4a3721" stroke-width="1" />
              <path d="M4 24 A18 18 0 0 0 24 4" fill="none" stroke="#fde68a" stroke-width="1.6" stroke-dasharray="5 4" />
              <text x="24" y="26" text-anchor="middle" font-size="7">🌉</text>
            </svg>
            <div v-else-if="roadPieceAt(cell.x, cell.y)?.id === 't'" class="absolute w-full h-full">
              <div class="absolute w-full h-[68%] top-1/2 -translate-y-1/2 rounded-[3px]" style="background: linear-gradient(180deg, #8b7355 0%, #6b5438 100%); border: 1.5px solid #4a3721;"></div>
              <div class="absolute w-[62%] h-full left-1/2 -translate-x-1/2 rounded-[3px]" style="background: linear-gradient(180deg, #8b7355 0%, #6b5438 100%); border: 1.5px solid #4a3721;"></div>
              <div class="absolute w-[70%] h-[2px] top-1/2 -translate-y-1/2 left-[15%]" style="background: #fde68a;"></div><div class="absolute h-[35%] w-[2px] left-1/2 -translate-x-1/2 top-1/2" style="background: #fde68a;"></div>
              <div class="absolute left-1/2 -translate-x-1/2 top-1/2 text-[7px]">🌉</div>
            </div>
            <div v-else-if="roadPieceAt(cell.x, cell.y)?.id === 'cross'" class="absolute w-full h-full">
              <div class="absolute w-full h-[68%] top-1/2 -translate-y-1/2" style="background: linear-gradient(180deg, #8b7355 0%, #6b5438 100%); border: 1.5px solid #4a3721;"></div>
              <div class="absolute h-full w-[62%] left-1/2 -translate-x-1/2" style="background: linear-gradient(180deg, #8b7355 0%, #6b5438 100%); border: 1.5px solid #4a3721;"></div>
              <div class="absolute w-full h-[2px] top-1/2 -translate-y-1/2" style="background: #fde68a;"></div><div class="absolute h-full w-[2px] left-1/2 -translate-x-1/2" style="background: #fde68a;"></div>
            </div>
            <div v-else class="absolute w-full h-[68%] rounded-[4px] flex items-center justify-center" style="background: linear-gradient(180deg, #8b7355 0%, #6b5438 100%); border: 2px solid #4a3721;">
              <div class="w-[70%] h-[3px] rounded-full" style="background: repeating-linear-gradient(90deg, #fde68a 0 7px, transparent 7px 12px);"></div>
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px]">🌉</div>
            </div>
          </div>

          <!-- Carretera en tierra — material según tipo (asfalto/terracería/concreto) -->
          <div v-else class="absolute inset-0 flex items-center justify-center" :style="{ transform: `rotate(${roadPieceAt(cell.x, cell.y)?.rot || 0}deg)` }">
            <!-- Recta — color según material (asfalto/terracería/concreto/empedrado) -->
            <div v-if="roadPieceAt(cell.x, cell.y)?.id === 'straight'" class="absolute w-full h-[62%] rounded-[3px] flex items-center justify-center"
              :style="cell.buildingId==='dirt_road' ? 'background:#a16207; border-top:1px solid #78350f; border-bottom:1px solid #78350f' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4; border-top:1px solid #a8a29e; border-bottom:1px solid #a8a29e' : cell.buildingId==='cobble_road' ? 'background:#57534e; background-image: radial-gradient(circle, #a8a29e 1.5px, transparent 1.5px); background-size: 6px 6px; border-top:1px solid #44403c; border-bottom:1px solid #44403c' : 'background: linear-gradient(180deg, #323744, #1e222b); border-top:1px solid rgba(255,255,255,0.5); border-bottom:1px solid rgba(255,255,255,0.5)'">
              <div class="w-[72%] h-[2px] rounded-full"
                :style="cell.buildingId==='dirt_road' ? 'background:#78350f; opacity:0.6' : cell.buildingId==='concrete_road' ? 'background: repeating-linear-gradient(90deg, #44403c 0 7px, transparent 7px 12px)' : cell.buildingId==='cobble_road' ? 'background: repeating-linear-gradient(90deg, #e7e5e4 0 2px, transparent 2px 6px); opacity:0.9' : 'background: repeating-linear-gradient(90deg, #fde68a 0 7px, transparent 7px 12px)'"></div>
            </div>
            <!-- Curva 90° — color según material -->
            <svg v-else-if="roadPieceAt(cell.x, cell.y)?.id === 'curve'" viewBox="0 0 48 48" class="absolute w-full h-full">
              <path :fill="cell.buildingId==='dirt_road' ? '#a16207' : cell.buildingId==='concrete_road' ? '#e7e5e4' : cell.buildingId==='cobble_road' ? '#57534e' : '#323744'" :stroke="cell.buildingId==='dirt_road' ? '#78350f' : cell.buildingId==='concrete_road' ? '#a8a29e' : cell.buildingId==='cobble_road' ? '#44403c' : 'rgba(255,255,255,0.5)'" stroke-width="0.8" d="M0 30 H14 A14 14 0 0 0 30 14 V0 H0 V30 Z" />
              <path :stroke="cell.buildingId==='dirt_road' ? '#92400e' : cell.buildingId==='concrete_road' ? '#44403c' : cell.buildingId==='cobble_road' ? '#e7e5e4' : '#fde68a'" fill="none" stroke-width="1.6" stroke-dasharray="5 4" d="M4 24 A18 18 0 0 0 24 4" />
            </svg>
            <!-- Diagonal -->
            <div v-else-if="roadPieceAt(cell.x, cell.y)?.id === 'diagonal'" class="absolute w-[88%] h-[44%] rounded-[3px] flex items-center justify-center"
              :style="cell.buildingId==='dirt_road' ? 'background:#a16207; border:1px solid #78350f' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4; border:1px solid #a8a29e' : cell.buildingId==='cobble_road' ? 'background:#57534e; background-image:radial-gradient(circle,#a8a29e 1.5px,transparent 1.5px); background-size:6px 6px; border:1px solid #44403c' : 'background:#323744; border:1px solid rgba(255,255,255,0.5)'" style="transform: rotate(45deg);">
              <div class="w-[70%] h-[2px]" :style="cell.buildingId==='concrete_road' ? 'background:#44403c' : cell.buildingId==='cobble_road' ? 'background:#e7e5e4' : 'background:#fde68a'"></div>
            </div>
            <!-- T -->
            <div v-else-if="roadPieceAt(cell.x, cell.y)?.id === 't'" class="absolute w-full h-full">
              <div class="absolute w-full h-[62%] top-1/2 -translate-y-1/2 rounded-[3px]"
                :style="cell.buildingId==='dirt_road' ? 'background:#a16207; border:1px solid #78350f' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4; border:1px solid #a8a29e' : cell.buildingId==='cobble_road' ? 'background:#57534e; border:1px solid #44403c' : 'background:#323744; border:1px solid rgba(255,255,255,0.5)'"></div>
              <div class="absolute w-[62%] h-full left-1/2 -translate-x-1/2 rounded-[3px]"
                :style="cell.buildingId==='dirt_road' ? 'background:#a16207; border:1px solid #78350f' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4; border:1px solid #a8a29e' : cell.buildingId==='cobble_road' ? 'background:#57534e; border:1px solid #44403c' : 'background:#323744; border:1px solid rgba(255,255,255,0.5)'"></div>
              <div class="absolute w-[70%] h-[2px] top-1/2 -translate-y-1/2 left-[15%]" :style="cell.buildingId==='concrete_road' ? 'background:#44403c' : cell.buildingId==='cobble_road' ? 'background:#e7e5e4' : 'background:#fde68a'"></div>
              <div class="absolute h-[35%] w-[2px] left-1/2 -translate-x-1/2 top-1/2" :style="cell.buildingId==='concrete_road' ? 'background:#44403c' : cell.buildingId==='cobble_road' ? 'background:#e7e5e4' : 'background:#fde68a'"></div>
            </div>
            <!-- Cruz -->
            <div v-else-if="roadPieceAt(cell.x, cell.y)?.id === 'cross'" class="absolute w-full h-full">
              <div class="absolute w-full h-[62%] top-1/2 -translate-y-1/2" :style="cell.buildingId==='dirt_road' ? 'background:#a16207' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4' : cell.buildingId==='cobble_road' ? 'background:#57534e' : 'background:#323744'"></div>
              <div class="absolute h-full w-[62%] left-1/2 -translate-x-1/2" :style="cell.buildingId==='dirt_road' ? 'background:#a16207' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4' : cell.buildingId==='cobble_road' ? 'background:#57534e' : 'background:#323744'"></div>
              <div class="absolute w-full h-[2px] top-1/2 -translate-y-1/2" :style="cell.buildingId==='concrete_road' ? 'background:#44403c' : cell.buildingId==='cobble_road' ? 'background:#e7e5e4' : 'background:#fde68a'"></div>
              <div class="absolute h-full w-[2px] left-1/2 -translate-x-1/2" :style="cell.buildingId==='concrete_road' ? 'background:#44403c' : cell.buildingId==='cobble_road' ? 'background:#e7e5e4' : 'background:#fde68a'"></div>
            </div>
            <!-- Glorieta -->
            <div v-else-if="roadPieceAt(cell.x, cell.y)?.id === 'roundabout'" class="absolute w-[92%] h-[92%] rounded-full flex items-center justify-center" :style="cell.buildingId==='dirt_road' ? 'background:#a16207; border:2px solid #78350f' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4; border:2px solid #a8a29e' : cell.buildingId==='cobble_road' ? 'background:#57534e; border:2px solid #44403c' : 'background:#323744; border:2px solid #1e222b'">
              <div class="w-[62%] h-[62%] rounded-full" style="background: #1a221a; border: 1px dashed #fde68a;"></div>
            </div>
            <!-- Final -->
            <div v-else-if="roadPieceAt(cell.x, cell.y)?.id === 'end'" class="absolute w-full h-[62%] rounded-r-[6px]"
              :style="cell.buildingId==='dirt_road' ? 'background:#a16207; border:1px solid #78350f' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4; border:1px solid #a8a29e' : cell.buildingId==='cobble_road' ? 'background:#57534e; border:1px solid #44403c' : 'background:#323744; border:1px solid rgba(255,255,255,0.5)'">
              <div class="absolute w-[65%] h-[2px] top-1/2 -translate-y-1/2 left-[15%]" :style="cell.buildingId==='concrete_road' ? 'background:#44403c' : cell.buildingId==='cobble_road' ? 'background:#e7e5e4' : 'background:#fde68a'"></div>
            </div>
            <!-- Crosswalk / por defecto recta -->
            <div v-else class="absolute w-full h-[62%] rounded-[3px] flex items-center justify-center"
              :style="cell.buildingId==='dirt_road' ? 'background:#a16207' : cell.buildingId==='concrete_road' ? 'background:#e7e5e4' : cell.buildingId==='cobble_road' ? 'background:#57534e' : 'background:#323744'">
              <div class="w-[72%] h-[2px] rounded-full" :style="cell.buildingId==='concrete_road' ? 'background:#44403c' : cell.buildingId==='cobble_road' ? 'background:#e7e5e4' : 'background:#fde68a'"></div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
