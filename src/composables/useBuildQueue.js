import { ref } from 'vue'
import { BUILDING_TYPES } from '@/constants/buildings.js'
import { useCityStore } from '@/stores/cityStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useMultiplayerSync } from '@/composables/useMultiplayerSync.js'
import { APP_URL } from '@/config.js'

const VEGETATION = new Set(['tree','oak','pine','palm','ceiba','bush','flower','rock','park'])
const ROADS = new Set(['road','dirt_road','concrete_road','cobble_road','rail'])

const queue = ref([]) // singleton global
let idc = 1

export function useBuildQueue() {

  function durationFor(buildingId) {
    if (VEGETATION.has(buildingId)) return 0 // instant
    if (ROADS.has(buildingId)) return 1500 // 1.5s rápido pero visible con barra
    const b = BUILDING_TYPES[buildingId]
    const area = (b?.width || 1) * (b?.height || 1)
    if (area <= 1) return 3000
    if (area <= 2) return 4500
    if (area <= 4) return 7000
    if (area <= 9) return 11000
    return 15000 // 5x5 etc
  }

  function add(x, y, buildingId, owner = 'p0') {
    const b = BUILDING_TYPES[buildingId]
    if (!b) return null
    const w = b?.width || 1, h = b?.height || 1
    const dur = durationFor(buildingId)
    if (!dur || isNaN(dur) || dur === 0) return null // instant, no cola
    // cobra al encolar (reserva)
    try {
      const city = useCityStore()
      const cost = b?.cost || 0
      if (city.money < cost) return null
      city.money -= cost
    } catch {}
    const item = { id: idc++, x, y, buildingId, owner, progress: 0, duration: dur, w, h, startedAt: Date.now() }
    queue.value.push(item)
    return item
  }

  function tick(deltaMs) {
    for (let i = queue.value.length - 1; i >= 0; i--) {
      const it = queue.value[i]
      // limpia NaN / corruptos que quedaron antes del fix
      if (it.progress === undefined || isNaN(it.progress) || !it.duration || isNaN(it.duration)) { queue.value.splice(i,1); continue }
      it.progress = Math.min(100, it.progress + (deltaMs / it.duration) * 100)
      if (isNaN(it.progress)) { queue.value.splice(i,1); continue }
      if (it.progress >= 100) {
        try {
          const city = useCityStore()
          city.forcePlaceBuilding(it.x, it.y, it.buildingId, it.owner)
          try { const single = useSinglePlayerStore(); if (it.owner === single.humanPlayer()?.id) single.hasEverBuilt = true } catch {}
          // multi 8 — broadcast vía APP_URL prod https://jandocity.vercel.app
          try { useMultiplayerSync().broadcastBuild(it.x, it.y, it.buildingId, it.owner); console.log('[Multi] build', it.buildingId, '->', APP_URL) } catch {}
        } catch {}
        queue.value.splice(i, 1)
      }
    }
  }

  function remove(id) { queue.value = queue.value.filter(q => q.id !== id) }
  function clear() { queue.value = [] }
  function findAt(x, y) { return queue.value.find(q => q.x === x && q.y === y) }

  return { queue, add, tick, remove, clear, findAt, durationFor }
}
