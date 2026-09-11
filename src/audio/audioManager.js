/**
 * src/audio/audioManager.js
 * Fachada central — orquesta Music + Ambient + Effects
 * El store NO importa esto. El audio escucha eventos del store.
 *
 *              AudioManager
 *                   │
 *          ┌────────┴────────┐
 *          ↓                 ↓
 *     🎵 Music           🌆 World Audio
 *                           │
 *                 ┌─────────┼─────────┐
 *                 ↓         ↓         ↓
 *              tráfico   fábrica   naturaleza
 */

import { createMusicManager } from './musicManager.js'
import { createAmbientManager } from './ambientManager.js'
import { createSoundEffects } from './soundEffects.js'

let instance = null

export function useAudioManager() {
  if (instance) return instance

  const music = createMusicManager()
  const ambient = createAmbientManager()
  const effects = createSoundEffects()

  let initialized = false
  let camera = { x: 5, y: 5 } // centro del grid 10x10 por defecto

  function init() {
    if (initialized) return
    // Debe llamarse tras gesto del usuario (click)
    music.init()
    ambient.init()
    effects.init()
    initialized = true
  }

  // Volúmenes independientes — 100% separados (música no se toca al poner objetos)
  function setMusicVolume(v) { music.setVolume(v) }
  function setAmbientVolume(v) { ambient.setVolume(v) }
  function setEffectsVolume(v) { effects.setVolume(v) }

  // Eventos del juego — llamados desde useAudioEvents, no desde store
  function onBuildingPlaced(buildingId, grid) {
    init()
    // Sin ducking: música y efectos son sistemas separados (gainNodes y AudioContexts distintos)
    // Solo suena el efecto, la música sigue estable
    effects.playBuild(buildingId)
    ambient.update(grid, camera)
  }

  function onDemolish(grid) {
    init()
    effects.playDemolish()
    ambient.update(grid, camera)
  }

  function onPlaceFailed(reason) {
    init()
    effects.playError(reason)
  }

  function onTick(stats, grid) {
    // stats: { incomePerTick, hasEnergyDeficit, ... }
    if (stats.hasEnergyDeficit || stats.hasWaterDeficit) {
      effects.playDeficit()
    } else if (stats.incomePerTick > 0) {
      // Solo sonidito si hay ingresos
      // effects.playIncome(stats.incomePerTick) // opcional, puede ser molesto
    }
    // No actualizamos ambient en cada tick para no saturar; solo en cambios de grid
  }

  function onGridChanged(grid) {
    ambient.update(grid, camera)
  }

  function setCamera(x, y) {
    camera = { x, y }
  }

  // Música contextual: elegir pista según población/tick
  function updateMusicForCity(stats) {
    if (stats.totalPop > 80) music.play('city')
    else if (stats.hasEnergyDeficit) music.play('event')
    else music.play('calm')
  }

  instance = {
    // lifecycle
    init,
    // volumes
    setMusicVolume,
    setAmbientVolume,
    setEffectsVolume,
    // getters para UI
    get music() { return music },
    get ambient() { return ambient },
    get effects() { return effects },
    // events
    onBuildingPlaced,
    onDemolish,
    onPlaceFailed,
    onTick,
    onGridChanged,
    setCamera,
    updateMusicForCity
  }

  return instance
}
