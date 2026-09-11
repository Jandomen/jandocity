<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { getWaterMask } from '@/utils/terrainGenerator.js'
import { createNoise2D } from 'simplex-noise'

const props = defineProps({
  grid: { type: Array, required: true },
  visibleRows: { type: Array, default: null },
  unified: { type: Boolean, default: false }
})

const width = computed(() => props.grid[0]?.length || 0)
const height = computed(() => props.grid.length)
const size = computed(() => props.grid.length)
const canvasRef = ref(null)
const rowsToRender = computed(() => props.visibleRows || props.grid)

const grassTones = ['#7ec850', '#8fd460', '#6bbf45', '#8bc85a']

function decorStyle(cell) {
  const seed = cell.decorSeed || 0
  const offsetX = (seed % 17) * 2 - 8
  const offsetY = ((seed * 3) % 13) * 2 - 6
  return { left: `calc(50% + ${offsetX}px)`, top: `calc(50% + ${offsetY}px)` }
}

function waterBorderClass(grid, x, y) {
  const mask = getWaterMask(grid, x, y)
  const isInterior = mask.n && mask.s && mask.e && mask.w
  if (isInterior) return 'rounded-none'
  let cls = ''
  if (!mask.n && !mask.w) cls += ' rounded-tl-[26px]'
  else if (!mask.n) cls += ' rounded-tl-[12px]'
  if (!mask.n && !mask.e) cls += ' rounded-tr-[28px]'
  else if (!mask.n) cls += ' rounded-tr-[10px]'
  if (!mask.s && !mask.w) cls += ' rounded-bl-[24px]'
  else if (!mask.s) cls += ' rounded-bl-[14px]'
  if (!mask.s && !mask.e) cls += ' rounded-br-[30px]'
  else if (!mask.s) cls += ' rounded-br-[12px]'
  if (!mask.e) cls += ' rounded-r-[20px]'
  if (!mask.w) cls += ' rounded-l-[18px]'
  return cls
}

// Textura procedural — optimizada para 150×150: para >10k celdas usa paso ligero
function drawTexture() {
  const canvas = canvasRef.value
  if (!canvas) return
  if (props.unified) {
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    return
  }
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const w = rect.width * dpr
  const h = rect.height * dpr
  if (w === 0 || h === 0) return
  // Para 150×150 (7200px) el canvas sería 10k+ con dpr, limitamos
  const MAX = 4096
  const cw = Math.min(w, MAX), ch = Math.min(h, MAX)
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, cw, ch)
  ctx.fillStyle = '#6bbf45'
  ctx.fillRect(0, 0, cw, ch)
  // Si es muy grande, textura simple sin noise pesado
  const cells = props.grid.length * (props.grid[0]?.length || 0)
  if (cells > 10000) {
    ctx.fillStyle = 'rgba(143,212,96,0.08)'
    for (let i = 0; i < 800; i++) {
      const x = (i * 137) % cw, y = (i * 241) % ch
      ctx.fillRect(x, y, 2, 2)
    }
    return
  }
  const seed = props.grid[0]?.[0]?.decorSeed || 1337
  let s = seed % 2147483647
  const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
  const noise = createNoise2D(rand)
  for (let y = 0; y < ch; y += 2) {
    for (let x = 0; x < cw; x += 2) {
      const n = noise(x * 0.008, y * 0.008)
      if (n > 0.3) {
        ctx.fillStyle = `rgba(143, 212, 96, ${0.18 + n * 0.12})`
        ctx.fillRect(x, y, 2, 2)
      } else if (n < -0.4) {
        ctx.fillStyle = `rgba(90, 140, 40, ${0.15 + Math.abs(n) * 0.1})`
        ctx.fillRect(x, y, 2, 2)
      }
    }
  }
  for (let y = 0; y < ch; y += 3) {
    for (let x = 0; x < cw; x += 3) {
      const n2 = noise(x * 0.04 + 100, y * 0.04 + 100)
      if (Math.abs(n2) > 0.6) {
        ctx.fillStyle = n2 > 0 ? 'rgba(210, 235, 160, 0.12)' : 'rgba(45, 90, 30, 0.10)'
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
}

let drawTimer = null
onMounted(() => {
  drawTexture()
  window.addEventListener('resize', () => { clearTimeout(drawTimer); drawTimer = setTimeout(drawTexture, 120) })
})

watch(() => props.grid.length + (props.grid[0]?.length||0), () => {
  clearTimeout(drawTimer); drawTimer = setTimeout(drawTexture, 120)
})
</script>

<template>
  <div class="absolute inset-0 overflow-hidden">
    <!-- Canvas textura real simplex-noise — forma orgánica, no flat -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <!-- Overlay radial para profundidad natural -->
    <div class="absolute inset-0" style="background: radial-gradient(ellipse at 30% 15%, rgba(168,224,99,0.35) 0%, transparent 45%), radial-gradient(ellipse at 70% 85%, rgba(212,184,150,0.22) 0%, transparent 40%), radial-gradient(ellipse at 20% 90%, rgba(194,168,120,0.18) 0%, transparent 35%);"></div>

    <!-- Grid virtualizado — solo celdas visibles -->
    <div class="absolute inset-0">
      <template v-for="row in rowsToRender" :key="row[0]?.y ?? row[0]?.id">
        <div v-for="cell in row" :key="cell.id" class="absolute w-[48px] h-[48px] overflow-visible"
             :style="{ left: (cell.x - (grid[0]?.[0]?.x ?? 0)) * 48 + 'px', top: (cell.y - (grid[0]?.[0]?.y ?? 0)) * 48 + 'px' }">
          <!-- Terreno — incluye cemento/azulejo/madera/mármol/piedra -->
          <div
            class="absolute inset-0"
            :class="[
              cell.terrain === 'grass' ? 'bg-transparent' : '',
              cell.terrain === 'dirt' ? 'bg-[#8a6d4a]' : '',
              cell.terrain === 'sand' ? 'bg-[#e8dcc0] shadow-[inset_0_0_6px_rgba(0,0,0,0.08)]' : '',
              cell.terrain === 'forest' ? 'bg-[#1e3a1f]' : '',
              cell.terrain === 'water' ? 'bg-[#3b82f6] shadow-[inset_0_1px_4px_rgba(255,255,255,0.25)]' : '',
              cell.terrain === 'deep_water' ? 'bg-[#1e40af] shadow-[inset_0_1px_6px_rgba(0,0,0,0.3)]' : '',
              cell.terrain === 'concrete' ? 'bg-[#9ca3af] shadow-[inset_0_0_4px_rgba(0,0,0,0.18)]' : '',
              cell.terrain === 'tile' ? 'bg-[#e7e5e4] shadow-[inset_0_0_4px_rgba(0,0,0,0.12)]' : '',
              cell.terrain === 'wood' ? 'bg-[#a16207] shadow-[inset_0_0_4px_rgba(0,0,0,0.2)]' : '',
              cell.terrain === 'marble' ? 'bg-[#f5f5f4] shadow-[inset_0_0_6px_rgba(0,0,0,0.08)]' : '',
              cell.terrain === 'stone' ? 'bg-[#78716c] shadow-[inset_0_0_4px_rgba(0,0,0,0.2)]' : ''
            ]"
          >
            <div v-if="cell.terrain === 'tile'" class="absolute inset-0 opacity-40" style="background-image: linear-gradient(#a8a29e 1px, transparent 1px), linear-gradient(90deg, #a8a29e 1px, transparent 1px); background-size: 12px 12px;"></div>
            <div v-if="cell.terrain === 'wood'" class="absolute inset-0 opacity-30" style="background-image: repeating-linear-gradient(90deg, #78350f 0 2px, transparent 2px 14px), repeating-linear-gradient(#92400e 1px, transparent 1px); background-size: 14px 6px;"></div>
            <div v-if="cell.terrain === 'marble'" class="absolute inset-0 opacity-25" style="background: radial-gradient(ellipse at 20% 30%, #a8a29e 1px, transparent 1px), radial-gradient(ellipse at 70% 60%, #d6d3d1 1px, transparent 1px); background-size: 18px 18px;"></div>
            <div v-if="cell.terrain === 'stone'" class="absolute inset-0 opacity-30" style="background-image: linear-gradient(#57534e 1px, transparent 1px), linear-gradient(90deg, #57534e 1px, transparent 1px); background-size: 10px 10px;"></div>
            <div v-if="cell.terrain === 'water' || cell.terrain === 'deep_water'" class="absolute inset-0 opacity-30" style="background: radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.35) 0%, transparent 45%);"></div>
          </div>

          <!-- Decoración — en modo unificado, casillas vacías jugables son pasto plano limpio sin basura -->
          <template v-if="!unified || cell.buildingId">
            <div v-if="cell.terrain !== 'water' && cell.hasTree" class="absolute w-7 h-7 pointer-events-none select-none" :style="decorStyle(cell)" style="transform: translate(-50%, -62%); filter: drop-shadow(0 4px 5px rgba(0,0,0,0.5));">
              <div class="w-[7px] h-[9px] bg-[#4a2f0f] mx-auto rounded-sm shadow-sm" style="background: linear-gradient(90deg, #3a240c, #5a3a1a);"></div>
              <div class="w-7 h-7 -mt-1 rounded-full" style="background: radial-gradient(circle at 28% 28%, #5faa32, #2d5a1a 65%, #1e3d0f 100%); box-shadow: inset 0 1px 2px rgba(255,255,255,0.25);"></div>
              <div class="w-5 h-5 mx-auto -mt-5 rounded-full opacity-55" style="background: radial-gradient(circle at 42% 32%, #8fd460, transparent 68%);"></div>
            </div>
            <div v-else-if="cell.terrain !== 'water' && cell.hasBush" class="absolute w-5 h-4 pointer-events-none" :style="decorStyle(cell)" style="transform: translate(-50%, -32%);">
              <div class="w-5 h-4 rounded-full" style="background: radial-gradient(ellipse at 32% 28%, #9ad66a, #3a7d2e 70%); box-shadow: 0 3px 7px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.3);"></div>
            </div>
            <div v-else-if="cell.hasRock" class="absolute w-3 h-2 pointer-events-none opacity-75" :style="decorStyle(cell)" style="transform: translate(-50%, -8%);">
              <div class="w-3 h-2 rounded-full shadow-sm" style="background: radial-gradient(ellipse at 30% 30%, #a99a8a, #6b5f52);"></div>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- Viñeta profundidad -->
    <div class="absolute inset-0 pointer-events-none shadow-[inset_0_0_90px_rgba(0,0,0,0.32),inset_0_0_20px_rgba(0,0,0,0.18)]"></div>
  </div>
</template>
