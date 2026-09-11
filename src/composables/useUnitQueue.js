import { ref } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { BUILDING_TYPES } from '@/constants/buildings.js'

const queue = ref([]) // {id, bx,by, buildingId, unitType, progress, duration, owner}
let idc = 1

const DURATIONS = {
  police: 2800,
  police_car: 4000,
  soldier: 2500,
  soldier_heavy: 3200,
  army_jeep: 3800,
  tank: 6500,
  tractor: 3000,
  cannon: 5500,
}

function findRoadNear(city, ox, oy, w, h) {
  const radius = 3
  let best = null, bestD = Infinity
  for (let dy = -radius; dy < h + radius; dy++) for (let dx = -radius; dx < w + radius; dx++) {
    if (dx >= 0 && dx < w && dy >= 0 && dy < h) continue
    const x = ox + dx, y = oy + dy
    const cell = city.getCell(x, y)
    if (!cell) continue
    const isRoad = cell.hasRoad || ['road','dirt_road','concrete_road','cobble_road'].includes(cell.buildingId)
    if (!isRoad) continue
    const d = Math.abs(dx - w/2) + Math.abs(dy - h/2)
    if (d < bestD) { bestD = d; best = { x, y } }
  }
  return best
}

export function useUnitQueue() {
  function enqueue(buildingId, unitType, owner = 'p0') {
    const city = useCityStore()
    // busca edificio más cercano del tipo que pertenezca al owner (si single, filtra por owner)
    const origins = city.flatGrid.filter(c => c.isOrigin && c.buildingId === buildingId && (!owner || c.owner === owner || !c.owner))
    // si no hay, busca cualquiera del tipo (para libre)
    const cand = origins.length ? origins : city.flatGrid.filter(c => c.isOrigin && c.buildingId === buildingId)
    if (cand.length === 0) return null
    // elige el más cercano al centro o primero
    const o = cand[0]
    const b = BUILDING_TYPES[buildingId]
    const w = b?.width || 1, h = b?.height || 1
    const dur = DURATIONS[unitType] || 3000
    if (!dur || isNaN(dur)) return null
    // límite cola 4 por edificio
    const perBuilding = queue.value.filter(q => q.bx === o.x && q.by === o.y).length
    if (perBuilding >= 4) return null
    // coste unitario - cobra según dueño
    const costs = { police: 30, police_car: 80, soldier: 40, soldier_heavy: 60, army_jeep: 90, tank: 180, tractor: 50, cannon: 120 }
    const cost = costs[unitType] || 30
    if (owner === 'p0') {
      if (city.money < cost) return null
      city.money -= cost
    } else {
      const single = useSinglePlayerStore()
      if (!single.canAfford(owner, cost)) return null
      single.deduct(owner, cost)
    }
    const item = { id: idc++, bx: o.x, by: o.y, buildingId, unitType, progress: 0, duration: dur, owner, w, h }
    queue.value.push(item)
    return item
  }

  function tick(deltaMs) {
    for (let i = queue.value.length - 1; i >= 0; i--) {
      const it = queue.value[i]
      if (it.progress===undefined || isNaN(it.progress) || !it.duration || isNaN(it.duration)) { queue.value.splice(i,1); continue }
      it.progress = Math.min(100, it.progress + (deltaMs / it.duration) * 100)
      if (isNaN(it.progress)) { queue.value.splice(i,1); continue }
      if (it.progress >= 100) {
        // spawnear
        try {
          const city = useCityStore()
          const traffic = useTrafficStore()
          const b = BUILDING_TYPES[it.buildingId]
          const road = findRoadNear(city, it.bx, it.by, b.width, b.height)
          if (road) {
            if (['police_car','army_jeep','tank','tractor','cannon'].includes(it.unitType)) {
              traffic.addVehicle(road.x, road.y, it.unitType)
            } else {
              // mapea soldier_heavy -> soldier con arma distinta
              const kind = it.unitType === 'soldier_heavy' ? 'soldier' : it.unitType
              traffic.addPedestrian(road.x, road.y, kind)
              // si heavy, marca isHeavy
              if (it.unitType === 'soldier_heavy') {
                const p = traffic.pedestrians[traffic.pedestrians.length-1]
                if (p) { p.isHeavy = true; p.speed = 700 }
              }
            }
          }
        } catch {}
        queue.value.splice(i, 1)
      }
    }
  }

  function clear() { queue.value = [] }
  function forBuilding(bx, by) { return queue.value.filter(q => q.bx === bx && q.by === by) }

  return { queue, enqueue, tick, clear, forBuilding }
}
