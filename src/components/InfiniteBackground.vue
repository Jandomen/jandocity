<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { createNoise2D } from 'simplex-noise'

const props = defineProps({
  camera: { type: Object, required: true },
  seed: { type: Number, default: 13371337 }
})

const canvasRef = ref(null)
let raf = null

function seededRandom(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

let noiseH
function initNoises() {
  noiseH = createNoise2D(seededRandom(props.seed || 13371337))
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const w = rect.width * dpr
  const h = rect.height * dpr
  if (w===0||h===0) return
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#22c55e'
  ctx.fillRect(0,0,w,h)
}

function schedule() {
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(draw)
}

onMounted(() => { initNoises(); draw(); window.addEventListener('resize', schedule) })
watch(() => [props.camera.x.value, props.camera.y.value, props.camera.scale.value, props.seed], () => { initNoises(); schedule() })
onUnmounted(() => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', schedule) })
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full block m-0 p-0"></canvas>
</template>
