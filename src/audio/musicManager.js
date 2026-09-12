/**
 * src/audio/musicManager.js — 8-bit chiptune, 25 pistas compuestas como compositor
 * Cada pista: tonalidad, progresión, melodía 16 pasos, bajo y mood. N para siguiente.
 */

let audioCtx = null
let gainNode = null
let currentOscs = []
let isMuted = false
let intervalId = null
let bassOsc = null
const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '')
const isLowEnd = typeof navigator !== 'undefined' && (isAndroid ? ((navigator.deviceMemory || 4) <= 4 || (navigator.hardwareConcurrency || 4) <= 4) : ((navigator.deviceMemory || 4) <= 2 || (navigator.hardwareConcurrency || 4) <= 2)) || !!navigator.connection?.saveData
const isAndroidLow = isAndroid && isLowEnd

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    gainNode = audioCtx.createGain()
    gainNode.gain.value = 0.34
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2800
    gainNode.connect(filter)
    filter.connect(audioCtx.destination)
  }
  return audioCtx
}

// 55 pistas — 25 originales + 20 pedidas + 10 tecno/electrónica
const TRACKS = {
  // 1-15 originales mejoradas con melodía compuesta
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
  // 10 nuevas — composición fresca
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
  // 20 nuevas — estilos pedidos
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
  // 10 tecno / electrónica — 2min cada una con fade
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

function fadeTo(target, duration = 1.8) {
  const ctx = getContext()
  const start = gainNode.gain.value
  gainNode.gain.cancelScheduledValues(ctx.currentTime)
  gainNode.gain.setValueAtTime(start, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, target)), ctx.currentTime + duration)
}

function scheduleAutoNext() {
  clearTimeout(autoTimeout)
  // cada pista dura ~2min con fade, luego siguiente automática con desvanecimiento
  autoTimeout = setTimeout(() => {
    fadeTo(0, 1.6)
    fadeTimeout = setTimeout(() => {
      const nextId = TRACK_ORDER[(currentIndex + 1) % TRACK_ORDER.length]
      currentTrackId = nextId
      currentIndex = TRACK_ORDER.indexOf(nextId)
      playChiptune(TRACKS[nextId], true)
      try { window.dispatchEvent(new CustomEvent('track-toast', { detail: nextId })) } catch {}
    }, 1700)
  }, 120000)
}

function stopCurrent() {
  clearTimeout(autoTimeout)
  clearTimeout(fadeTimeout)
  for (const o of currentOscs) try { o.stop(); o.disconnect() } catch {}
  currentOscs = []
  if (intervalId) clearInterval(intervalId)
  intervalId = null
  if (bassOsc) try { bassOsc.stop(); bassOsc.disconnect() } catch {}
  bassOsc = null
}

function playChiptune(track, fromAuto = false) {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume()
  stopCurrent()
  // fade in suave para no entrar de sopetón
  if (!fromAuto) {
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(isMuted ? 0 : 0.34, ctx.currentTime + 1.4)
  } else {
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(isMuted ? 0 : 0.34, ctx.currentTime + 1.2)
  }
  scheduleAutoNext()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const tick = isAndroidLow ? 60000 / track.bpm / 1 : isMobile ? 60000 / track.bpm / 1.3 : isLowEnd ? 60000 / track.bpm / 1.5 : 60000 / track.bpm / 2
  let step = 0

  // Bajo continuo 8-bit — omitido en Android low para no trabar
  if (!isAndroidLow) {
    bassOsc = ctx.createOscillator()
    const bassGain = ctx.createGain()
    bassOsc.type = 'square'
    bassGain.gain.value = isLowEnd ? 0.09 : 0.13
    if (isLowEnd) {
      bassOsc.connect(bassGain); bassGain.connect(gainNode)
    } else {
      const bassFilter = ctx.createBiquadFilter()
      bassFilter.type = 'lowpass'
      bassFilter.frequency.value = 650
      bassOsc.connect(bassGain); bassGain.connect(bassFilter); bassFilter.connect(gainNode)
      currentOscs.push(bassFilter)
    }
    bassOsc.start()
    currentOscs.push(bassOsc, bassGain)
  }

  let bassStep = 0
  intervalId = setInterval(() => {
    if (isAndroidLow && step % 2 === 1) { step++; return }
    const semi = track.melody[step % track.melody.length]
    const freq = track.base * Math.pow(2, semi/12)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = freq
    // envolvente 8-bit con duty + variación sutil por ritmo
    const vel = isLowEnd ? 0.28 : 0.34 + (step % 4 === 0 ? 0.06 : 0) + (Math.random()*0.04)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(vel, ctx.currentTime + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + tick/1000 * 0.85)
    if (isLowEnd) {
      osc.connect(gain); gain.connect(gainNode)
    } else {
      const filt = ctx.createBiquadFilter()
      filt.type = 'lowpass'
      filt.frequency.value = track.mood === 'Noche' || track.mood === 'Tristeza' ? 1800 : 2600 + (step%8===0 ? 400 : 0)
      osc.connect(gain); gain.connect(filt); filt.connect(gainNode)
      currentOscs.push(filt)
    }
    osc.start(); osc.stop(ctx.currentTime + tick/1000)
    currentOscs.push(osc, gain)
    const isMobile2 = typeof window !== 'undefined' && window.innerWidth < 768
    if (currentOscs.length > (isAndroidLow ? 8 : isMobile2 ? 12 : isLowEnd ? 14 : 24)) currentOscs.splice(0,3)

    // ritmo por pista — en móvil se simplifica mucho para no trabar
    const isMobile3 = typeof window !== 'undefined' && window.innerWidth < 768
    if (!isLowEnd && !isMobile3 && !isAndroidLow) {
      const isTechno = ['techno','house','trance','hardcore','ambient_techno','electro'].includes(Object.keys(TRACKS).find(k=>TRACKS[k]===track))
      const isCalm = ['calma','noche','serenidad','paz'].includes(Object.keys(TRACKS).find(k=>TRACKS[k]===track))
      if (isTechno) {
        if (step % 2 === 0) {
          const kOsc = ctx.createOscillator(); const kGain = ctx.createGain()
          kOsc.type='sine'; kOsc.frequency.setValueAtTime(55, ctx.currentTime); kOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime+0.12)
          kGain.gain.setValueAtTime(0, ctx.currentTime); kGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime+0.005); kGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime+0.14)
          kOsc.connect(kGain); kGain.connect(gainNode); kOsc.start(ctx.currentTime); kOsc.stop(ctx.currentTime+0.14)
          currentOscs.push(kOsc, kGain)
        }
        const hGain = ctx.createGain(); const hFilt = ctx.createBiquadFilter()
        hFilt.type='highpass'; hFilt.frequency.value=7500
        hGain.gain.setValueAtTime(0, ctx.currentTime); hGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime+0.002); hGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.05)
        const hOsc = ctx.createOscillator(); hOsc.type='square'; hOsc.frequency.value=2200+Math.random()*400
        hOsc.connect(hGain); hGain.connect(hFilt); hFilt.connect(gainNode); hOsc.start(ctx.currentTime); hOsc.stop(ctx.currentTime+0.05)
        currentOscs.push(hOsc, hGain, hFilt)
      } else if (!isCalm && step % 2 === 1) {
        const hGain = ctx.createGain(); const hFilt = ctx.createBiquadFilter()
        hFilt.type='highpass'; hFilt.frequency.value=7000
        hGain.gain.setValueAtTime(0, ctx.currentTime); hGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime+0.003); hGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.05)
        const hOsc = ctx.createOscillator(); hOsc.type='square'; hOsc.frequency.value=1800+Math.random()*400
        hOsc.connect(hGain); hGain.connect(hFilt); hFilt.connect(gainNode); hOsc.start(ctx.currentTime); hOsc.stop(ctx.currentTime+0.05)
        currentOscs.push(hOsc, hGain, hFilt)
      }
    }

    // Bajo cambia cada 2 pasos (blanca) con variación — omitido en Android low
    if (!isAndroidLow && step % 2 === 0) {
      const bSemi = track.bass[bassStep % track.bass.length]
      const bFreq = (track.base * 0.5) * Math.pow(2, bSemi/12)
      bassOsc.frequency.linearRampToValueAtTime(bFreq, ctx.currentTime + 0.04)
      bassStep++
    }
    step++
  }, tick)
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
      gainNode.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, v)), ctx.currentTime + 0.08)
    },
    mute() { isMuted = true; this.setVolume(0) },
    unmute(vol = 0.34) { isMuted = false; this.setVolume(vol) },
    toggleMute() { if (isMuted) this.unmute(); else this.mute() },
    play(trackId = 'calma', fromAuto = false) {
      if (!TRACKS[trackId]) trackId = 'calma'
      currentTrackId = trackId
      currentIndex = TRACK_ORDER.indexOf(trackId)
      playChiptune(TRACKS[trackId], fromAuto)
      try { window.dispatchEvent(new CustomEvent('track-toast', { detail: trackId })) } catch {}
    },
    next() {
      // desvanecimiento antes de siguiente manual
      fadeTo(0, 0.9)
      clearTimeout(autoTimeout)
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % TRACK_ORDER.length
        this.play(TRACK_ORDER[currentIndex], true)
      }, 950)
      return TRACK_ORDER[(currentIndex + 1) % TRACK_ORDER.length]
    },
    prev() {
      fadeTo(0, 0.9)
      clearTimeout(autoTimeout)
      setTimeout(() => {
        currentIndex = (currentIndex - 1 + TRACK_ORDER.length) % TRACK_ORDER.length
        this.play(TRACK_ORDER[currentIndex], true)
      }, 950)
      return TRACK_ORDER[currentIndex]
    },
    random() {
      const rnd = TRACK_ORDER[Math.floor(Math.random() * TRACK_ORDER.length)]
      this.play(rnd); return rnd
    },
    stop() { stopCurrent() },
    getTracks() { return TRACKS }
  }
}
