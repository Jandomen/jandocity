import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCityStore } from './cityStore.js'
import { CHARACTERS, getCharacter } from '@/config/characters.js'

export const usePlayerStore = defineStore('player', () => {
  const x = ref(0)
  const y = ref(0)
  const dir = ref('down')
  const isMoving = ref(false)
  const characterId = ref(localStorage.getItem('jandocity-character') || 'exec_male')
  const character = computed(() => getCharacter(characterId.value) || CHARACTERS[0])

  const pixelPos = computed(() => {
    const city = useCityStore()
    const ox = city.offsetX ?? city.grid[0]?.[0]?.x ?? 0
    const oy = city.offsetY ?? city.grid[0]?.[0]?.y ?? 0
    return { x: (x.value - ox) * 48 + 24, y: (y.value - oy) * 48 + 24 }
  })

  function move(dx, dy, grid) {
    const nx = x.value + dx
    const ny = y.value + dy
    const city = useCityStore()
    const cell = city.getCell(nx, ny)
    if (!cell) return false
    const ROAD_IDS = ['road','dirt_road','concrete_road','cobble_road','rail']
    const WALKABLE_PLANTS = ['tree','oak','pine','palm','ceiba','bush','flower','park','hedge','rock']
    if (cell.buildingId && !ROAD_IDS.includes(cell.buildingId) && !WALKABLE_PLANTS.includes(cell.buildingId)) return false
    const isWater = cell.terrain === 'water' || cell.terrainType === 'water' || cell.terrain === 'deep_water' || cell.terrainType === 'deep_water'
    if (isWater && !ROAD_IDS.includes(cell.buildingId)) return false
    x.value = nx
    y.value = ny
    if (dx === 1) dir.value = 'right'
    else if (dx === -1) dir.value = 'left'
    else if (dy === -1) dir.value = 'up'
    else if (dy === 1) dir.value = 'down'
    isMoving.value = true
    setTimeout(() => isMoving.value = false, 70)
    // Revela niebla al pisar (expansión ahora manual con I)
    try {
      const city = useCityStore()
      city.updateFogOfWar(nx, ny, 4)
    } catch {}
    return true
  }

  function setPos(nx, ny) { x.value = nx; y.value = ny }

  function setCharacter(id) {
    if (!CHARACTERS.find(c=>c.id===id)) return false
    characterId.value = id
    try { localStorage.setItem('jandocity-character', id) } catch {}
    return true
  }

  return { x, y, dir, isMoving, pixelPos, characterId, character, setCharacter, move, setPos }
})
