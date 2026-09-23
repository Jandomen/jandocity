import { useCityStore } from '@/stores/cityStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useBuildQueue } from '@/composables/useBuildQueue.js'
import { useUnitQueue } from '@/composables/useUnitQueue.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { BUILDING_TYPES } from '@/constants/buildings.js'
import { canPlaceAt, ROAD_REQUIRED_BUILDINGS } from '@/composables/useCityEngine.js'

const BUILD_POOL = [
  'residential','residential_small','residential_medium','commercial','shop','supermarket','tower_residential','apartment_block',
  'road','road','road','dirt_road','concrete_road',
  'police_station','fire_station','hospital','school','power','waterPlant','factory','warehouse',
  'fence','wall','hedge','brick_wall'
]

export function useSingleAI() {
  const city = useCityStore()
  const single = useSinglePlayerStore()
  const buildQueue = useBuildQueue()
  const unitQueue = useUnitQueue()
  const traffic = useTrafficStore()
  let timer = null
  let unitTimer = null
  let incomeTimer = null
  let attackTimer = null
  let scoutTimer = null
  const lastAttackedAt = new Map() // pid -> timestamp

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

  function getRoadVariantAt(x, y) {
    const hasRoad = (nx, ny) => {
      const c = city.getCell(nx, ny)
      return !!(c && (c.hasRoad || ['road','dirt_road','concrete_road'].includes(c.buildingId)))
    }
    const n = hasRoad(x, y-1), s = hasRoad(x, y+1), e = hasRoad(x+1, y), w = hasRoad(x-1, y)
    const count = [n,s,e,w].filter(Boolean).length
    if (count >= 3) {
      if (!n) return 't-s'
      if (!s) return 't-n'
      if (!e) return 't-w'
      if (!w) return 't-e'
      return 'cross'
    }
    if (count === 2) {
      if (n && s) return 'straight-v'
      if (e && w) return 'straight-h'
      if (n && e) return 'curve-ne'
      if (n && w) return 'curve-nw'
      if (s && e) return 'curve-se'
      if (s && w) return 'curve-sw'
    }
    if (count === 1) {
      if (n) return 'end-s'
      if (s) return 'end-n'
      if (e) return 'end-w'
      if (w) return 'end-e'
    }
    return 'straight-h'
  }

  function findRoadExpansionSpot(player) {
    const roads = city.flatGrid.filter(c => c.owner===player.id && (c.hasRoad || ['road','dirt_road','concrete_road'].includes(c.buildingId)))
    if (!roads.length) return null
    // Evalúa todo el perímetro y puntúa para trazado coherente (rectas, cruces, cercanía a barrio)
    const hasRoad = (nx, ny) => {
      const c = city.getCell(nx, ny)
      return !!(c && (c.hasRoad || ['road','dirt_road','concrete_road'].includes(c.buildingId)))
    }
    const candidates = []
    for (const road of roads) {
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const x = road.x + dx, y = road.y + dy
        if (buildQueue.findAt(x,y)) continue
        const ok = canPlaceAt(city.grid, x, y, 'road', 999999)
        if (!ok.ok) continue
        const n = hasRoad(x, y-1), s = hasRoad(x, y+1), e = hasRoad(x+1, y), w = hasRoad(x-1, y)
        const cnt = [n,s,e,w].filter(Boolean).length
        let score = 0
        if (cnt === 1) score += 2 // extiende punta
        if (cnt === 2) score += 3 // recta o curva que conecta
        if (cnt >= 3) score += 2 // forma T/cross
        // premia cercanía a edificios que necesitan carretera sin conexión
        let nearNeed = 0
        for (let dy2=-3; dy2<=3; dy2++) for (let dx2=-3; dx2<=3; dx2++) {
          const c2 = city.getCell(x+dx2, y+dy2)
          if (c2 && c2.isOrigin && ROAD_REQUIRED_BUILDINGS.includes(c2.buildingId) && c2.owner===player.id) nearNeed++
        }
        score += Math.min(2, nearNeed*0.4)
        const distToBase = Math.abs(x-player.x)+Math.abs(y-player.y)
        if (distToBase < 14) score += 1
        else if (distToBase > 28) score -= 1.5
        // premia continuar recta (si el road base ya es recta en esa dirección)
        const baseStraightH = hasRoad(road.x+1, road.y) && hasRoad(road.x-1, road.y)
        const baseStraightV = hasRoad(road.x, road.y+1) && hasRoad(road.x, road.y-1)
        if ((baseStraightH && dy===0) || (baseStraightV && dx===0)) score += 1
        candidates.push({ x, y, score, variant: getRoadVariantAt(x,y) })
      }
    }
    if (!candidates.length) return null
    candidates.sort((a,b)=>b.score-a.score)
    const top = candidates.slice(0, Math.min(4, candidates.length))
    return top[Math.floor(Math.random()*top.length)]
  }

  // Busca el mejor hueco para un edificio, priorizando estar pegado a carretera y formar barrio
  function findBestBuildingSpot(player, buildingId) {
    const b = BUILDING_TYPES[buildingId]; if (!b) return null
    const w = b.width||1, h = b.height||1
    const needsRoad = ROAD_REQUIRED_BUILDINGS.includes(buildingId)
    const isResidential = ['residential','residential_small','residential_medium','residential_large','tower_residential','apartment_block','skyscraper'].includes(buildingId)
    const isCommercial = ['commercial','shop','supermarket','mall','bank','hotel','hotel_large','restaurant','restaurant_small'].includes(buildingId)
    const candidates = []
    // muestrea anillo alrededor de cada carretera y edificio propio para barrio compacto
    const anchors = city.flatGrid.filter(c=>c.owner===player.id && (c.hasRoad || c.isOrigin)).slice(0, 40)
    // si no hay anclas, usa base
    const bases = anchors.length ? anchors : [{x:player.x, y:player.y}]
    for (const base of bases) {
      for (let tries=0; tries<6; tries++) {
        const dx = Math.floor(Math.random()*10)-5
        const dy = Math.floor(Math.random()*10)-5
        const x = base.x + dx, y = base.y + dy
        if (buildQueue.findAt(x,y)) continue
        const ok = canPlaceAt(city.grid, x, y, buildingId, 999999)
        if (!ok.ok) continue
        let score = Math.random()*0.5 // variedad
        // debe tocar carretera si lo requiere
        const touchesRoad = (()=>{ for(let dy2=-1; dy2<=h; dy2++) for(let dx2=-1; dx2<=w; dx2++){ if(dx2>=0&&dx2<w&&dy2>=0&&dy2<h) continue; const c2=city.getCell(x+dx2,y+dy2); if(c2 && (c2.hasRoad||['road','dirt_road','concrete_road'].includes(c2.buildingId))) return true } return false })()
        if (needsRoad) {
          if (touchesRoad) score += 3
          else score -= 5
        } else if (touchesRoad) score += 0.5
        // barrio: cerca de mismo tipo
        let sameNearby=0, crossNearby=0
        for(let dy2=-4; dy2<=4; dy2++) for(let dx2=-4; dx2<=4; dx2++){
          const c2=city.getCell(x+dx2, y+dy2)
          if(!c2||!c2.isOrigin||c2.owner!==player.id) continue
          if(c2.buildingId===buildingId) sameNearby++
          if(isResidential && ['commercial','shop','supermarket'].includes(c2.buildingId)) crossNearby++
          if(isCommercial && ['residential','residential_small'].includes(c2.buildingId)) crossNearby++
        }
        score += Math.min(2, sameNearby*0.6)
        score += Math.min(1.5, crossNearby*0.5)
        // compacto cerca de base pero no encima
        const dBase = Math.abs(x-player.x)+Math.abs(y-player.y)
        if (dBase < 12) score += 1
        if (dBase > 22) score -= 1
        candidates.push({x,y,score})
      }
    }
    if (!candidates.length) return null
    candidates.sort((a,b)=>b.score-a.score)
    return candidates[0]
  }

  function chooseBuildingFor(player) {
    const s = statsFor(player.id)
    const myMoney = single.getMoney(player.id)
    const elapsed = single.startedAt ? (Date.now() - single.startedAt)/1000 : 999
    const hasSchool = city.flatGrid.some(c=>c.isOrigin && c.owner===player.id && (c.buildingId==='school'||c.buildingId==='university'))
    const hasUni = city.flatGrid.some(c=>c.isOrigin && c.owner===player.id && c.buildingId==='university')
    // 1. ECONOMÍA — déficit energético/hídrico tiene prioridad absoluta
    if (s.hasEnergyDeficit && s.energyP < s.energyC) {
      if (myMoney >= 300 && single.canAfford(player.id, BUILDING_TYPES.power.cost) && Math.random()<0.75) return 'power'
      if (myMoney >= 620 && single.canAfford(player.id, BUILDING_TYPES.solar_farm.cost) && Math.random()<0.6) return 'solar_farm'
      if (myMoney >= 1800 && single.canAfford(player.id, BUILDING_TYPES.nuclear_plant.cost) && Math.random()<0.35) return 'nuclear_plant'
      if (myMoney >= 180 && single.canAfford(player.id, BUILDING_TYPES.wind_turbine.cost) && Math.random()<0.5) return 'wind_turbine'
    }
    if (s.hasWaterDeficit && s.waterP < s.waterC) {
      if (myMoney >= 250 && single.canAfford(player.id, BUILDING_TYPES.waterPlant.cost) && Math.random()<0.7) return 'waterPlant'
      if (myMoney >= 380 && single.canAfford(player.id, BUILDING_TYPES.sewage_plant.cost) && Math.random()<0.5) return 'sewage_plant'
    }
    // 2. RUSH TECH 0-3min — escuela/universidad antes que arsenal/data/antena
    if (elapsed < 180 && !hasSchool && myMoney >= BUILDING_TYPES.school.cost && Math.random()<0.85) return 'school'
    if (elapsed < 240 && hasSchool && !hasUni && myMoney >= BUILDING_TYPES.university.cost && Math.random()<0.65) return 'university'
    if (!hasSchool && !hasUni && myMoney >= BUILDING_TYPES.school.cost && Math.random()<0.4) return 'school'
    const human = single.players.find(p=>p.isHuman)
    // 6. AHORRO INTELIGENTE — guarda para nuclear/opera si va ganando
    if (human) {
      const hs = statsFor(human.id)
      // Si va ganando (más pop+8 y más income+4), ahorra agresivamente para megaestructura
      const isWinning = s.pop > hs.pop + 8 && s.income > hs.income + 4
      const isAhead = s.pop > hs.pop + 4 || s.income > hs.income + 2
      // Cerca de nuclear_plant (800💰) o opera (700💰): no gaste en basura
      if (myMoney >= 550 && myMoney < 900 && (isWinning || isAhead) && Math.random() < 0.55) return null
      // Ahorro profundo: tiene >600 y va ganando → solo construir si es megaestructura
      if (myMoney >= 600 && isWinning && Math.random() < 0.45) {
        const megaOpts = []
        if (s.hasEnergyDeficit) megaOpts.push('nuclear_plant') // prioridad: resuelve energía Y es potente
        if (!s.hasEnergyDeficit) megaOpts.push('opera', 'financial_district', 'castle')
        if (megaOpts.length && single.canAfford(player.id, 800)) {
          const pick = megaOpts[Math.floor(Math.random() * megaOpts.length)]
          if (single.canAfford(player.id, BUILDING_TYPES[pick]?.cost || 800)) return pick
        }
      }
      // Si va ganando y tiene buen income pero poca plata: no construir nada
      if (isWinning && s.income > 12 && myMoney < 300 && Math.random() < 0.4) return null
    }
    // Red vial inteligente 32%
    if (Math.random()<0.32) {
      const spot = findRoadExpansionSpot(player)
      if (spot) return spot.roadType || 'road'
      return ['road','concrete_road'][Math.floor(Math.random()*2)]
    }
    const hasRoad = city.flatGrid.some(c=>c.owner===player.id && (c.hasRoad || ['road','dirt_road','concrete_road'].includes(c.buildingId)))
    if (!hasRoad) return 'road'
    // Defensa 25% — amuralla power/nuclear/city_hall/arsenal/data/telecom con anillo + gate
    if (Math.random()<0.25) {
      const hasImportant = city.flatGrid.some(c=>c.owner===player.id && ['power','nuclear_plant','city_hall','arsenal','data_center','telecom_tower','museum'].includes(c.buildingId))
      if (hasImportant) {
        // 30% gate para entrada, resto muro/brick
        if (Math.random()<0.3) return 'gate'
        return ['wall','brick_wall','hedge','metal_fence'][Math.floor(Math.random()*4)]
      }
    }
    if (s.pop < 26 && Math.random()<0.38) return ['residential','residential_small','apartment_block'][Math.floor(Math.random()*3)]
    if (s.income < 14 && Math.random()<0.3) return ['supermarket','mall','factory'][Math.floor(Math.random()*3)]
    if (Math.random()<0.11) return 'military_academy'
    if (Math.random()<0.09) return 'arsenal'
    if (Math.random()<0.09) return 'police_station'
    if (Math.random()<0.07) return 'hospital'
    return randomBuilding()
  }

  function findWallSpot(player) {
    const importants = city.flatGrid.filter(c=>c.isOrigin && c.owner===player.id && ['power','nuclear_plant','city_hall','arsenal','military_academy'].includes(c.buildingId))
    if (!importants.length) return null
    const target = importants[Math.floor(Math.random()*importants.length)]
    const b = BUILDING_TYPES[target.buildingId]
    const w = b.width||1, h=b.height||1
    const perimeter = []
    for (let dx=-1; dx<=w; dx++) for (let dy=-1; dy<=h; dy++) {
      if (dx>=0 && dx<w && dy>=0 && dy<h) continue
      const x = target.x + dx, y = target.y + dy
      // deja un hueco para gate
      if (dx===Math.floor(w/2) && dy===-1 && Math.random()<0.7) continue
      perimeter.push({x,y})
    }
    for (const p of perimeter.sort(()=>Math.random()-0.5)) {
      const ok = canPlaceAt(city.grid, p.x, p.y, 'wall', 999999)
      if (ok.ok && !buildQueue.findAt(p.x,p.y)) {
        const isGate = p.x===target.x+Math.floor(w/2) && p.y===target.y-1
        return { x: p.x, y: p.y, variant: isGate ? 'gate' : getRoadVariantAt(p.x,p.y).replace('road','wall') || 'straight-h' }
      }
    }
    return null
  }

  function tryBuildFor(player) {
    const bId = chooseBuildingFor(player)
    const b = BUILDING_TYPES[bId]
    if (!b) return
    // Árbol tech para CPU: arsenal/data/antena requieren escuela/universidad
    const gated = new Set(['arsenal','data_center','telecom_tower'])
    if (gated.has(bId)) {
      const hasSchool = city.flatGrid.some(c=>c.isOrigin && (c.buildingId==='school'||c.buildingId==='university') && c.owner===player.id)
      if (!hasSchool) return
    }
    if (!single.canAfford(player.id, b.cost)) return
    const w = b.width||1, h=b.height||1
    const isRoad = ['road','dirt_road','concrete_road'].includes(bId)
    const isWall = ['fence','wall','hedge','brick_wall','gate'].includes(bId)
    // Red vial inteligente
    let roadSpot = null
    if (isRoad) {
      roadSpot = findRoadExpansionSpot(player)
      if (roadSpot) {
        city.selectedRoadVariant = roadSpot.variant
        const ok = canPlaceAt(city.grid, roadSpot.x, roadSpot.y, bId, 999999)
        if (ok.ok && !buildQueue.findAt(roadSpot.x, roadSpot.y)) {
          single.deduct(player.id, b.cost)
          const dur = buildQueue.durationFor(bId)
          if (dur===0) city.forcePlaceBuilding(roadSpot.x, roadSpot.y, bId, player.id)
          else buildQueue.queue.value.push({ id: Date.now()+Math.random(), x: roadSpot.x, y: roadSpot.y, buildingId: bId, owner: player.id, progress:0, duration: dur, w, h, startedAt: Date.now() })
          return
        }
      }
      const variants = ['cross','t-n','t-s','t-e','t-w','straight-h','straight-v','curve-nw','curve-ne']
      city.selectedRoadVariant = variants[Math.floor(Math.random()*variants.length)]
    } else if (isWall) {
      const wallSpot = findWallSpot(player)
      if (wallSpot) {
        const wallId = wallSpot.variant==='gate' ? 'gate' : bId
        city.selectedWallVariant = wallSpot.variant
        const ok = canPlaceAt(city.grid, wallSpot.x, wallSpot.y, wallId, 999999)
        if (ok.ok && !buildQueue.findAt(wallSpot.x, wallSpot.y)) {
          single.deduct(player.id, BUILDING_TYPES[wallId].cost)
          const dur = buildQueue.durationFor(wallId)
          if (dur===0) city.forcePlaceBuilding(wallSpot.x, wallSpot.y, wallId, player.id)
          else buildQueue.queue.value.push({ id: Date.now()+Math.random(), x: wallSpot.x, y: wallSpot.y, buildingId: wallId, owner: player.id, progress:0, duration: dur, w:1, h:1, startedAt: Date.now() })
          return
        }
      }
      const v = ['straight-h','straight-v','curve-nw','cross'][Math.floor(Math.random()*4)]
      city.selectedWallVariant = v
    }
    // Intenta hueco inteligente (barrio + carretera) antes que random puro
    const best = findBestBuildingSpot(player, bId)
    if (best) {
      const { x, y } = best
      if (!buildQueue.findAt(x,y)) {
        const ok = canPlaceAt(city.grid, x, y, bId, 999999)
        if (ok.ok) {
          single.deduct(player.id, b.cost)
          const dur = buildQueue.durationFor(bId)
          if (dur===0) city.forcePlaceBuilding(x,y,bId, player.id)
          else buildQueue.queue.value.push({ id: Date.now()+Math.random(), x, y, buildingId: bId, owner: player.id, progress: 0, duration: dur, w, h, startedAt: Date.now() })
          return
        }
      }
    }
    for (let tries=0; tries<12; tries++) {
      const dx = Math.floor(Math.random()*18)-9
      const dy = Math.floor(Math.random()*18)-9
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
    const hasPolice = city.flatGrid.some(c=>c.isOrigin && c.buildingId==='police_station' && c.owner===player.id)
    const hasMil = city.flatGrid.some(c=>c.isOrigin && c.buildingId==='military_academy' && c.owner===player.id)
    const hasArs = city.flatGrid.some(c=>c.isOrigin && c.buildingId==='arsenal' && c.owner===player.id)
    const opts = []
    if (hasPolice) opts.push(['police_station','police'], ['police_station','swat'], ['police_station','police_car'])
    if (hasMil) opts.push(['military_academy','soldier'], ['military_academy','sniper'], ['military_academy','tank'], ['military_academy','army_jeep'])
    if (hasArs) opts.push(['arsenal','cannon'], ['arsenal','tractor'], ['arsenal','rocket'])
    if (opts.length===0) return
    const [bId, unit] = opts[Math.floor(Math.random()*opts.length)]
    unitQueue.enqueue(bId, unit, player.id)
  }

  function tryCoordinatedAttack(player) {
    const myUnits = [...traffic.pedestrians.filter(p=>p.owner===player.id), ...traffic.vehicles.filter(v=>v.owner===player.id)]
    if (myUnits.length < 3) return
    const enemyBuildings = city.flatGrid.filter(c=>c.isOrigin && c.owner && c.owner!==player.id && c.buildingId)
    if (!enemyBuildings.length) return
    const valueRank = { power: 10, nuclear_plant: 10, bank: 9, commercial: 8, mall: 8, factory: 7, residential: 5, residential_small: 4 }
    enemyBuildings.sort((a,b) => (valueRank[b.buildingId]||1) - (valueRank[a.buildingId]||1))
    const target = enemyBuildings[0]
    if (!target) return
    const attackers = myUnits.filter(u=>!u.target && (u.hp===undefined || u.hp>30)).slice(0,4)
    if (attackers.length < 2) return
    for (const u of attackers) {
      const isSniper = u.kind==='sniper'
      u.target = { x: target.x, y: target.y, type: 'building', targetId: target.id, isEnemy: true, buildingId: target.buildingId }
      u.isRunning = true
      u.speed = isSniper ? 520 : 580
      if (isSniper) u.attackRange = 2
    }
  }

  function tryScout(player) {
    // manda moto/scout rápido hacia base enemiga para explorar huecos
    const enemy = city.flatGrid.find(c=>c.isOrigin && c.owner && c.owner!==player.id)
    if (!enemy) return
    const scoutUnits = traffic.pedestrians.filter(p=>p.owner===player.id && !p.target).length + traffic.vehicles.filter(v=>v.owner===player.id && !v.target).length
    if (scoutUnits > 6) return
    // elige unidad rápida si tiene, si no soldado
    const hasMoto = city.flatGrid.some(c=>c.owner===player.id && c.buildingId==='moto_dealership')
    if (hasMoto && Math.random()<0.6) {
      // moto ya spawnea sola vía serviceSpawns, solo ordena una existente
      const moto = traffic.vehicles.find(v=>v.owner===player.id && v.type==='moto' && !v.target)
      if (moto) {
        moto.target = { x: enemy.x + Math.floor(Math.random()*6)-3, y: enemy.y + Math.floor(Math.random()*6)-3, type: 'move', isEnemy: false }
        moto.isRunning = true; moto.speed = 420
      }
    } else {
      const ped = traffic.pedestrians.find(p=>p.owner===player.id && !p.target)
      if (ped) {
        ped.target = { x: enemy.x + Math.floor(Math.random()*8)-4, y: enemy.y + Math.floor(Math.random()*8)-4, type: 'move', isEnemy: false }
        ped.isRunning = true; ped.speed = 580
      }
    }
  }

  function checkRetaliation(player) {
    // si le dañaron edificio (hp<100) o le mataron unidad recientemente, contraataca en 3s
    const damaged = city.flatGrid.some(c=>c.isOrigin && c.owner===player.id && c.hp!==undefined && c.hp < 90)
    const now = Date.now()
    const last = lastAttackedAt.get(player.id) || 0
    if (damaged && now - last > 8000) {
      lastAttackedAt.set(player.id, now)
      setTimeout(() => tryCoordinatedAttack(player), 800 + Math.random()*1200)
      setTimeout(() => tryCoordinatedAttack(player), 2200)
    }
    // también si perdió unidad hace poco (menos de 3 unidades y antes tenía más)
    const myUnits = traffic.pedestrians.filter(p=>p.owner===player.id).length + traffic.vehicles.filter(v=>v.owner===player.id).length
    if (myUnits <= 2 && now - last > 10000) {
      // intenta reponer y contraatacar
      lastAttackedAt.set(player.id, now)
      setTimeout(() => tryCoordinatedAttack(player), 1500)
    }
  }

  let specialWeaponTimer = null

  function trySpecialWeapon(player) {
    const myMoney = single.getMoney(player.id)
    if (myMoney < 50) return
    // Requiere tech: arsenal + escuela/universidad, si no, no dispara especiales
    const hasArs = city.flatGrid.some(c=>c.isOrigin && c.buildingId==='arsenal' && c.owner===player.id)
    const hasSchool = city.flatGrid.some(c=>c.isOrigin && (c.buildingId==='school'||c.buildingId==='university') && c.owner===player.id)
    if (!hasArs || !hasSchool) return
    // 9. ESPECIALES — usa 🚀 rocket/misil y ☢️ atómica vía mapa cuando detecta city_hall/bank
    const highValue = city.flatGrid.filter(c => c.isOrigin && c.owner && c.owner !== player.id && c.buildingId && ['city_hall','bank','nuclear_plant','power','financial_district','opera','castle'].includes(c.buildingId))
    if (!highValue.length) {
      // Si no hay targets de alto valor, busca cualquier edificio enemigo
      const anyEnemy = city.flatGrid.filter(c => c.isOrigin && c.owner && c.owner !== player.id && c.buildingId)
      if (!anyEnemy.length) return
      // Con targets bajos, usar solo cohetes baratos (ahorro)
      if (myMoney >= 50 && Math.random() < 0.35) {
        const t = anyEnemy[Math.floor(Math.random() * anyEnemy.length)]
        city.remoteStrike(t.x, t.y, 'rocket', player.id)
      }
      return
    }
    // Prioridad por valor — city_hall y bank son prioridad #1
    const priority = { city_hall: 10, bank: 9, nuclear_plant: 9, financial_district: 8, power: 7, opera: 6, castle: 5 }
    highValue.sort((a,b) => (priority[b.buildingId]||1) - (priority[a.buildingId]||1))
    // Rotar objetivos: no siempre el mismo edificio
    const targetIdx = Math.floor(Math.random() * Math.min(3, highValue.length))
    const target = highValue[targetIdx]

    // SELECCIÓN INTELIGENTE DE ARMA:
    // - city_hall/bank (prioridad 9-10): escalar a atómica si puede permitírselo
    // - nuclear/power (7-9): missile o atómica ligera
    // - otros (5-7): rocket barato
    const targetPriority = priority[target.buildingId] || 1
    if (targetPriority >= 9 && myMoney >= 850 && Math.random() < 0.3) {
      // Atómica pesada para city_hall/bank — maximiza daño
      city.remoteStrike(target.x, target.y, 'atomic_heavy', player.id)
    } else if (targetPriority >= 8 && myMoney >= 500 && Math.random() < 0.4) {
      // Atómica ligera para targets de alto valor
      city.remoteStrike(target.x, target.y, 'atomic', player.id)
    } else if (myMoney >= 200 && Math.random() < 0.5) {
      // Missile como opción principal — buen daño/precio
      city.remoteStrike(target.x, target.y, 'missile', player.id)
    } else if (myMoney >= 50 && Math.random() < 0.65) {
      // Rocket barato — spam para desgaste
      city.remoteStrike(target.x, target.y, 'rocket', player.id)
    }
  }

  function start() {
    if (timer) clearInterval(timer)
    if (unitTimer) clearInterval(unitTimer)
    if (incomeTimer) clearInterval(incomeTimer)
    if (attackTimer) clearInterval(attackTimer)
    if (scoutTimer) clearInterval(scoutTimer)
    if (specialWeaponTimer) clearInterval(specialWeaponTimer)
    timer = setInterval(() => {
      if (!single.isActive) return
      for (const p of single.players.filter(pl=>!pl.isHuman)) {
        if (Math.random() < 0.45) tryBuildFor(p)
      }
    }, 6200)
    unitTimer = setInterval(() => {
      if (!single.isActive) return
      for (const p of single.players.filter(pl=>!pl.isHuman)) {
        if (Math.random() < 0.52) tryUnitFor(p)
      }
    }, 4800)
    attackTimer = setInterval(() => {
      if (!single.isActive) return
      for (const p of single.players.filter(pl=>!pl.isHuman)) {
        if (Math.random() < 0.38) tryCoordinatedAttack(p)
      }
    }, 7500)
    scoutTimer = setInterval(() => {
      if (!single.isActive) return
      for (const p of single.players.filter(pl=>!pl.isHuman)) {
        if (Math.random() < 0.28) tryScout(p)
        checkRetaliation(p)
      }
    }, 3800)
    specialWeaponTimer = setInterval(() => {
      if (!single.isActive) return
      for (const p of single.players.filter(pl=>!pl.isHuman)) {
        // Frecuencia más alta si el humano tiene city_hall/bank (detecta objetivo)
        const human = single.players.find(pl=>pl.isHuman)
        if (human) {
          const hasKeyTarget = city.flatGrid.some(c=>c.isOrigin && c.owner===human.id && ['city_hall','bank','nuclear_plant'].includes(c.buildingId))
          if (hasKeyTarget && Math.random() < 0.45) trySpecialWeapon(p)
          else if (Math.random() < 0.3) trySpecialWeapon(p)
        } else if (Math.random() < 0.35) {
          trySpecialWeapon(p)
        }
      }
    }, 9500)
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
  function stop() { if (timer) clearInterval(timer); if (unitTimer) clearInterval(unitTimer); if (incomeTimer) clearInterval(incomeTimer); if (attackTimer) clearInterval(attackTimer); if (scoutTimer) clearInterval(scoutTimer); if (specialWeaponTimer) clearInterval(specialWeaponTimer); timer=null; unitTimer=null; incomeTimer=null; attackTimer=null; scoutTimer=null; specialWeaponTimer=null }

  return { start, stop }
}
