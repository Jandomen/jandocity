import { useCityStore } from '@/stores/cityStore.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useBuildQueue } from '@/composables/useBuildQueue.js'
import { useUnitQueue } from '@/composables/useUnitQueue.js'

export function useVictory() {
  const city = useCityStore()
  const traffic = useTrafficStore()
  const single = useSinglePlayerStore()
  const everAlive = new Set()

  function countFor(playerId) {
    const buildings = city.flatGrid.filter(c => c.isOrigin && c.owner === playerId).length
    const peds = traffic.pedestrians.filter(p => p.owner === playerId).length
    const vehs = traffic.vehicles.filter(v => v.owner === playerId).length
    return { buildings, units: peds + vehs, total: buildings + peds + vehs }
  }

  function check() {
    if (!single.isActive) return null
    // 30 min de gracia como pediste: no calcula victoria hasta entonces
    const elapsed = single.startedAt ? (Date.now() - single.startedAt) / 1000 : 0
    if (elapsed < 1800) return null // 30*60
    // no hay derrota hasta que hayas construido algo por primera vez
    if (!single.hasEverBuilt) return null
    // registra quién ha estado vivo alguna vez (para no dar victoria instantánea)
    for (const p of single.players) {
      if (countFor(p.id).total > 0) everAlive.add(p.id)
      if (useBuildQueue().queue.value.some(q=>q.owner===p.id) || useUnitQueue().queue.value.some(q=>q.owner===p.id)) everAlive.add(p.id)
    }
    if (everAlive.size < 2) return null // aún no han jugado todos
    const bq = useBuildQueue()
    const uq = useUnitQueue()
    const humanId = single.humanPlayer()?.id
    const humanHasQueue = bq.queue.value.some(q=>q.owner===humanId) || uq.queue.value.some(q=>q.owner===humanId)
    const players = single.players
    // cuenta por jugador (si tienes cola, te consideramos vivo aunque total 0)
    function aliveWithQueue(p) {
      const c = countFor(p.id)
      if (c.total > 0) return true
      if (p.id === humanId && humanHasQueue) return true
      // CPU también necesita gracia: si tiene cola, vivo
      if (bq.queue.value.some(q=>q.owner===p.id) || uq.queue.value.some(q=>q.owner===p.id)) return true
      return false
    }
    const alive = players.filter(p => aliveWithQueue(p))
    if (alive.length === 0) return null // nadie, empate raro
    if (alive.length === 1) {
      const winner = alive[0]
      const isWin = winner.isHuman
      return { winner, isWin, alive }
    }
    // 2vs2: equipos
    const teamA = players.filter(p => p.team === 'A')
    const teamB = players.filter(p => p.team === 'B')
    const aliveA = teamA.filter(p => aliveWithQueue(p)).length
    const aliveB = teamB.filter(p => aliveWithQueue(p)).length
    if (aliveA === 0 && aliveB > 0) {
      const winner = teamB[0]
      return { winner, isWin: winner.isHuman, alive: teamB.filter(p=>aliveWithQueue(p)) }
    }
    if (aliveB === 0 && aliveA > 0) {
      const winner = teamA[0]
      return { winner, isWin: winner.isHuman, alive: teamA.filter(p=>aliveWithQueue(p)) }
    }
    return null
  }

  function metrics() {
    const humanId = single.humanPlayer()?.id
    const human = countFor(humanId)
    let cpuB = 0, cpuU = 0
    for (const p of single.players.filter(pl=>!pl.isHuman)) {
      const c = countFor(p.id)
      cpuB += c.buildings
      cpuU += c.units
    }
    const elapsed = single.startedAt ? Math.floor((Date.now() - single.startedAt)/1000) : 0
    const m = Math.floor(elapsed/60), s = elapsed%60
    return {
      humanBuildings: human.buildings,
      humanUnits: human.units,
      cpuBuildings: cpuB,
      cpuUnits: cpuU,
      time: `${m}:${String(s).padStart(2,'0')}`,
      humanColor: single.players.find(p=>p.id===humanId)?.color || 'azul',
      eliminated: single.players.length - single.players.filter(p=>countFor(p.id).total>0).length
    }
  }

  return { check, metrics, countFor }
}
