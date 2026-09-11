/**
 * src/audio/ambientManager.js
 * 🌆 Sistema 2b — Audio contextual del mundo
 * Mezcla sonidos según lo que hay alrededor del jugador/cámara.
 * Cada tipo tiene su GainNode y su peso calculado por distancia.
 *
 * Ej: fábrica a 2 casillas = 80%, carretera a 1 = 100%
 */

let audioCtx = null
const ambientGains = {}
const ambientOscs = {}
const ambientPanners = {}

// Definición de ambientes — cada uno con su frecuencia base (placeholder oscilador)
const AMBIENTS = {
  road: { freq: 60, type: 'sawtooth', label: 'Tráfico', baseVol: 0 },
  residential: { freq: 300, type: 'sine', label: 'Residencial', baseVol: 0 },
  commercial: { freq: 500, type: 'triangle', label: 'Comercio', baseVol: 0 },
  power: { freq: 80, type: 'square', label: 'Maquinaria', baseVol: 0 },
  water: { freq: 200, type: 'sine', label: 'Agua', baseVol: 0 }
}

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function ensureAmbientNodes() {
  const ctx = getContext()
  for (const [key, cfg] of Object.entries(AMBIENTS)) {
    if (!ambientGains[key]) {
      const gain = ctx.createGain()
      gain.gain.value = 0
      // panner estéreo izq-der según posición del sonido respecto a cámara
      let panner = null
      try {
        panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null
        if (panner) { panner.pan.value = 0; gain.connect(panner); panner.connect(ctx.destination) }
        else gain.connect(ctx.destination)
      } catch { gain.connect(ctx.destination) }
      ambientGains[key] = gain
      ambientPanners[key] = panner

      const osc = ctx.createOscillator()
      osc.type = cfg.type
      osc.frequency.value = cfg.freq
      const vol = ctx.createGain()
      vol.gain.value = 0
      osc.connect(vol)
      vol.connect(gain)
      ambientOscs[key] = { osc, vol, started: false }
    }
  }
}

function startOscIfNeeded(key) {
  const entry = ambientOscs[key]
  if (!entry || entry.started) return
  try {
    entry.osc.start()
    entry.started = true
  } catch {}
}

/**
 * Analiza grid alrededor de (cx,cy) en radio 4
 * Peso = 1 / (dist+1)  — Manhattan distance
 * Retorna { road: 0..1, residential: 0..1, ... }
 */
export function analyzeSurroundings(grid, cx, cy, radius = 4) {
  const scores = { road: 0, residential: 0, commercial: 0, power: 0, water: 0 }
  const maxScores = { road: 0, residential: 0, commercial: 0, power: 0, water: 0 }

  // Normalización: sumar pesos máximos posibles para escalar a 0..1
  // Para simplificar, acumulamos y luego clamp

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x]
      if (!cell.buildingId) continue
      const dist = Math.abs(x - cx) + Math.abs(y - cy)
      if (dist > radius) continue
      const weight = 1 / (dist + 1) // 1 casilla=0.5, 2=0.33, 0=1.0
      if (scores[cell.buildingId] !== undefined) {
        scores[cell.buildingId] += weight
      }
    }
  }

  // Normalizar a 0..1 (clamp + escala). Máximo teórico ~4 si todo es mismo tipo en radio
  for (const k of Object.keys(scores)) {
    scores[k] = Math.min(1, scores[k] / 1.5) // 1.5 como threshold para 100%
  }

  return scores
}

export function createAmbientManager() {
  let masterVolume = 0.55 // 55% default
  let enabled = true

  return {
    get masterVolume() { return masterVolume },
    get enabled() { return enabled },

    init() {
      getContext()
      ensureAmbientNodes()
      // Requiere gesto del usuario para AudioContext; se inicia muted y se activa al primer click
    },

    setVolume(v) {
      masterVolume = Math.max(0, Math.min(1, v))
      // Reaplicar: los gains individuales ya están escalados por masterVolume
      // Necesitamos re-evaluar último análisis si existe
    },

    setEnabled(v) { enabled = v },

    /**
     * Llamar cada vez que cambia el grid o la posición de cámara/jugador.
     * grid: 2D array, camera: {x,y}
     */
    update(grid, camera = { x: 5, y: 5 }) {
      if (!enabled) return
      const ctx = getContext()
      if (ctx.state === 'suspended') ctx.resume()
      ensureAmbientNodes()

      const scores = analyzeSurroundings(grid, camera.x, camera.y, 4)

      // panning izq-der: promedio de posiciones del tipo respecto a cámara
      const avgPan = {}
      for (const k of Object.keys(AMBIENTS)) avgPan[k] = { sumX: 0, count: 0 }
      for (let y = 0; y < grid.length; y++) for (let x = 0; x < grid[y].length; x++) {
        const c = grid[y][x]
        if (!c.buildingId || avgPan[c.buildingId] === undefined) continue
        const dist = Math.abs(x - camera.x) + Math.abs(y - camera.y)
        if (dist > 4) continue
        avgPan[c.buildingId].sumX += (x - camera.x)
        avgPan[c.buildingId].count++
      }

      for (const [key, score] of Object.entries(scores)) {
        const gain = ambientGains[key]
        const oscEntry = ambientOscs[key]
        const panner = ambientPanners[key]
        if (!gain) continue
        const target = score * masterVolume * 0.35
        if (target > 0.01) startOscIfNeeded(key)
        gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.3)
        if (oscEntry) oscEntry.vol.gain.linearRampToValueAtTime(target > 0 ? 0.15 : 0, ctx.currentTime + 0.3)
        if (panner) {
          const pan = avgPan[key].count ? Math.max(-1, Math.min(1, avgPan[key].sumX / (avgPan[key].count * 2))) : 0
          try { panner.pan.linearRampToValueAtTime(pan * 0.9, ctx.currentTime + 0.4) } catch {}
        }
      }
      return scores
    },

    // Para debug: expone scores
    analyze: analyzeSurroundings,

    getAmbients() { return AMBIENTS }
  }
}
