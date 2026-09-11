import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCityStore } from './cityStore.js'

const ROAD_IDS = ['road','dirt_road','concrete_road','cobble_road']
const RAIL_IDS = ['rail']

function isRoadCell(cell) {
  return cell && (ROAD_IDS.includes(cell.buildingId) || cell.hasRoad)
}
function isRailCell(cell) {
  return cell && (RAIL_IDS.includes(cell.buildingId) || cell.hasRail)
}

export const useTrafficStore = defineStore('traffic', () => {
  const vehicles = ref([]) // {id,x,y,dir,type,speed,hasPatient?}
  const pedestrians = ref([]) // {id,x,y,dir,kind,speed,injured?,escaping?}
  const trains = ref([])
  // accidentes visibles: {id,x,y, hasAmbulance?}
  const accidents = ref([])
  // aviones aeropuerto: {id, x,y, targetX,targetY, phase:'landing'|'takeoff', progress, airportX,airportY}
  const airportPlanes = ref([])
  let vid = 1, pid = 1, tid = 1, aid = 1, apid = 1

  function addVehicle(x, y, type = 'car') {
    const city = useCityStore()
    const cell = city.getCell(x, y)
    if (type === 'train') {
      if (!cell || !isRailCell(cell)) return { ok: false, reason: 'Tren solo sobre rieles 🛤️' }
      trains.value.push({ id: tid++, x, y, dir: 'right', type, speed: 520 })
      return { ok: true }
    }
    if (!cell || !isRoadCell(cell)) return { ok: false, reason: 'Solo sobre carretera' }
    const speedMap = { moto: 320, trailer: 650, police_car: 400, ambulance: 380, fire_truck: 420, army_jeep: 380, tank: 520 }
    vehicles.value.push({ id: vid++, x, y, dir: 'right', type, speed: speedMap[type] || 480 })
    return { ok: true }
  }

  function addPedestrian(x, y, kind = 'adult') {
    const city = useCityStore()
    const cell = city.getCell(x, y)
    if (!cell || !isRoadCell(cell)) {
      const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
      let found = null
      for (const [dx,dy] of dirs) {
        const c = city.getCell(x+dx, y+dy)
        if (isRoadCell(c)) { found = { x: x+dx, y: y+dy }; break }
      }
      if (!found) {
        // buscar en radio 2
        for (let r=2; r<=2; r++) {
          for (let dx=-r; dx<=r; dx++) for (let dy=-r; dy<=r; dy++) {
            const c = city.getCell(x+dx, y+dy)
            if (isRoadCell(c)) { found = { x: x+dx, y: y+dy }; break }
          }
          if (found) break
        }
      }
      if (!found) return { ok: false, reason: 'Sin carretera cerca' }
      x = found.x; y = found.y
    }
    // criminales armados aleatorios
    const criminalWeapons = ['knife','gun','unarmed']
    const isService = ['police','medic','fireman','student','uni_student','lawyer','judge','soldier'].includes(kind)
    const weapon = kind === 'criminal' ? criminalWeapons[Math.floor(Math.random()*criminalWeapons.length)] : null
    // arma influye en riesgo y símbolo; gun = más letal, knife = cuerpo a cuerpo
    const isArmed = kind === 'criminal' && weapon !== 'unarmed'
    // peatones caminan despacio (1200-1600ms), servicio un poco menos lento, criminal corre si huye (550ms), se ajusta dinámico en tick
    const baseSpeed = isService ? 1150 + Math.random()*250 : kind==='criminal' ? 950 + Math.random()*200 : 1250 + Math.random()*350
    pedestrians.value.push({ id: pid++, x, y, dir: 'right', kind, weapon, isArmed, attackCooldown: 0, isRunning: false, speed: baseSpeed, baseSpeed, step: 0 })
    return { ok: true }
  }

  function randomStep(entity, isTrain = false) {
    const city = useCityStore()
    const check = isTrain ? isRailCell : isRoadCell
    const dirs = [
      { dx: 1, dy: 0, dir: 'right' },
      { dx: -1, dy: 0, dir: 'left' },
      { dx: 0, dy: -1, dir: 'up' },
      { dx: 0, dy: 1, dir: 'down' },
    ]
    const opposite = { right:'left', left:'right', up:'down', down:'up' }
    // evitar aglomeración: cuenta peatones/vehículos en destino
    function occupancy(x, y) {
      let n = 0
      for (const p of pedestrians.value) if (p.x === x && p.y === y) n++
      for (const v of vehicles.value) if (!isTrain && v.x === x && v.y === y) n++
      return n
    }
    let candidates = []
    for (const d of dirs) {
      if (opposite[entity.dir] === d.dir && Math.random() < 0.7) continue
      const c = city.getCell(entity.x + d.dx, entity.y + d.dy)
      if (!check(c)) continue
      const occ = occupancy(entity.x + d.dx, entity.y + d.dy)
      if (occ >= 2 && Math.random() < 0.85) continue // evita amontonar 2+ en misma celda
      candidates.push(d)
    }
    if (candidates.length === 0) {
      for (const d of dirs) {
        const c = city.getCell(entity.x + d.dx, entity.y + d.dy)
        if (!check(c)) continue
        const occ = occupancy(entity.x + d.dx, entity.y + d.dy)
        if (occ >= 3) continue
        candidates.push(d)
      }
    }
    if (candidates.length === 0) return null
    // preferir menos ocupado
    candidates.sort((a,b) => occupancy(entity.x+a.dx, entity.y+a.dy) - occupancy(entity.x+b.dx, entity.y+b.dy))
    if (candidates.length > 1 && occupancy(entity.x+candidates[0].dx, entity.y+candidates[0].dy) === 0 && Math.random() < 0.7) {
      return candidates[0]
    }
    return candidates[Math.floor(Math.random()*Math.min(2, candidates.length))]
  }

  function stepTowards(entity, target, isTrain = false) {
    const city = useCityStore()
    const check = isTrain ? isRailCell : isRoadCell
    const dx = Math.sign(target.x - entity.x)
    const dy = Math.sign(target.y - entity.y)
    const preferred = []
    if (dx !== 0) preferred.push({ dx, dy: 0, dir: dx > 0 ? 'right' : 'left' })
    if (dy !== 0) preferred.push({ dx: 0, dy, dir: dy > 0 ? 'down' : 'up' })
    // intenta movimiento directo hacia objetivo si hay carretera
    for (const d of preferred) {
      const c = city.getCell(entity.x + d.dx, entity.y + d.dy)
      if (check(c)) return d
    }
    // si bloqueado, usa random pero priorizando dirección hacia objetivo
    let candidates = []
    const dirs = [
      { dx: 1, dy: 0, dir: 'right' },
      { dx: -1, dy: 0, dir: 'left' },
      { dx: 0, dy: -1, dir: 'up' },
      { dx: 0, dy: 1, dir: 'down' },
    ]
    for (const d of dirs) {
      const c = city.getCell(entity.x + d.dx, entity.y + d.dy)
      if (check(c)) {
        // bonus si se acerca al target
        const distNow = Math.abs(target.x - entity.x) + Math.abs(target.y - entity.y)
        const distNext = Math.abs(target.x - (entity.x + d.dx)) + Math.abs(target.y - (entity.y + d.dy))
        if (distNext < distNow || Math.random() < 0.3) candidates.push(d)
      }
    }
    if (candidates.length === 0) return randomStep(entity, isTrain)
    return candidates[Math.floor(Math.random()*candidates.length)]
  }

  function addAccident(x, y) {
    const city = useCityStore()
    const cell = city.getCell(x, y)
    if (!cell || !isRoadCell(cell)) return { ok: false }
    if (accidents.value.some(a => a.x === x && a.y === y)) return { ok: false }
    if (accidents.value.length >= 4) return { ok: false }
    accidents.value.push({ id: aid++, x, y, t: Date.now() })
    return { ok: true }
  }

  function addAirportPlane(airportX, airportY, w, h, type = 'landing') {
    // type landing: aparece diagonal fuera y va a pista; takeoff: sale de pista diagonal fuera
    const isLanding = type === 'landing'
    const cx = airportX + w / 2
    const cy = airportY + h / 2
    const offset = 6 // celdas diagonales fuera
    let startX, startY, endX, endY
    // alterna diagonal NW-SE o NE-SW
    const diag = Math.random() < 0.5 ? 1 : -1
    if (isLanding) {
      startX = cx + offset * diag
      startY = cy - offset // arriba
      endX = cx
      endY = cy
    } else {
      startX = cx
      startY = cy
      endX = cx + offset * diag
      endY = cy - offset
    }
    airportPlanes.value.push({ id: apid++, x: startX, y: startY, targetX: endX, targetY: endY, phase: type, progress: 0, airportX, airportY, w, h, alpha: isLanding ? 1 : 0.2 })
    // limitar a 3 por aeropuerto
    if (airportPlanes.value.length > 6) airportPlanes.value.shift()
    return { ok: true }
  }

  function tick() {
    // aviones: interpolación diagonal suave 0->1 en ~6 ticks (3s)
    for (let i = airportPlanes.value.length - 1; i >= 0; i--) {
      const pl = airportPlanes.value[i]
      pl.progress += 0.16
      const t = Math.min(1, pl.progress)
      // ease-in-out
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      pl.x = pl.x + (pl.targetX - pl.x) * 0.18
      pl.y = pl.y + (pl.targetY - pl.y) * 0.18
      // alpha y escala: aterrizaje empieza pequeño y crece, despegue inverso
      if (pl.phase === 'landing') {
        pl.alpha = 1 - eased * 0.1
        pl.scale = 0.7 + eased * 0.6
      } else {
        pl.alpha = 0.3 + eased * 0.7
        pl.scale = 0.8 + eased * 0.8
      }
      if (t >= 1 || Math.hypot(pl.x - pl.targetX, pl.y - pl.targetY) < 0.15) {
        // aterrizaje desaparece en pista, despegue desaparece fuera
        airportPlanes.value.splice(i, 1)
      }
    }

    // 1) Policía/soldado a pie y patrullas/ejército persiguen criminales más cercanos (radio 10)
    const criminals = pedestrians.value.filter(p => p.kind === 'criminal')
    const polices = pedestrians.value.filter(p => p.kind === 'police' || p.kind === 'soldier')
    const policeCars = vehicles.value.filter(v => v.type === 'police_car' || v.type === 'army_jeep' || v.type === 'tank')
    const ambulances = vehicles.value.filter(v => v.type === 'ambulance')
    // accidentes activos
    const activeAccidents = accidents.value.slice()

    // limpiar accidentes viejos >45s sin rescate
    const now = Date.now()
    accidents.value = accidents.value.filter(a => now - a.t < 45000)

    for (const p of polices) {
      // peatones normales caminan despacio
      p.speed = p.baseSpeed || p.speed
      if (criminals.length === 0) {
        p.isRunning = false
        const step = randomStep(p, false)
        if (step) { p.x += step.dx; p.y += step.dy; p.dir = step.dir }
        continue
      }
      // buscar criminal más cercano
      let best = null, bestD = Infinity
      for (const c of criminals) {
        const d = Math.abs(c.x - p.x) + Math.abs(c.y - p.y)
        if (d < bestD && d <= 10) { bestD = d; best = c }
      }
      if (best) {
        p.isRunning = true; p.speed = 580
        if (bestD <= 1) {
          // atrapar: 80% éxito, 20% escapa
          if (Math.random() < 0.8) {
            const idx = pedestrians.value.findIndex(x => x.id === best.id)
            if (idx !== -1) pedestrians.value.splice(idx, 1)
            // log sutil
          } else {
            const step = randomStep(best, false); if (step) { best.x += step.dx; best.y += step.dy; best.dir = step.dir; best.isRunning = true; best.speed = 520 }
            const stepP = stepTowards(p, best, false); if (stepP) { p.x += stepP.dx; p.y += stepP.dy; p.dir = stepP.dir }
          }
        } else {
          const step = stepTowards(p, best, false)
          if (step) { p.x += step.dx; p.y += step.dy; p.dir = step.dir }
        }
      } else {
        p.isRunning = false; p.speed = p.baseSpeed || 1150
        const step = randomStep(p, false)
        if (step) { p.x += step.dx; p.y += step.dy; p.dir = step.dir }
      }
    }

    for (const v of policeCars) {
      if (criminals.length === 0) {
        const step = randomStep(v, false)
        if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
        continue
      }
      let best = null, bestD = Infinity
      for (const c of criminals) {
        const d = Math.abs(c.x - v.x) + Math.abs(c.y - v.y)
        if (d < bestD && d <= 12) { bestD = d; best = c }
      }
      if (best) {
        if (bestD <= 1) {
          const idx = pedestrians.value.findIndex(x => x.id === best.id)
          if (idx !== -1) pedestrians.value.splice(idx, 1)
        } else {
          const step = stepTowards(v, best, false)
          if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
        }
      } else {
        const step = randomStep(v, false)
        if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
      }
    }

    // Criminales: huyen o atacan según arma (knife/gun) — corren al huir/atacar
    for (const c of criminals) {
      if (c.attackCooldown > 0) c.attackCooldown--
      const nearestPolice = [...polices, ...policeCars].reduce((b, p) => {
        const d = Math.abs(p.x - c.x) + Math.abs(p.y - c.y)
        return d < (b?.d ?? Infinity) ? { p, d } : b
      }, null)
      // si policía muy cerca (≤1), decide atacar o huir
      if (nearestPolice && nearestPolice.d <= 1 && c.attackCooldown === 0) {
        const isGun = c.weapon === 'gun'
        const isKnife = c.weapon === 'knife'
        const attackChance = isGun ? 0.55 : isKnife ? 0.40 : 0.12
        if (Math.random() < attackChance) {
          // ataca: hiere a policía/civil cercano o crea accidente
          const victimPolice = polices.find(p => Math.abs(p.x - c.x) + Math.abs(p.y - c.y) <= 1)
          if (victimPolice) {
            victimPolice.injured = true
            victimPolice.speed = 9999
            addAccident(victimPolice.x, victimPolice.y)
            c.attackCooldown = isGun ? 6 : 4
          } else {
            // ataca civil cercano o crea accidente en su posición
            const civil = pedestrians.value.find(p => !['police','soldier','criminal','medic','fireman'].includes(p.kind) && !p.injured && Math.abs(p.x - c.x)+Math.abs(p.y - c.y) <= 1)
            if (civil) {
              civil.injured = true; civil.speed = 9999; addAccident(civil.x, civil.y)
            } else {
              addAccident(c.x, c.y)
            }
            c.attackCooldown = 5
          }
          // tras atacar, huye rápido
          c.isRunning = true; c.speed = 520
          const step = randomStep(c, false)
          if (step) { c.x += step.dx; c.y += step.dy; c.dir = step.dir }
          continue
        }
      }
      if (nearestPolice && nearestPolice.d <= 4) {
        // huye rápido
        c.isRunning = true; c.speed = 520
        const step = randomStep(c, false)
        if (step) { c.x += step.dx; c.y += step.dy; c.dir = step.dir }
        continue
      }
      // si no huye, a veces ataca civiles a distancia 1 aunque no haya policía
      if (Math.random() < 0.04) {
        const civilNear = pedestrians.value.find(p => !['police','soldier','criminal','medic','fireman'].includes(p.kind) && !p.injured && Math.abs(p.x - c.x)+Math.abs(p.y - c.y) <= 1)
        if (civilNear && c.attackCooldown === 0) {
          civilNear.injured = true; civilNear.speed = 9999; addAccident(civilNear.x, civilNear.y)
          c.attackCooldown = 6
          c.isRunning = true; c.speed = 520
          continue
        }
      }
      c.isRunning = false; c.speed = c.baseSpeed || 1100
      const step = randomStep(c, false)
      if (step) { c.x += step.dx; c.y += step.dy; c.dir = step.dir }
    }

    // Ambulancias persiguen accidentes
    for (const v of ambulances) {
      if (activeAccidents.length === 0) {
        if (!v.hasPatient) {
          const step = randomStep(v, false)
          if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
        } else {
          // lleva paciente al hospital más cercano
          const city = useCityStore()
          const hospitals = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'hospital')
          let bestH = null, bestD = Infinity
          for (const h of hospitals) {
            const b = { x: h.x + 1, y: h.y + 1 }
            const d = Math.abs(b.x - v.x) + Math.abs(b.y - v.y)
            if (d < bestD) { bestD = d; bestH = b }
          }
          if (bestH) {
            if (bestD <= 2) {
              // entrega: quita ambulancia paciente o la recicla
              v.hasPatient = false
              // opcional despawn si muchos
            } else {
              const step = stepTowards(v, bestH, false)
              if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
            }
          } else {
            const step = randomStep(v, false)
            if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
          }
        }
        continue
      }
      // buscar accidente más cercano
      let best = null, bestD = Infinity
      for (const a of activeAccidents) {
        const d = Math.abs(a.x - v.x) + Math.abs(a.y - v.y)
        if (d < bestD) { bestD = d; best = a }
      }
      if (best) {
        if (bestD <= 1) {
          // recoger: elimina accidente y marca paciente
          const idx = accidents.value.findIndex(a => a.id === best.id)
          if (idx !== -1) accidents.value.splice(idx, 1)
          v.hasPatient = true
          // también cura peatones heridos cercanos
          const injured = pedestrians.value.find(p => p.injured && Math.abs(p.x-best.x)+Math.abs(p.y-best.y)<=1)
          if (injured) {
            const i = pedestrians.value.findIndex(p=>p.id===injured.id)
            if (i!==-1) pedestrians.value.splice(i,1)
          }
        } else {
          const step = stepTowards(v, best, false)
          if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
        }
      } else {
        const step = randomStep(v, false)
        if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
      }
    }

    // Peatones heridos no se mueven, civiles normales sí (incluye criminales ya movidos arriba, evitamos doble)
    // civiles caminan despacio; si ven criminal a ≤3, corren despavoridos
    const handledKinds = new Set(['police','soldier','criminal'])
    for (const p of pedestrians.value) {
      if (handledKinds.has(p.kind)) continue
      if (p.injured) continue
      // civil ve criminal cerca → corre
      const nearCriminal = criminals.find(c => Math.abs(c.x - p.x) + Math.abs(c.y - p.y) <= 3)
      if (nearCriminal) {
        p.isRunning = true; p.speed = 600
        // huye en dirección opuesta al criminal si es posible
        const away = { x: p.x + Math.sign(p.x - nearCriminal.x), y: p.y + Math.sign(p.y - nearCriminal.y) }
        const stepAway = stepTowards(p, away, false)
        if (stepAway) { p.x += stepAway.dx; p.y += stepAway.dy; p.dir = stepAway.dir; continue }
      } else {
        p.isRunning = false; p.speed = p.baseSpeed || 1250
      }
      if (p.kind === 'medic' || p.kind === 'fireman') {
        // médicos van a accidentes si hay (corren)
        if (activeAccidents.length > 0) {
          let best=null, bestD=Infinity
          for (const a of activeAccidents) {
            const d=Math.abs(a.x-p.x)+Math.abs(a.y-p.y)
            if(d<bestD && d<=10){bestD=d;best=a}
          }
          if(best){
            p.isRunning = true; p.speed = 700
            if(bestD<=1){
              const idx=accidents.value.findIndex(a=>a.id===best.id)
              if(idx!==-1) accidents.value.splice(idx,1)
            } else {
              const step=stepTowards(p,best,false)
              if(step){p.x+=step.dx;p.y+=step.dy;p.dir=step.dir; continue}
            }
          }
        }
      }
      const step = randomStep(p, false)
      if (step) { p.x += step.dx; p.y += step.dy; p.dir = step.dir }
    }
    for (const v of vehicles.value) {
      if (v.type==='police_car' || v.type==='ambulance' || v.type==='army_jeep' || v.type==='tank') continue
      const step = randomStep(v, false)
      if (step) { v.x += step.dx; v.y += step.dy; v.dir = step.dir }
    }
    for (const t of trains.value) {
      const step = randomStep(t, true)
      if (step) { t.x += step.dx; t.y += step.dy; t.dir = step.dir }
    }
  }

  function clear() { vehicles.value = []; pedestrians.value = []; trains.value = []; accidents.value = []; airportPlanes.value = [] }

  return { vehicles, pedestrians, trains, accidents, airportPlanes, addVehicle, addPedestrian, addAccident, addAirportPlane, tick, clear }
})
