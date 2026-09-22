/**
 * src/audio/soundEffects.js — 8-bit chiptune
 */

let audioCtx = null
let gainNode = null

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    gainNode = audioCtx.createGain()
    gainNode.gain.value = 0.45 // más bajo que música (0.34) para no taparla — sistemas 100% separados
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 4200
    gainNode.connect(filter)
    filter.connect(audioCtx.destination)
  }
  return audioCtx
}

function blip(freq, dur = 0.12, vol = 0.32, type = 'square', bend = 0) {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  if (bend) osc.frequency.linearRampToValueAtTime(freq + bend, ctx.currentTime + dur * 0.6)
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.008)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur)
  osc.connect(gain)
  gain.connect(gainNode)
  osc.start()
  osc.stop(ctx.currentTime + dur + 0.02)
}

function arpeggio(base, semis = [0,4,7], dur = 0.32) {
  semis.forEach((s, i) => {
    setTimeout(() => blip(base * Math.pow(2, s/12), 0.09, 0.28, 'square'), i * 55)
  })
  setTimeout(() => blip(base * 0.5, 0.12, 0.18, 'square'), dur * 1000 * 0.7)
}

export function createSoundEffects() {
  return {
    get volume() { return gainNode ? gainNode.gain.value : 0.45 },
    init() { getContext() },
    setVolume(v) {
      const ctx = getContext()
      gainNode.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, v)), ctx.currentTime + 0.06)
    },

    playBuild(buildingId) {
      // Sonidos por categoría — como carretera, cada clasificación tiene su sonidito
      const isResidential = ['residential','residential_small','residential_medium','residential_large','tower_residential','apartment_block','skyscraper'].includes(buildingId)
      const isCommercial = ['commercial','shop','supermarket','mall','bank'].includes(buildingId)
      const isRoad = ['road','dirt_road','concrete_road','cobble_road'].includes(buildingId)
      const isHotel = ['hotel','hotel_large'].includes(buildingId)
      const isFood = ['restaurant','restaurant_small'].includes(buildingId)
      const isEdu = ['school','university'].includes(buildingId)
      const isNature = ['tree','oak','pine','palm','ceiba','bush','flower','rock','park'].includes(buildingId)
      const isPublic = ['police_station','fire_station','hospital','gym','courthouse','prison'].includes(buildingId)
      const isCulture = ['church','cathedral','castle','monument','obelisk','arch','memorial','fountain','lighthouse','dam','wind_turbine','eiffel','liberty','big_ben','christ_rio','colosseum','taj_mahal','great_wall','pyramid','chichen','monserrate','machu','obelisco_ar','torii','palace_kr','wat_thai','table_za','hassan_ma','gate_de','sagrada_es','parthenon_gr','city_hall','museum','port','solar_farm','financial_district','opera','olympic_stadium','nuclear_plant','intl_airport','library','convention_center'].includes(buildingId)
      const isCoast = ['dock','pier','fishing_hut'].includes(buildingId)
      const isFlag = buildingId && buildingId.startsWith('flag_')
      const map = {
        residential: () => { blip(440, 0.09, 0.30, 'square'); setTimeout(()=>blip(550, 0.09, 0.26, 'square'), 70); setTimeout(()=>blip(660, 0.12, 0.22, 'square'), 140) },
        commercial: () => { arpeggio(330, [0,4,7,12], 0.34) },
        road: () => { blip(120, 0.08, 0.26, 'square'); setTimeout(()=>blip(180, 0.08, 0.26, 'square'), 60); setTimeout(()=>blip(90, 0.14, 0.22, 'square'), 120) },
        power: () => { blip(80, 0.14, 0.28, 'square', 40); setTimeout(()=>blip(160, 0.10, 0.24, 'square'), 90) },
        water: () => { blip(600, 0.10, 0.24, 'square'); setTimeout(()=>blip(800, 0.08, 0.20, 'square'), 80); setTimeout(()=>blip(500, 0.14, 0.18, 'square', -80), 160) },
        waterPlant: () => { blip(600, 0.10, 0.24, 'square'); setTimeout(()=>blip(800, 0.08, 0.20, 'square'), 80); setTimeout(()=>blip(500, 0.14, 0.18, 'square', -80), 160) },
        tree: () => { blip(380, 0.10, 0.22, 'square'); setTimeout(()=>blip(480, 0.08, 0.20, 'square'), 70) },
        bush: () => { blip(420, 0.09, 0.20, 'square') },
        flower: () => { blip(720, 0.08, 0.20, 'square'); setTimeout(()=>blip(900, 0.08, 0.18, 'square'), 60) },
        rock: () => { blip(110, 0.10, 0.24, 'square'); setTimeout(()=>blip(70, 0.12, 0.20, 'square'), 70) },
        park: () => { arpeggio(400, [0,7,12], 0.28) },
      }
      if (map[buildingId]) return map[buildingId]()
      if (isRoad) return (()=>{ blip(120,0.08,0.26,'square'); setTimeout(()=>blip(180,0.08,0.26,'square'),60); setTimeout(()=>blip(90,0.14,0.22,'square'),120) })()
      if (isResidential) return (()=>{ blip(440,0.09,0.28,'square'); setTimeout(()=>blip(520,0.09,0.24,'square'),70); setTimeout(()=>blip(620,0.11,0.20,'square'),140) })()
      if (isCommercial) return (()=>{ arpeggio(340, [0,4,7,12], 0.32) })()
      if (isHotel) return (()=>{ blip(500,0.10,0.26,'square'); setTimeout(()=>blip(620,0.10,0.24,'square'),80); setTimeout(()=>blip(740,0.12,0.22,'square'),160) })()
      if (isFood) return (()=>{ blip(480,0.08,0.24,'square'); setTimeout(()=>blip(600,0.08,0.22,'square'),70) })()
      if (isEdu) return (()=>{ arpeggio(500, [0,4,7], 0.30) })()
      if (isNature) return (()=>{ blip(380,0.10,0.20,'square'); setTimeout(()=>blip(460,0.08,0.18,'square'),70) })()
      if (isPublic) return (()=>{ blip(300,0.10,0.26,'square'); setTimeout(()=>blip(380,0.10,0.24,'square'),90) })()
      if (isCulture) return (()=>{ arpeggio(360, [0,5,9], 0.30) })()
      if (isCoast) return (()=>{ blip(520,0.09,0.22,'square'); setTimeout(()=>blip(620,0.09,0.20,'square'),70) })()
      if (isFlag) return (()=>{ blip(700,0.07,0.20,'square'); setTimeout(()=>blip(850,0.07,0.18,'square'),60) })()
      blip(500,0.10,0.22,'square')
    },

    playDemolish() {
      blip(200, 0.12, 0.28, 'square'); setTimeout(()=>blip(120, 0.14, 0.24, 'square'), 80); setTimeout(()=>blip(60, 0.18, 0.22, 'square'), 170)
    },

    playIncome(amount) {
      if (amount <= 0) return
      const vol = Math.min(0.30, 0.14 + amount * 0.012)
      blip(880, 0.08, vol, 'square'); setTimeout(()=>blip(1100, 0.10, vol*0.85, 'square'), 70)
    },

    playDeficit() {
      blip(140, 0.18, 0.26, 'square', -30); setTimeout(()=>blip(90, 0.22, 0.22, 'square'), 120)
    },

    playError(reason) {
      blip(180, 0.10, 0.22, 'square'); setTimeout(()=>blip(110, 0.14, 0.20, 'square'), 80)
    },

    playGunShot() {
      // disparo corto con panning sutil
      blip(180, 0.06, 0.34, 'square', -90); setTimeout(()=>blip(90, 0.08, 0.28, 'square'), 35); setTimeout(()=>blip(60, 0.10, 0.18, 'triangle'), 90)
      // eco
      setTimeout(()=>blip(220, 0.07, 0.16, 'square'), 110)
    },
    playKnife() {
      blip(300, 0.05, 0.24, 'sawtooth'); setTimeout(()=>blip(480, 0.04, 0.18, 'sawtooth'), 40)
    },
    playSiren(type = 'police') {
      // police: 650→850 wail, ambulance: 720→900 yelp
      if (type === 'ambulance') {
        blip(720, 0.18, 0.26, 'square', 180); setTimeout(()=>blip(900, 0.18, 0.24, 'square', -120), 180)
      } else {
        blip(650, 0.22, 0.28, 'square', 200); setTimeout(()=>blip(850, 0.22, 0.26, 'square', -180), 220)
      }
    },
    playCannon() {
      blip(60, 0.14, 0.38, 'sawtooth'); setTimeout(()=>blip(40, 0.22, 0.34, 'triangle'), 60); setTimeout(()=>blip(180, 0.08, 0.18, 'square'), 180)
    },
    playBomb() {
      blip(45, 0.18, 0.40, 'sawtooth'); setTimeout(()=>blip(30, 0.28, 0.36, 'triangle'), 70); setTimeout(()=>{ blip(90, 0.12, 0.22, 'square'); blip(120, 0.10, 0.16, 'square') }, 140)
    },
    playExplosion() {
      blip(35, 0.32, 0.42, 'sawtooth', -15); setTimeout(()=>blip(70, 0.18, 0.24, 'square'), 90)
    },
    playAtomicAlarm(heavy = false, durationMs = 9000) {
      // alarma atómica solo para atómicas — suena un tiempo (no para cohetes)
      const endAt = Date.now() + durationMs
      const tick = () => {
        if (Date.now() > endAt) return
        // sirena grave wail, más grave y anaranjada para pesada
        if (heavy) {
          blip(220, 0.28, 0.30, 'sawtooth', 120); setTimeout(()=>blip(340, 0.28, 0.28, 'sawtooth', -90), 280)
        } else {
          blip(380, 0.22, 0.26, 'square', 180); setTimeout(()=>blip(520, 0.22, 0.24, 'square', -140), 260)
        }
        setTimeout(tick, heavy ? 620 : 560)
      }
      tick()
    },
    playAtomicCountdownTick(remaining) {
      const ctx = getContext()
      if (ctx.state === 'suspended') ctx.resume()
      // tick agudo + grave alternado, más urgente cuando queda poco
      const freq = remaining <= 2 ? 920 : remaining <= 4 ? 720 : 520
      const vol = remaining <= 2 ? 0.34 : 0.28
      blip(freq, 0.12, vol, 'square')
      if (remaining <= 2) setTimeout(()=>blip(freq*0.5, 0.18, vol*0.9, 'sawtooth', -40), 60)
    },
    playAtomicHeavyImpact() {
      const ctx = getContext()
      if (ctx.state === 'suspended') ctx.resume()
      // impacto escabroso: sub-grave + crujido + eco largo y tenebroso
      blip(22, 0.6, 0.55, 'sawtooth')
      setTimeout(()=>blip(35, 0.5, 0.48, 'triangle'), 40)
      setTimeout(()=>blip(85, 0.35, 0.30, 'square', -30), 120)
      setTimeout(()=>blip(45, 0.9, 0.38, 'sawtooth', -20), 260)
      setTimeout(()=>blip(18, 1.2, 0.42, 'triangle'), 400)
      // crujido secundario
      setTimeout(()=>{ blip(120, 0.15, 0.20, 'sawtooth'); blip(60, 0.22, 0.18, 'square') }, 520)
      // onda tenebrosa grave
      setTimeout(()=>blip(28, 0.8, 0.32, 'sine'), 800)
    },
    playAtomicNormalImpact() {
      blip(45, 0.22, 0.42, 'sawtooth'); setTimeout(()=>blip(30, 0.32, 0.38, 'triangle'), 70); setTimeout(()=>{ blip(90, 0.12, 0.22, 'square'); blip(120, 0.10, 0.16, 'square') }, 160)
      setTimeout(()=>blip(60, 0.25, 0.20, 'square'), 280)
    },
    playMissileWhistle() {
      const ctx = getContext()
      if (ctx.state === 'suspended') ctx.resume()
      // silbido de misil cayendo: frecuencia descendente aguda
      blip(900, 0.25, 0.18, 'sine'); setTimeout(()=>blip(700, 0.22, 0.16, 'sine'), 120); setTimeout(()=>blip(400, 0.28, 0.20, 'square', -120), 260)
    },
    playMissileImpact() {
      blip(55, 0.18, 0.40, 'sawtooth'); setTimeout(()=>blip(35, 0.24, 0.34, 'triangle'), 50); setTimeout(()=>blip(110, 0.12, 0.18, 'square'), 140)
      setTimeout(()=>blip(180, 0.08, 0.14, 'square'), 200)
    }
  }
}
