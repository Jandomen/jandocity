import { useCityStore } from '@/stores/cityStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useBuildQueue } from '@/composables/useBuildQueue.js'
import { useUnitQueue } from '@/composables/useUnitQueue.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { BUILDING_TYPES } from '@/constants/buildings.js'
import { canPlaceAt } from '@/composables/useCityEngine.js'

const BUILD_POOL = ['residential_small','police_station','military_academy','arsenal','power','road','residential','shop']

export function useSingleAI() {
  const city = useCityStore()
  const single = useSinglePlayerStore()
  const buildQueue = useBuildQueue()
  const unitQueue = useUnitQueue()
  const traffic = useTrafficStore()
  let timer = null
  let unitTimer = null
  let incomeTimer = null

  function randomBuilding() {
    return BUILD_POOL[Math.floor(Math.random()*BUILD_POOL.length)]
  }

  function statsFor(pid) {
    let pop=0, energyP=0, energyC=0, waterP=0, waterC=0, income=0
    for (const c of city.flatGrid) {
      if (!c.isOrigin || c.owner!==pid) continue
      const b = BUILDING_TYPES[c.buildingId]; if (!b) continue
      pop += b.effects.population||0
      const e=b.effects.energy||0, w=b.effects.water||0
      if (e>0) energyP+=e; else energyC+=Math.abs(e)
      if (w>0) waterP+=w; else waterC+=Math.abs(w)
      income += b.incomePerTick||0
    }
    return { pop, energyP, energyC, waterP, waterC, income, hasEnergyDeficit: energyP<energyC, hasWaterDeficit: waterP<waterC }
  }

  function chooseBuildingFor(player) {
    const s = statsFor(player.id)
    // inteligente: prioriza lo que falta
    if (s.hasEnergyDeficit) return 'power'
    if (s.hasWaterDeficit) return 'waterPlant'
    if (Math.random()<0.18) return 'road'
    const hasRoad = city.flatGrid.some(c=>c.owner===player.id && (c.hasRoad || c.buildingId==='road'))
    if (!hasRoad) return 'road'
    if (s.pop < 20 && Math.random()<0.5) return Math.random()<0.5 ? 'residential_small' : 'residential'
    if (Math.random()<0.12) return 'military_academy'
    if (Math.random()<0.10) return 'arsenal'
    if (Math.random()<0.10) return 'police_station'
    return randomBuilding()
  }

  function tryBuildFor(player) {
    const bId = chooseBuildingFor(player)
    const b = BUILDING_TYPES[bId]
    if (!b) return
    if (!single.canAfford(player.id, b.cost)) return
    const w = b.width||1, h=b.height||1
    // posición aleatoria cerca de su base dentro radio 14
    for (let tries=0; tries<14; tries++) {
      const dx = Math.floor(Math.random()*20)-10
      const dy = Math.floor(Math.random()*20)-10
      const x = player.x + dx
      const y = player.y + dy
      const ok = canPlaceAt(city.grid, x, y, bId, 999999)
      if (!ok.ok) continue
      if (buildQueue.findAt(x,y)) continue
      single.deduct(player.id, b.cost)
      const dur = buildQueue.durationFor(bId)
      if (dur===0) {
        city.forcePlaceBuilding(x,y,bId, player.id)
      } else {
        const item = { id: Date.now()+Math.random(), x, y, buildingId: bId, owner: player.id, progress: 0, duration: dur, w, h, startedAt: Date.now() }
        buildQueue.queue.value.push(item)
      }
      return
    }
  }

  function tryUnitFor(player) {
    // elige cuartel que tenga
    const hasPolice = city.flatGrid.some(c=>c.isOrigin && c.buildingId==='police_station' && c.owner===player.id)
    const hasMil = city.flatGrid.some(c=>c.isOrigin && c.buildingId==='military_academy' && c.owner===player.id)
    const hasArs = city.flatGrid.some(c=>c.isOrigin && c.buildingId==='arsenal' && c.owner===player.id)
    const opts = []
    if (hasPolice) opts.push(['police_station','police'], ['police_station','police_car'])
    if (hasMil) opts.push(['military_academy','soldier'], ['military_academy','tank'])
    if (hasArs) opts.push(['arsenal','cannon'], ['arsenal','tractor'])
    if (opts.length===0) return
    const [bId, unit] = opts[Math.floor(Math.random()*opts.length)]
    unitQueue.enqueue(bId, unit, player.id)
  }

  function start() {
    if (timer) clearInterval(timer)
    if (unitTimer) clearInterval(unitTimer)
    if (incomeTimer) clearInterval(incomeTimer)
    timer = setInterval(() => {
      if (!single.isActive) return
      for (const p of single.players.filter(pl=>!pl.isHuman)) {
        if (Math.random() < 0.45) tryBuildFor(p)
      }
    }, 6500)
    unitTimer = setInterval(() => {
      if (!single.isActive) return
      for (const p of single.players.filter(pl=>!pl.isHuman)) {
        if (Math.random() < 0.55) tryUnitFor(p)
      }
    }, 5000)
    // ingresos como tú: cada 2s según sus edificios
    incomeTimer = setInterval(() => {
      if (!single.isActive) return
      for (const p of single.players.filter(pl=>!pl.isHuman)) {
        const s = statsFor(p.id)
        let income = s.income
        if (s.hasEnergyDeficit || s.hasWaterDeficit) income = Math.floor(income * 0.5)
        single.addMoney(p.id, income)
      }
    }, 2000)
  }
  function stop() { if (timer) clearInterval(timer); if (unitTimer) clearInterval(unitTimer); if (incomeTimer) clearInterval(incomeTimer); timer=null; unitTimer=null; incomeTimer=null }

  return { start, stop }
}
