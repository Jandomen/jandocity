/**
 * src/composables/useRoads.js
 * Sistema de carreteras por PIEZAS — autotile
 * Determina sprite según conexiones vecinas (N/S/E/W)
 * 0 → isolated, 1 → end, 2 opuestas → straight, 2 perpendiculares → curve, 3 → T, 4 → cross
 */

export const ROAD_PIECES = {
  isolated: { id: 'isolated', rot: 0 },
  end_n: { id: 'end', rot: 0 }, // mira al norte
  end_s: { id: 'end', rot: 180 },
  end_e: { id: 'end', rot: 90 },
  end_w: { id: 'end', rot: 270 },
  straight_h: { id: 'straight', rot: 0 }, // E-W
  straight_v: { id: 'straight', rot: 90 }, // N-S
  curve_ne: { id: 'curve', rot: 0 },
  curve_nw: { id: 'curve', rot: 270 },
  curve_se: { id: 'curve', rot: 90 },
  curve_sw: { id: 'curve', rot: 180 },
  t_n: { id: 't', rot: 0 }, // falta S
  t_s: { id: 't', rot: 180 },
  t_e: { id: 't', rot: 90 },
  t_w: { id: 't', rot: 270 },
  cross: { id: 'cross', rot: 0 }
}

export function isRoad(grid, x, y) {
  return grid[y]?.[x]?.buildingId === 'road'
}

/**
 * Máscara de conexiones: {n,s,e,w} boolean
 */
export function getRoadConnections(grid, x, y) {
  return {
    n: isRoad(grid, x, y - 1),
    s: isRoad(grid, x, y + 1),
    e: isRoad(grid, x + 1, y),
    w: isRoad(grid, x - 1, y)
  }
}

/**
 * Dado {n,s,e,w}, devuelve pieza + rotación
 */
export function getRoadPiece(grid, x, y) {
  if (!isRoad(grid, x, y)) return null

  const { n, s, e, w } = getRoadConnections(grid, x, y)
  const count = [n, s, e, w].filter(Boolean).length

  if (count === 0) return ROAD_PIECES.isolated
  if (count === 1) {
    if (n) return ROAD_PIECES.end_s // solo N → extremo mira al S? convención: end_s es final al sur (conecta N)
    if (s) return ROAD_PIECES.end_n
    if (e) return ROAD_PIECES.end_w
    if (w) return ROAD_PIECES.end_e
  }
  if (count === 2) {
    if (n && s) return ROAD_PIECES.straight_v
    if (e && w) return ROAD_PIECES.straight_h
    if (n && e) return ROAD_PIECES.curve_ne
    if (n && w) return ROAD_PIECES.curve_nw
    if (s && e) return ROAD_PIECES.curve_se
    if (s && w) return ROAD_PIECES.curve_sw
  }
  if (count === 3) {
    if (!n) return ROAD_PIECES.t_n // falta N
    if (!s) return ROAD_PIECES.t_s
    if (!e) return ROAD_PIECES.t_e
    if (!w) return ROAD_PIECES.t_w
  }
  if (count === 4) return ROAD_PIECES.cross

  return ROAD_PIECES.isolated
}

/**
 * Para invalidación: recomienda si una celda puede ser carretera visualmente conectada
 * (usado por preview)
 */
export function getRoadPreviewConnections(grid, x, y) {
  // Simula que (x,y) será road
  const mockGrid = grid.map(row => [...row])
  // No mutar, solo calcular máscara incluyendo la futura
  const n = isRoad(grid, x, y - 1)
  const s = isRoad(grid, x, y + 1)
  const e = isRoad(grid, x + 1, y)
  const w = isRoad(grid, x - 1, y)
  return { n, s, e, w }
}
