import { useCityStore } from '@/stores/cityStore.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { BUILDING_TYPES } from '@/constants/buildings.js'
import { PERFORMANCE_PRESETS } from '@/config/performance.js'
import { usePerformance } from '@/composables/usePerformance.js'

function findRoadNear(city, ox, oy, w = 1, h = 1) {
  // busca carretera en anillo alrededor del edificio
  const radius = 3
  let best = null
  let bestDist = Infinity
  for (let dy = -radius; dy < h + radius; dy++) {
    for (let dx = -radius; dx < w + radius; dx++) {
      // solo borde exterior
      if (dx >= 0 && dx < w && dy >= 0 && dy < h) continue
      const x = ox + dx
      const y = oy + dy
      const cell = city.getCell(x, y)
      if (!cell) continue
      const isRoad = cell.hasRoad || ['road','dirt_road','concrete_road','cobble_road'].includes(cell.buildingId)
      if (!isRoad) continue
      const dist = Math.abs(dx - w/2) + Math.abs(dy - h/2)
      if (dist < bestDist) { bestDist = dist; best = { x, y } }
    }
  }
  return best
}

export function useServiceSpawns(opts = {}) {
  const city = useCityStore()
  const traffic = useTrafficStore()
  let timer = null
  // performance caps
  let perfRef = null
  try { perfRef = usePerformance() } catch {}

  function getCaps() {
    try {
      const p = perfRef ? perfRef.preset.value : PERFORMANCE_PRESETS.medium
      return p
    } catch { return PERFORMANCE_PRESETS.medium }
  }

  function tick() {
    const caps = getCaps()
    // si ya hay demasiadas entidades, no spawnear más (ahorro móvil)
    const totalPeds = traffic.pedestrians.length
    const totalVehs = traffic.vehicles.length
    const canSpawnPed = totalPeds < caps.maxPedestrians
    const canSpawnVeh = totalVehs < caps.maxVehicles
    // solo en modo libre playing — el caller verifica appState
    const policeOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'police_station')
    const hospitalOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'hospital')
    const fireOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'fire_station')
    const prisonOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'prison')

    // policía — patrulla cada ~18-25s, policía a pie cada ~12s
    for (const o of policeOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const w = b.width || 2, h = b.height || 2
      const road = findRoadNear(city, o.x, o.y, w, h)
      if (!road) continue

      const policeCars = traffic.vehicles.filter(v => v.type === 'police_car').length
      const policePeds = traffic.pedestrians.filter(p => p.kind === 'police').length
      const maxCars = Math.min(8, policeOrigins.length * 2 + 1)
      const maxPeds = Math.min(10, policeOrigins.length * 3)

      if (canSpawnPed && policePeds < maxPeds && Math.random() < 0.22) {
        traffic.addPedestrian(road.x, road.y, 'police')
      }
      if (canSpawnVeh && policeCars < maxCars && Math.random() < 0.14) {
        traffic.addVehicle(road.x, road.y, 'police_car')
      }
    }

    // hospital — ambulancia cada ~25-35s, médico a pie cada ~14s
    for (const o of hospitalOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const w = b.width || 3, h = b.height || 2
      const road = findRoadNear(city, o.x, o.y, w, h)
      if (!road) continue

      const ambulances = traffic.vehicles.filter(v => v.type === 'ambulance').length
      const medics = traffic.pedestrians.filter(p => p.kind === 'medic').length
      const maxAmb = Math.min(6, hospitalOrigins.length * 2)
      const maxMed = Math.min(8, hospitalOrigins.length * 3)

      if (canSpawnPed && medics < maxMed && Math.random() < 0.20) {
        traffic.addPedestrian(road.x, road.y, 'medic')
      }
      if (canSpawnVeh && ambulances < maxAmb && Math.random() < 0.10) {
        traffic.addVehicle(road.x, road.y, 'ambulance')
      }
    }

    // bomberos — opcional, más raro
    for (const o of fireOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const w = b.width || 2, h = b.height || 2
      const road = findRoadNear(city, o.x, o.y, w, h)
      if (!road) continue
      const fireTrucks = traffic.vehicles.filter(v => v.type === 'fire_truck').length
      const firemen = traffic.pedestrians.filter(p => p.kind === 'fireman').length
      if (canSpawnPed && firemen < fireOrigins.length * 2 && Math.random() < 0.15) {
        traffic.addPedestrian(road.x, road.y, 'fireman')
      }
      if (canSpawnVeh && fireTrucks < fireOrigins.length * 1 && Math.random() < 0.08) {
        traffic.addVehicle(road.x, road.y, 'fire_truck')
      }
    }

    // prisión → delincuentes fugados (1 cada 20-30s, max 3 por cárcel)
    for (const o of prisonOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const w = b.width || 3, h = b.height || 3
      const road = findRoadNear(city, o.x, o.y, w, h)
      if (!road) continue
      const criminals = traffic.pedestrians.filter(p => p.kind === 'criminal').length
      const maxCrim = Math.min(9, prisonOrigins.length * 3)
      if (canSpawnPed && criminals < maxCrim && Math.random() < 0.18) {
        traffic.addPedestrian(road.x, road.y, 'criminal')
      }
    }

    // escuela → estudiantes con mochila
    const schoolOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'school')
    for (const o of schoolOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const road = findRoadNear(city, o.x, o.y, b.width, b.height)
      if (!road) continue
      const students = traffic.pedestrians.filter(p => p.kind === 'student').length
      const maxStu = Math.min(10, schoolOrigins.length * 4)
      if (canSpawnPed && students < maxStu && Math.random() < 0.24) {
        traffic.addPedestrian(road.x, road.y, 'student')
      }
    }

    // universidad → estudiantes uni
    const uniOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'university')
    for (const o of uniOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const road = findRoadNear(city, o.x, o.y, b.width, b.height)
      if (!road) continue
      const uni = traffic.pedestrians.filter(p => p.kind === 'uni_student').length
      const maxUni = Math.min(10, uniOrigins.length * 4)
      if (canSpawnPed && uni < maxUni && Math.random() < 0.22) {
        traffic.addPedestrian(road.x, road.y, 'uni_student')
      }
    }

    // juzgado → abogados y jueces
    const courtOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'courthouse')
    for (const o of courtOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const road = findRoadNear(city, o.x, o.y, b.width, b.height)
      if (!road) continue
      const lawyers = traffic.pedestrians.filter(p => p.kind === 'lawyer').length
      const judges = traffic.pedestrians.filter(p => p.kind === 'judge').length
      const maxLaw = Math.min(6, courtOrigins.length * 2)
      const maxJud = Math.min(4, courtOrigins.length * 1)
      if (canSpawnPed && lawyers < maxLaw && Math.random() < 0.18) traffic.addPedestrian(road.x, road.y, 'lawyer')
      if (canSpawnPed && judges < maxJud && Math.random() < 0.10) traffic.addPedestrian(road.x, road.y, 'judge')
    }

    // terminal buses → spawnea buses en pavimento
    const busOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'bus_terminal')
    for (const o of busOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const road = findRoadNear(city, o.x, o.y, b.width, b.height)
      if (!road) continue
      const buses = traffic.vehicles.filter(v => v.type === 'bus').length
      const maxBus = Math.min(8, busOrigins.length * 3)
      if (canSpawnVeh && buses < maxBus && Math.random() < 0.20) traffic.addVehicle(road.x, road.y, 'bus')
    }

    // concesionaria autos → spawnea autos
    const carDealOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'car_dealership')
    for (const o of carDealOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const road = findRoadNear(city, o.x, o.y, b.width, b.height)
      if (!road) continue
      const cars = traffic.vehicles.filter(v => v.type === 'car').length
      const maxCar = Math.min(10, carDealOrigins.length * 4)
      if (canSpawnVeh && cars < maxCar && Math.random() < 0.26) traffic.addVehicle(road.x, road.y, 'car')
    }

    // concesionaria motos → ciudadano en moto (moto con piloto)
    const motoDealOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === 'moto_dealership')
    for (const o of motoDealOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const road = findRoadNear(city, o.x, o.y, b.width, b.height)
      if (!road) continue
      const motos = traffic.vehicles.filter(v => v.type === 'moto').length
      const maxMoto = Math.min(8, motoDealOrigins.length * 3)
      if (canSpawnVeh && motos < maxMoto && Math.random() < 0.28) {
        traffic.addVehicle(road.x, road.y, 'moto')
        // a veces también peatón moto cercano para efecto ciudadano montando
        if (Math.random() < 0.35) traffic.addPedestrian(road.x, road.y, 'man')
      }
    }

    // accidentes aleatorios de peatones/ciudadanos — 6% por tick si hay peatones
    if (traffic.pedestrians.length >= 6 && traffic.accidents.length < caps.maxAccidents && Math.random() < 0.06) {
      // elige peatón civil al azar para accidentarse cerca de carretera
      const civilians = traffic.pedestrians.filter(p => !['police','medic','fireman','criminal','student','uni_student','lawyer','judge'].includes(p.kind) && !p.injured)
      if (civilians.length > 0) {
        const victim = civilians[Math.floor(Math.random()*civilians.length)]
        // marca como herido y crea accidente en su posición
        victim.injured = true
        victim.speed = 9999 // no se mueve
        traffic.addAccident(victim.x, victim.y)
      } else if (Math.random() < 0.5) {
        // accidente sin víctima directa: en carretera aleatoria
        const roadCells = city.flatGrid.filter(c => c.hasRoad || ['road','dirt_road','concrete_road','cobble_road'].includes(c.buildingId))
        if (roadCells.length > 0) {
          const rc = roadCells[Math.floor(Math.random()*roadCells.length)]
          traffic.addAccident(rc.x, rc.y)
        }
      }
    }

    // aeropuertos → aviones diagonal (aterriza/despega) cada ~10-15s, efecto en X
    const airportOrigins = city.flatGrid.filter(c => c.isOrigin && (c.buildingId==='airport' || c.buildingId==='intl_airport'))
    for (const o of airportOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      if (traffic.airportPlanes.length >= caps.maxPlanes) continue
      if (Math.random() < 0.18) {
        const type = Math.random() < 0.5 ? 'landing' : 'takeoff'
        traffic.addAirportPlane(o.x, o.y, b.width, b.height, type)
      }
    }

    // colegio militar → soldados a pie y vehículos ejército (jeep/tanque)
    const milOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId==='military_academy')
    for (const o of milOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const road = findRoadNear(city, o.x, o.y, b.width, b.height)
      if (!road) continue
      const soldiers = traffic.pedestrians.filter(p => p.kind==='soldier').length
      const jeeps = traffic.vehicles.filter(v => v.type==='army_jeep').length
      const tanks = traffic.vehicles.filter(v => v.type==='tank').length
      const maxSold = Math.min(10, milOrigins.length * 4)
      const maxJeep = Math.min(6, milOrigins.length * 2)
      const maxTank = Math.min(3, milOrigins.length * 1)
      if (canSpawnPed && soldiers < maxSold && Math.random() < 0.26) traffic.addPedestrian(road.x, road.y, 'soldier')
      if (canSpawnVeh && jeeps < maxJeep && Math.random() < 0.16) traffic.addVehicle(road.x, road.y, 'army_jeep')
      if (canSpawnVeh && tanks < maxTank && Math.random() < 0.08) traffic.addVehicle(road.x, road.y, 'tank')
    }

    // arsenal → tractores → cañones de guerra
    const arsenalOrigins = city.flatGrid.filter(c => c.isOrigin && c.buildingId==='arsenal')
    for (const o of arsenalOrigins) {
      const b = BUILDING_TYPES[o.buildingId]
      const road = findRoadNear(city, o.x, o.y, b.width, b.height)
      if (!road) continue
      const tractors = traffic.vehicles.filter(v => v.type==='tractor').length
      const cannons = traffic.vehicles.filter(v => v.type==='cannon').length
      const maxTrac = Math.min(6, arsenalOrigins.length * 3)
      const maxCan = Math.min(4, arsenalOrigins.length * 2)
      if (canSpawnVeh && tractors < maxTrac && Math.random() < 0.22) traffic.addVehicle(road.x, road.y, 'tractor')
      if (canSpawnVeh && cannons < maxCan && Math.random() < 0.12) traffic.addVehicle(road.x, road.y, 'cannon')
    }
  }

  function start(interval = null) {
    if (timer) clearInterval(timer)
    const ms = interval ?? getCaps().serviceSpawnMs ?? 9000
    timer = setInterval(tick, ms)
    // primer tick rápido a los 4s si hay estaciones
    setTimeout(tick, 4000)
  }
  function stop() { if (timer) clearInterval(timer); timer = null }

  return { start, stop, tick }
}
