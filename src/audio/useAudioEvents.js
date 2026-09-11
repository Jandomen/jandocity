/**
 * src/audio/useAudioEvents.js
 * Puente desacoplado: escucha el cityStore y dispara audioManager
 * El store nunca importa audio. Este composable sí.
 * Usar en App.vue: useAudioEvents(city)
 */

import { useAudioManager } from './audioManager.js'

export function useAudioEvents(cityStore) {
  const audio = useAudioManager()

  // Inicializar AudioContext al primer gesto del usuario
  function ensureInit() {
    audio.init()
  }

  // Efectos cortos al construir / pintar terreno — cada clasificación con su sonidito
  cityStore.$onAction(({ name, args, after }) => {
    after((result) => {
      if (name === 'placeBuilding') {
        if (result?.ok) {
          const [x, y] = args
          const cell = cityStore.getCell(x, y)
          ensureInit()
          audio.effects.playBuild(cell?.buildingId)
        } else if (result?.reason) {
          ensureInit()
          audio.effects.playError(result.reason)
        }
      }
      if (name === 'demolish') {
        if (result?.ok) {
          ensureInit()
          audio.effects.playDemolish()
        }
      }
      if (['paintTerrain','setTerrain','fillTerrain'].includes(name)) {
        if (result?.ok) {
          ensureInit()
          const t = args[2] || args[1] || 'grass'
          const map = { water: 'water', deep_water: 'water', sand: 'rock', forest: 'tree', grass: 'bush' }
          audio.effects.playBuild(map[t] || 'bush')
        } else if (result?.reason) {
          ensureInit()
          audio.effects.playError(result.reason)
        }
      }
    })
  })

  // Exponer controles para UI
  return audio
}
