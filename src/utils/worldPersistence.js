/**
 * worldPersistence.js — gestión multi-mundo local
 * Cada mundo: { id, name, createdAt, updatedAt, data: saveData (sparse) }
 * Se guarda en localStorage bajo jandocity-worlds-v1
 * Compatible con save antiguo jandocity-save-v1 (migra a mundo "Mundo principal")
 */
import { GRID_SIZE } from '@/constants/buildings.js'

const WORLDS_KEY = 'jandocity-worlds-v1'
const ACTIVE_KEY = 'jandocity-active-world'

function uid() {
  return 'world_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6)
}

function createFreshGridData(seed = Date.now()) {
  const size = GRID_SIZE
  const half = Math.floor(size / 2)
  // sparse vacío = grid sin edificios, equivale a mapa limpio
  return {
    version: 16,
    sparse: [],
    gridSize: size,
    gridWidth: size,
    offsetX: -half,
    offsetY: -half,
    terrainSeed: seed,
    money: 1500,
    tickCount: 0,
    selectedTool: 'residential',
    savedAt: Date.now()
  }
}

export function loadWorlds() {
  try {
    const raw = localStorage.getItem(WORLDS_KEY)
    if (!raw) {
      // migrar save antiguo si existe
      const legacy = localStorage.getItem('jandocity-save-v1')
      if (legacy) {
        try {
          const data = JSON.parse(legacy)
          if (data && (Array.isArray(data.sparse) || Array.isArray(data.grid))) {
            const sparse = Array.isArray(data.sparse) ? data.sparse : []
            // si legacy era grid denso, convertir a sparse vacío no ideal pero al menos preserva
            const world = {
              id: uid(),
              name: 'Mundo principal',
              createdAt: data.savedAt || Date.now(),
              updatedAt: Date.now(),
              data: data.sparse ? data : { ...createFreshGridData(data.terrainSeed), sparse, gridSize: data.length || GRID_SIZE }
            }
            const worlds = [world]
            localStorage.setItem(WORLDS_KEY, JSON.stringify(worlds))
            return worlds
          }
        } catch {}
      }
      return []
    }
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch (e) {
    console.error('[Worlds] load error', e)
    return []
  }
}

export function saveWorlds(worlds) {
  try {
    localStorage.setItem(WORLDS_KEY, JSON.stringify(worlds))
    return true
  } catch (e) {
    console.error('[Worlds] save error', e)
    return false
  }
}

export function createWorld(name) {
  const trimmed = (name || '').trim() || `Mundo ${loadWorlds().length + 1}`
  // nombre único si colisiona
  const worlds = loadWorlds()
  let finalName = trimmed
  let c = 1
  while (worlds.some(w => w.name === finalName)) {
    finalName = `${trimmed} ${++c}`
  }
  const world = {
    id: uid(),
    name: finalName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    data: createFreshGridData()
  }
  worlds.unshift(world)
  saveWorlds(worlds)
  return world
}

export function deleteWorld(id) {
  const worlds = loadWorlds().filter(w => w.id !== id)
  saveWorlds(worlds)
  // si era activo, limpiar
  if (getActiveWorldId() === id) clearActiveWorldId()
  return worlds
}

export function updateWorldData(id, newData) {
  const worlds = loadWorlds()
  const idx = worlds.findIndex(w => w.id === id)
  if (idx === -1) return null
  worlds[idx].data = newData
  worlds[idx].updatedAt = Date.now()
  saveWorlds(worlds)
  return worlds[idx]
}

export function renameWorld(id, newName) {
  const worlds = loadWorlds()
  const w = worlds.find(x => x.id === id)
  if (w) {
    w.name = newName.trim() || w.name
    w.updatedAt = Date.now()
    saveWorlds(worlds)
  }
  return w
}

export function getWorld(id) {
  return loadWorlds().find(w => w.id === id) || null
}

export function setActiveWorldId(id) {
  try { localStorage.setItem(ACTIVE_KEY, id) } catch {}
}
export function getActiveWorldId() {
  try { return localStorage.getItem(ACTIVE_KEY) } catch { return null }
}
export function clearActiveWorldId() {
  try { localStorage.removeItem(ACTIVE_KEY) } catch {}
}

export function touchWorld(id) {
  const worlds = loadWorlds()
  const w = worlds.find(x => x.id === id)
  if (w) { w.updatedAt = Date.now(); saveWorlds(worlds) }
}
