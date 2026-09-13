/**
 * src/audio/musicManager.js — 8-bit chiptune saneado: anti-desincronización
 * Fix: stop único, generación anti-race, fades cancelados, scheduler estable.
 */

let audioCtx = null
let gainNode = null
let filterNode = null
let currentOscs = []
let isMuted = false
let intervalId = null
let bassOsc = null
let generation = 0

const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '')
const isLowEnd = typeof navigator !== 'undefined' && (isAndroid ? ((navigator.deviceMemory || 4) <= 4 || (navigator.hardwareConcurrency || 4) <= 4) : ((navigator.deviceMemory || 4) <= 2 || (navigator.hardwareConcurrency || 4) <= 2)) || !!navigator.connection?.saveData
const isAndroidLow = isAndroid && isLowEnd

let workletNode = null
let workletReady = false
async function ensureWorklet(ctx) {
  if (workletReady || !isAndroidLow) return
  try {
    const url = new URL('./music-worklet.js', import.meta.url)
    await ctx.audioWorklet.addModule(url)
    workletReady = true
  } catch {}
}
function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    gainNode = audioCtx.createGain()
    gainNode.gain.value = isMuted ? 0 : 0.34
    if (!isAndroidLow) {
      filterNode = audioCtx.createBiquadFilter()
      filterNode.type = 'lowpass'
      filterNode.frequency.value = 2800
      gainNode.connect(filterNode)
      filterNode.connect(audioCtx.destination)
    } else {
      gainNode.connect(audioCtx.destination)
    }
  }
  return audioCtx
}

// 55 pistas
const TRACKS = {
  amanecer: { base: 220, mood: 'Esperanza', color: '#fde68a', label: 'Amanecer 8-bit', key: 'A mayor', bpm: 108, prog: 'I-V-vi-IV', melody: [0,4,7,12, 7,4,2,4, 0,4,7,12, 14,12,7,4], bass: [0,0,5,5, 0,0,9,9] },
  melancolia: { base: 165, mood: 'Melancolía', color: '#94a3b8', label: 'Melancolía 8-bit', key: 'E menor', bpm: 72, prog: 'i-VI-III-VII', melody: [0,3,7,10, 7,3,2,3, 0,3,7,10, 12,10,7,3], bass: [0,0,3,3, 8,8,7,7] },
  felicidad: { base: 330, mood: 'Felicidad', color: '#facc15', label: 'Felicidad 8-bit', key: 'E mayor', bpm: 132, prog: 'I-IV-V-I', melody: [0,4,7,12, 12,9,7,4, 0,2,4,7, 9,7,4,2], bass: [0,0,5,5, 7,7,0,0] },
  tristeza: { base: 140, mood: 'Tristeza', color: '#64748b', label: 'Tristeza 8-bit', key: 'F menor', bpm: 64, prog: 'i-iv-VI-III', melody: [0,3,6,10, 8,6,3,2, 0,3,6,10, 12,10,6,3], bass: [0,0,5,5, 3,3,8,8] },
  nostalgia: { base: 196, mood: 'Nostalgia', color: '#a78bfa', label: 'Nostalgia 8-bit', key: 'G menor', bpm: 84, prog: 'i-VII-VI-V', melody: [0,3,7,12, 10,7,5,3, 0,2,3,7, 7,5,3,0], bass: [0,0,10,10, 8,8,5,5] },
  calma: { base: 247, mood: 'Calma', color: '#86efac', label: 'Calma 8-bit', key: 'B menor', bpm: 92, prog: 'I-vi-IV-V', melody: [0,4,7,12, 11,7,4,2, 0,4,7,9, 7,4,2,0], bass: [0,0,9,9, 5,5,7,7] },
  noche: { base: 110, mood: 'Noche', color: '#1e293b', label: 'Noche 8-bit', key: 'A menor', bpm: 68, prog: 'i-VI-III-VII', melody: [0,5,7,12, 10,7,5,3, 0,5,7,10, 12,10,7,5], bass: [0,0,3,3, 8,8,10,10] },
  tension: { base: 185, mood: 'Tensión', color: '#f87171', label: 'Tensión 8-bit', key: 'F# menor', bpm: 110, prog: 'i-VI-iv-V', melody: [0,1,6,10, 6,1,0,3, 0,1,6,8, 6,3,1,0], bass: [0,0,8,8, 5,5,7,7] },
  misterio: { base: 155, mood: 'Misterio', color: '#7c3aed', label: 'Misterio 8-bit', key: 'G# menor', bpm: 88, prog: 'i-iv-VI-V', melody: [0,3,6,10, 8,6,3,1, 0,3,6,9, 6,3,1,0], bass: [0,0,5,5, 8,8,6,6] },
  aventura: { base: 280, mood: 'Aventura', color: '#fb923c', label: 'Aventura 8-bit', key: 'C mayor', bpm: 124, prog: 'I-V-vi-III', melody: [0,4,7,9, 12,9,7,4, 0,2,4,7, 7,4,2,0], bass: [0,0,7,7, 9,9,4,4] },
  festivo: { base: 350, mood: 'Festivo', color: '#f472b6', label: 'Festivo 8-bit', key: 'F mayor', bpm: 138, prog: 'I-IV-V-I', melody: [0,4,7,12, 14,12,9,7, 0,4,7,9, 7,4,2,0], bass: [0,0,5,5, 7,7,0,0] },
  tormenta: { base: 95, mood: 'Tormenta', color: '#475569', label: 'Tormenta 8-bit', key: 'D menor', bpm: 76, prog: 'i-VII-VI-V', melody: [0,2,6,10, 8,6,2,0, 0,2,6,10, 12,10,6,2], bass: [0,0,10,10, 8,8,7,7] },
  victoria: { base: 440, mood: 'Victoria', color: '#fde047', label: 'Victoria 8-bit', key: 'A mayor', bpm: 140, prog: 'I-V-vi-IV', melody: [0,4,7,12, 14,12,7,4, 0,4,7,12, 16,12,7,4], bass: [0,0,7,7, 9,9,5,5] },
  construccion: { base: 260, mood: 'Construcción', color: '#fdba74', label: 'Construcción 8-bit', key: 'C menor', bpm: 116, prog: 'i-VI-III-VII', melody: [0,5,7,12, 10,7,5,3, 0,5,7,10, 7,5,3,0], bass: [0,0,8,8, 3,3,10,10] },
  ensueno: { base: 208, mood: 'Ensueño', color: '#67e8f9', label: 'Ensueño 8-bit', key: 'G# mayor', bpm: 82, prog: 'I-iii-vi-IV', melody: [0,3,7,10, 12,10,7,5, 0,3,7,10, 9,7,5,3], bass: [0,0,4,4, 9,9,5,5] },
  aurora: { base: 294, mood: 'Aurora', color: '#f0abfc', label: 'Aurora boreal 8-bit', key: 'D mayor', bpm: 96, prog: 'I-iii-IV-V', melody: [0,4,7,9, 12,9,7,4, 2,4,7,11, 9,7,4,2], bass: [0,0,4,4, 5,5,7,7] },
  lluvia: { base: 175, mood: 'Lluvia', color: '#7dd3fc', label: 'Lluvia 8-bit', key: 'A# menor', bpm: 78, prog: 'i-iv-VI-iv', melody: [0,3,5,8, 10,8,5,3, 0,3,6,8, 6,5,3,0], bass: [0,0,5,5, 8,8,5,5] },
  desierto: { base: 165, mood: 'Desierto', color: '#fbbf24', label: 'Desierto 8-bit', key: 'E frigio', bpm: 88, prog: 'i-II-VII-i', melody: [0,1,5,7, 8,7,5,1, 0,1,5,8, 7,5,1,0], bass: [0,0,1,1, 10,10,0,0] },
  neon: { base: 320, mood: 'Neón', color: '#e879f9', label: 'Neon City 8-bit', key: 'F# mayor', bpm: 128, prog: 'I-V-vi-IV', melody: [0,4,7,12, 12,14,12,7, 0,2,4,7, 7,9,7,4], bass: [0,0,7,7, 9,9,5,5] },
  bosque: { base: 200, mood: 'Bosque', color: '#4ade80', label: 'Bosque 8-bit', key: 'G mayor', bpm: 90, prog: 'I-vi-IV-V', melody: [0,4,7,9, 11,9,7,4, 0,2,4,7, 7,4,2,0], bass: [0,0,9,9, 5,5,7,7] },
  glaciar: { base: 130, mood: 'Glaciar', color: '#e0f2fe', label: 'Glaciar 8-bit', key: 'C# menor', bpm: 66, prog: 'i-VI-III-VII', melody: [0,3,7,10, 12,10,7,3, 0,3,7,10, 10,7,3,0], bass: [0,0,8,8, 3,3,10,10] },
  crepusculo: { base: 185, mood: 'Crepúsculo', color: '#fb7185', label: 'Crepúsculo 8-bit', key: 'A menor', bpm: 80, prog: 'i-VII-VI-V', melody: [0,3,7,10, 12,10,7,5, 0,3,7,10, 8,7,5,3], bass: [0,0,10,10, 8,8,7,7] },
  feria: { base: 360, mood: 'Feria', color: '#facc15', label: 'Feria 8-bit', key: 'C mayor', bpm: 145, prog: 'I-IV-V-I', melody: [0,4,7,12, 12,11,9,7, 0,4,7,9, 7,4,2,0], bass: [0,0,5,5, 7,7,0,0] },
  subterraneo: { base: 100, mood: 'Subterráneo', color: '#57534e', label: 'Subterráneo 8-bit', key: 'D# menor', bpm: 74, prog: 'i-VI-iv-V', melody: [0,1,4,6, 8,6,4,1, 0,1,4,6, 6,4,1,0], bass: [0,0,8,8, 5,5,7,7] },
  estelar: { base: 380, mood: 'Estelar', color: '#c4b5fd', label: 'Estelar 8-bit', key: 'E mayor', bpm: 118, prog: 'I-iii-vi-V', melody: [0,4,7,12, 14,12,9,7, 0,4,7,11, 12,11,7,4], bass: [0,0,4,4, 9,9,7,7] },
  soledad: { base: 132, mood: 'Soledad', color: '#64748b', label: 'Soledad 8-bit', key: 'D menor', bpm: 66, prog: 'i-VI-III-VII', melody: [0,3,7,10, 8,5,3,1, 0,2,3,7, 10,7,3,0], bass: [0,0,8,8, 3,3,10,10] },
  amor: { base: 260, mood: 'Amor', color: '#fb7185', label: 'Amor 8-bit', key: 'A mayor', bpm: 86, prog: 'I-V-vi-IV', melody: [0,4,7,12, 11,7,4,2, 0,2,4,7, 9,7,4,0], bass: [0,0,7,7, 9,9,5,5] },
  romance: { base: 228, mood: 'Romance', color: '#f472b6', label: 'Romance 8-bit', key: 'F mayor', bpm: 82, prog: 'I-vi-IV-V', melody: [0,4,7,11, 12,11,7,4, 0,4,7,9, 7,4,2,0], bass: [0,0,9,9, 5,5,7,7] },
  paz: { base: 210, mood: 'Paz', color: '#86efac', label: 'Paz 8-bit', key: 'C mayor', bpm: 74, prog: 'I-IV-vi-V', melody: [0,4,7,9, 11,9,7,4, 0,2,4,7, 7,4,2,0], bass: [0,0,5,5, 9,9,7,7] },
  serenidad: { base: 188, mood: 'Serenidad', color: '#a7f3d0', label: 'Serenidad 8-bit', key: 'G mayor', bpm: 70, prog: 'I-iii-vi-IV', melody: [0,4,7,12, 10,7,5,2, 0,4,7,10, 7,5,2,0], bass: [0,0,4,4, 9,9,5,5] },
  terror: { base: 88, mood: 'Terror', color: '#991b1b', label: 'Terror 8-bit', key: 'C menor', bpm: 104, prog: 'i-VI-iv-VII', melody: [0,1,3,6, 8,6,3,1, 0,1,6,10, 6,3,1,0], bass: [0,0,8,8, 5,5,3,3] },
  ansiedad: { base: 172, mood: 'Ansiedad', color: '#f59e0b', label: 'Ansiedad 8-bit', key: 'F# menor', bpm: 120, prog: 'i-VI-VII-i', melody: [0,1,6,8, 10,8,6,1, 0,1,5,8, 8,6,1,0], bass: [0,0,8,8, 10,10,0,0] },
  miedo: { base: 102, mood: 'Miedo', color: '#1c1917', label: 'Miedo 8-bit', key: 'D# menor', bpm: 90, prog: 'i-VII-VI-V', melody: [0,2,5,10, 8,5,2,0, 0,1,3,6, 6,3,1,0], bass: [0,0,10,10, 8,8,5,5] },
  oscuridad: { base: 78, mood: 'Oscuridad', color: '#0f172a', label: 'Oscuridad 8-bit', key: 'B menor', bpm: 62, prog: 'i-iv-VI-v', melody: [0,1,4,6, 8,6,4,1, 0,2,4,7, 6,4,1,0], bass: [0,0,5,5, 8,8,7,7] },
  desesperacion: { base: 118, mood: 'Desesperación', color: '#7f1d1d', label: 'Desesperación 8-bit', key: 'E menor', bpm: 68, prog: 'i-VI-III-VII', melody: [0,3,6,8, 10,8,6,3, 0,2,5,8, 8,6,3,0], bass: [0,0,8,8, 3,3,10,10] },
  enojo: { base: 148, mood: 'Enojo', color: '#dc2626', label: 'Enojo 8-bit', key: 'A menor', bpm: 126, prog: 'i-VII-VI-V', melody: [0,3,7,10, 10,7,3,1, 0,1,3,6, 6,3,1,0], bass: [0,0,10,10, 8,8,5,5] },
  rabia: { base: 158, mood: 'Rabia', color: '#b91c1c', label: 'Rabia 8-bit', key: 'G menor', bpm: 134, prog: 'i-VI-VII-i', melody: [0,1,6,10, 10,6,1,0, 0,1,4,6, 8,6,4,1], bass: [0,0,8,8, 10,10,0,0] },
  euforia: { base: 365, mood: 'Euforia', color: '#fde047', label: 'Euforia 8-bit', key: 'C mayor', bpm: 144, prog: 'I-V-vi-III', melody: [0,4,7,14, 12,9,7,4, 0,4,7,12, 14,12,9,7], bass: [0,0,7,7, 9,9,4,4] },
  triunfo: { base: 385, mood: 'Triunfo', color: '#facc15', label: 'Triunfo 8-bit', key: 'D mayor', bpm: 136, prog: 'I-IV-V-I', melody: [0,4,7,12, 14,12,7,4, 0,2,4,7, 12,11,7,4], bass: [0,0,5,5, 7,7,0,0] },
  epica: { base: 152, mood: 'Épica', color: '#1d4ed8', label: 'Épica 8-bit', key: 'E menor', bpm: 110, prog: 'i-VI-III-VII', melody: [0,3,7,12, 14,12,7,3, 0,5,7,12, 12,10,7,5], bass: [0,0,8,8, 3,3,7,7] },
  magia: { base: 298, mood: 'Magia', color: '#c084fc', label: 'Magia 8-bit', key: 'F# mayor', bpm: 98, prog: 'I-iii-vi-V', melody: [0,4,7,11, 14,11,7,4, 0,2,4,7, 9,7,4,2], bass: [0,0,4,4, 9,9,7,7] },
  fantasia: { base: 282, mood: 'Fantasía', color: '#e879f9', label: 'Fantasía 8-bit', key: 'Bb mayor', bpm: 100, prog: 'I-V-vi-iii', melody: [0,4,7,12, 10,7,4,2, 0,4,7,9, 12,9,7,4], bass: [0,0,7,7, 9,9,4,4] },
  sueno: { base: 182, mood: 'Sueño', color: '#bae6fd', label: 'Sueño 8-bit', key: 'Ab mayor', bpm: 72, prog: 'I-vi-IV-V', melody: [0,4,7,12, 10,7,4,0, 0,2,4,7, 9,7,4,0], bass: [0,0,9,9, 5,5,7,7] },
  recuerdo: { base: 198, mood: 'Recuerdo', color: '#ddd6fe', label: 'Recuerdo 8-bit', key: 'Eb mayor', bpm: 78, prog: 'I-iii-IV-V', melody: [0,3,7,12, 10,7,3,0, 0,3,7,10, 12,10,7,3], bass: [0,0,4,4, 5,5,8,8] },
  despedida: { base: 158, mood: 'Despedida', color: '#9ca3af', label: 'Despedida 8-bit', key: 'B menor', bpm: 64, prog: 'i-iv-VI-V', melody: [0,3,7,10, 8,6,3,0, 0,3,5,7, 7,5,3,0], bass: [0,0,5,5, 8,8,3,3] },
  techno: { base: 138, mood: 'Techno', color: '#06b6d4', label: 'Techno 8-bit', key: 'A menor', bpm: 128, prog: 'i-VI-III-VII', melody: [0,3,7,12, 10,7,3,5, 0,3,7,10, 12,10,7,3], bass: [0,0,5,5, 3,3,8,8] },
  electronica: { base: 144, mood: 'Electrónica', color: '#8b5cf6', label: 'Electrónica 8-bit', key: 'F# menor', bpm: 122, prog: 'i-iv-VI-V', melody: [0,5,7,12, 7,5,3,5, 0,5,7,10, 7,5,3,0], bass: [0,0,5,5, 8,8,7,7] },
  house: { base: 126, mood: 'House', color: '#f97316', label: 'House 8-bit', key: 'C menor', bpm: 126, prog: 'i-VI-iv-V', melody: [0,3,7,10, 12,10,7,3, 0,5,7,10, 10,7,5,0], bass: [0,0,8,8, 5,5,3,3] },
  trance: { base: 142, mood: 'Trance', color: '#22d3ee', label: 'Trance 8-bit', key: 'G menor', bpm: 138, prog: 'i-VII-VI-V', melody: [0,7,12,14, 12,7,5,7, 0,7,12,14, 14,12,7,5], bass: [0,0,10,10, 8,8,5,5] },
  dubstep: { base: 70, mood: 'Dubstep', color: '#1f2937', label: 'Dubstep 8-bit', key: 'D# menor', bpm: 140, prog: 'i-VI-VII-i', melody: [0,1,3,6, 8,6,3,1, 0,1,6,8, 6,3,1,0], bass: [0,0,1,1, 0,0,6,6] },
  synthwave: { base: 112, mood: 'Synthwave', color: '#ec4899', label: 'Synthwave 8-bit', key: 'F mayor', bpm: 108, prog: 'I-V-vi-IV', melody: [0,4,7,12, 11,7,4,2, 0,4,7,11, 12,11,7,4], bass: [0,0,7,7, 9,9,5,5] },
  minimal: { base: 120, mood: 'Minimal', color: '#a3a3a3', label: 'Minimal 8-bit', key: 'G# menor', bpm: 124, prog: 'i-iv-VI-iv', melody: [0,3,7,10, 10,7,3,0, 0,3,6,10, 10,6,3,0], bass: [0,0,3,3, 8,8,5,5] },
  hardcore: { base: 160, mood: 'Hardcore', color: '#dc2626', label: 'Hardcore 8-bit', key: 'A# menor', bpm: 150, prog: 'i-VII-VI-V', melody: [0,1,6,10, 10,6,1,0, 0,1,6,10, 12,10,6,1], bass: [0,0,10,10, 8,8,5,5] },
  ambient_techno: { base: 98, mood: 'Ambient Techno', color: '#14b8a6', label: 'Ambient Techno 8-bit', key: 'E mayor', bpm: 100, prog: 'I-iii-vi-IV', melody: [0,4,7,12, 11,7,4,0, 0,4,7,11, 12,11,7,4], bass: [0,0,4,4, 9,9,5,5] },
  electro: { base: 148, mood: 'Electro', color: '#eab308', label: 'Electro 8-bit', key: 'Bb menor', bpm: 130, prog: 'i-VI-III-VII', melody: [0,5,7,12, 10,7,5,3, 0,5,7,12, 12,10,7,5], bass: [0,0,8,8, 3,3,10,10] },
  metropoli: { base: 200, mood: 'Metrópoli', color: '#38bdf8', label: 'Metrópoli 8-bit', key: 'C mayor', bpm: 100, prog: 'I-vi-IV-V', melody: [0,4,7,12, 9,7,4,2, 0,2,4,7, 12,9,7,4, 0,4,7,9, 11,9,7,4], bass: [0,0,9,9, 5,5,7,7] },
}

const TRACK_ORDER = Object.keys(TRACKS)
let currentTrackId = 'calma'
let currentIndex = TRACK_ORDER.indexOf(currentTrackId)

let autoTimeout = null
let fadeTimeout = null
let nextTimeout = null

function fadeTo(target, duration = 1.2) {
  const ctx = getContext()
  try {
    gainNode.gain.cancelScheduledValues(ctx.currentTime)
    const cur = gainNode.gain.value
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, cur)), ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, target)), ctx.currentTime + duration)
  } catch {}
}

function scheduleAutoNext() {
  clearTimeout(autoTimeout)
  clearTimeout(fadeTimeout)
  autoTimeout = setTimeout(() => {
    const myGen = generation
    fadeTo(0, 1.4)
    fadeTimeout = setTimeout(() => {
      if (myGen !== generation) return
      const nextId = TRACK_ORDER[(currentIndex + 1) % TRACK_ORDER.length]
      currentTrackId = nextId
      currentIndex = TRACK_ORDER.indexOf(nextId)
      playChiptune(TRACKS[nextId], true)
      try { window.dispatchEvent(new CustomEvent('track-toast', { detail: nextId })) } catch {}
    }, 1450)
  }, 120000)
}

function stopCurrent() {
  generation++
  clearTimeout(autoTimeout)
  clearTimeout(fadeTimeout)
  clearTimeout(nextTimeout)
  autoTimeout = null; fadeTimeout = null; nextTimeout = null
  if (intervalId) { clearInterval(intervalId); intervalId = null }
  for (const o of currentOscs) {
    try { o.stop?.(); } catch {}
    try { o.disconnect(); } catch {}
  }
  currentOscs = []
  if (workletNode) {
    try { workletNode.disconnect(); } catch {}
    try { workletNode.port?.close?.(); } catch {}
    workletNode = null
  }
  if (bassOsc) {
    try { bassOsc.stop(); } catch {}
    try { bassOsc.disconnect(); } catch {}
    bassOsc = null
  }
  try {
    const ctx = getContext()
    gainNode.gain.cancelScheduledValues(ctx.currentTime)
    gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime)
  } catch {}
}

function playChiptune(track, fromAuto = false) {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume().catch(()=>{})
  // incremento generación antes de parar para invalidar timeouts viejos
  generation++
  const myGen = generation
  stopCurrent()
  // re-increment after stop (stop already ++, use fresh)
  generation = myGen + 1
  const activeGen = generation

  // worklet path — solo Android low preparado
  if (isAndroidLow && workletReady && ctx.audioWorklet) {
    try {
      workletNode = new AudioWorkletNode(ctx, 'chiptune-processor')
      workletNode.connect(gainNode)
      workletNode.port.postMessage({ track, volume: isMuted ? 0 : 0.26 })
      currentOscs.push(workletNode)
      gainNode.gain.cancelScheduledValues(ctx.currentTime)
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(isMuted ? 0 : 0.26, ctx.currentTime + 0.45)
      scheduleAutoNext()
      return
    } catch {}
  }
  if (isAndroidLow) ensureWorklet(ctx)

  gainNode.gain.cancelScheduledValues(ctx.currentTime)
  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(isMuted ? 0 : 0.34, ctx.currentTime + (fromAuto ? 0.9 : 1.0))
  scheduleAutoNext()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const tick = 60000 / track.bpm / 2
  const tickSec = tick / 1000
  let step = 0
  let bassStep = 0

  // bajo continuo
  const bassGain = ctx.createGain()
  bassOsc = ctx.createOscillator()
  if (!isAndroidLow) {
    bassOsc.type = 'square'
    bassGain.gain.value = isMobile ? 0.16 : 0.12
    const bassFilter = ctx.createBiquadFilter()
    bassFilter.type = 'lowpass'
    bassFilter.frequency.value = 650
    bassOsc.connect(bassGain); bassGain.connect(bassFilter); bassFilter.connect(gainNode)
    currentOscs.push(bassFilter)
  } else {
    bassOsc.type = 'sine'
    bassGain.gain.value = 0.11
    bassOsc.connect(bassGain); bassGain.connect(gainNode)
  }
  try { bassOsc.start() } catch {}
  currentOscs.push(bassOsc, bassGain)

  let nextNoteTime = ctx.currentTime + 0.06
  const LOOK_AHEAD = 0.22
  const SCHEDULE_INTERVAL = 55

  function scheduleNote(audioTime) {
    if (activeGen !== generation) return
    const semi = track.melody[step % track.melody.length]
    const freq = track.base * Math.pow(2, semi / 12)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = freq
    const vel = isAndroidLow ? 0.24 : (0.30 + (step % 4 === 0 ? 0.04 : 0))
    gain.gain.setValueAtTime(0, audioTime)
    gain.gain.linearRampToValueAtTime(vel, audioTime + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.015, audioTime + tickSec * 0.86)
    if (isAndroidLow) {
      osc.connect(gain); gain.connect(gainNode)
    } else {
      const filt = ctx.createBiquadFilter()
      filt.type = 'lowpass'
      filt.frequency.value = track.mood === 'Noche' || track.mood === 'Tristeza' ? 1750 : 2500
      osc.connect(gain); gain.connect(filt); filt.connect(gainNode)
      // no guardar filt para no leak — se auto desconecta al stop
      setTimeout(() => { try { filt.disconnect() } catch {} }, (tickSec+0.2)*1000)
    }
    try { osc.start(audioTime); osc.stop(audioTime + tickSec + 0.02) } catch {}
    // auto-limpieza tras sonar
    setTimeout(() => { try { osc.disconnect(); gain.disconnect() } catch {} }, (tickSec+0.3)*1000)

    if (step % 2 === 0 && bassOsc) {
      const bSemi = track.bass[bassStep % track.bass.length]
      const bFreq = (track.base * 0.5) * Math.pow(2, bSemi / 12)
      try { bassOsc.frequency.setValueAtTime(bFreq, audioTime) } catch {}
      bassStep++
    }
    step++
  }

  function scheduler() {
    if (activeGen !== generation) { clearInterval(intervalId); intervalId = null; return }
    // si pestaña oculta, no saturar pero mantener tiempo (ya programado con look-ahead)
    if (document.visibilityState === 'hidden') return
    const now = ctx.currentTime
    while (nextNoteTime < now + LOOK_AHEAD) {
      scheduleNote(nextNoteTime)
      nextNoteTime += tickSec
    }
  }
  intervalId = setInterval(scheduler, SCHEDULE_INTERVAL)
  // primer pump inmediato
  scheduler()
}

export function createMusicManager() {
  return {
    get currentTrack() { return currentTrackId },
    get currentMood() { return TRACKS[currentTrackId]?.mood || '' },
    get volume() { return gainNode ? gainNode.gain.value : 0.34 },
    get isMuted() { return isMuted },
    get tracks() { return TRACKS },
    get trackList() { return TRACK_ORDER },
    get index() { return currentIndex },
    init() { getContext() },
    setVolume(v) {
      const ctx = getContext()
      if (isMuted) return
      try {
        gainNode.gain.cancelScheduledValues(ctx.currentTime)
        gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, v)), ctx.currentTime + 0.06)
      } catch {}
    },
    mute() { isMuted = true; try { this.setVolume(0); fadeTo(0, 0.25) } catch {} },
    unmute(vol = 0.34) { isMuted = false; const ctx = getContext(); try { gainNode.gain.cancelScheduledValues(ctx.currentTime); gainNode.gain.setValueAtTime(0, ctx.currentTime); gainNode.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, vol)), ctx.currentTime + 0.25) } catch {} },
    toggleMute() { if (isMuted) this.unmute(); else this.mute() },
    play(trackId = 'calma', fromAuto = false) {
      if (!TRACKS[trackId]) trackId = 'calma'
      currentTrackId = trackId
      currentIndex = TRACK_ORDER.indexOf(trackId)
      playChiptune(TRACKS[trackId], fromAuto)
      try { window.dispatchEvent(new CustomEvent('track-toast', { detail: trackId })) } catch {}
    },
    next() {
      clearTimeout(nextTimeout); clearTimeout(autoTimeout); clearTimeout(fadeTimeout)
      fadeTo(0, 0.65)
      const myGen = generation
      nextTimeout = setTimeout(() => {
        if (myGen !== generation && generation !== myGen + 1) {
          // si hubo otro cambio entremedio, ignora
        }
        currentIndex = (currentIndex + 1) % TRACK_ORDER.length
        const nid = TRACK_ORDER[currentIndex]
        currentTrackId = nid
        playChiptune(TRACKS[nid], true)
        try { window.dispatchEvent(new CustomEvent('track-toast', { detail: nid })) } catch {}
      }, 680)
      return TRACK_ORDER[(currentIndex + 1) % TRACK_ORDER.length]
    },
    prev() {
      clearTimeout(nextTimeout); clearTimeout(autoTimeout); clearTimeout(fadeTimeout)
      fadeTo(0, 0.65)
      nextTimeout = setTimeout(() => {
        currentIndex = (currentIndex - 1 + TRACK_ORDER.length) % TRACK_ORDER.length
        const nid = TRACK_ORDER[currentIndex]
        currentTrackId = nid
        playChiptune(TRACKS[nid], true)
        try { window.dispatchEvent(new CustomEvent('track-toast', { detail: nid })) } catch {}
      }, 680)
      return TRACK_ORDER[currentIndex]
    },
    random() {
      const rnd = TRACK_ORDER[Math.floor(Math.random() * TRACK_ORDER.length)]
      this.play(rnd); return rnd
    },
    stop() { stopCurrent(); fadeTo(0, 0.3) },
    getTracks() { return TRACKS }
  }
}
