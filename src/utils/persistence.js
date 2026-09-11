const STORAGE_KEY = 'jandocity-save-v1'

export function saveGame(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('[Jandocity] Error guardando partida:', error)
    return false
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    if (Array.isArray(data.sparse)) return data
    if (!Array.isArray(data.grid)) return null
    return data
  } catch (error) {
    console.error('[Jandocity] Error cargando partida:', error)
    return null
  }
}

export function deleteSave() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error(
      '[Jandocity] Error eliminando partida:',
      error
    )
  }
}
