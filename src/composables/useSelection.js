import { ref } from 'vue'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { useCityStore } from '@/stores/cityStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useAudioManager } from '@/audio/audioManager.js'

const selected = ref([]) // [{type:'ped'|'veh', id}]
const lastCmd = ref(null) // {x,y}

export function useSelection() {
  const traffic = useTrafficStore()
  const city = useCityStore()
  const single = useSinglePlayerStore()

  function isOwned(entity) {
    if (!single.isActive) return false
    const human = single.humanPlayer()?.id
    return entity.owner === human
  }

  function selectPed(id, additive = false) {
    const p = traffic.pedestrians.find(x => x.id === id)
    if (!p || !isOwned(p)) return false
    if (!additive) selected.value = []
    if (!selected.value.find(s => s.type === 'ped' && s.id === id)) selected.value.push({ type: 'ped', id })
    return true
  }

  function selectVeh(id, additive = false) {
    const v = traffic.vehicles.find(x => x.id === id)
    if (!v || !isOwned(v)) return false
    if (!additive) selected.value = []
    if (!selected.value.find(s => s.type === 'veh' && s.id === id)) selected.value.push({ type: 'veh', id })
    return true
  }

  function clear() { selected.value = [] }
  function isSelected(type, id) { return !!selected.value.find(s => s.type === type && s.id === id) }

  function getSelectedEntities() {
    const res = []
    for (const s of selected.value) {
      if (s.type === 'ped') { const p = traffic.pedestrians.find(x => x.id === s.id); if (p) res.push(p) }
      else { const v = traffic.vehicles.find(x => x.id === s.id); if (v) res.push(v) }
    }
    return res
  }

  function commandTo(x, y, targetInfo = null) {
    // targetInfo: {type:'ped'|'veh'|'building', id, owner, isEnemy}
    const ents = getSelectedEntities()
    if (ents.length === 0) return
    for (const e of ents) {
      e.target = { x, y, type: targetInfo?.type || 'move', targetId: targetInfo?.id || null, isEnemy: !!targetInfo?.isEnemy, buildingId: targetInfo?.buildingId || null }
      e.isRunning = true
      e.speed = 520
    }
    lastCmd.value = { x, y, t: Date.now() }
  }

  // auto-ataque para ociosas (sin orden) — detecta enemigo ≤6
  function autoAttackIdle() {
    if (!single.isActive) return
    const allUnits = [...traffic.pedestrians, ...traffic.vehicles].filter(u=>u.owner)
    for (const u of allUnits) {
      if (u.target) continue
      if (selected.value.find(s=> (s.type==='ped' && u.kind && s.id===u.id) || (s.type==='veh' && s.id===u.id))) continue
      // busca enemigo cercano
      let best=null, bestD=Infinity
      const enemies = [...traffic.pedestrians, ...traffic.vehicles].filter(e=>e.owner && e.owner!==u.owner)
      for (const e of enemies) {
        const d = Math.abs(e.x - u.x) + Math.abs(e.y - u.y)
        if (d < bestD && d <= 6) { bestD=d; best=e }
      }
      // también edificios enemigos
      if (!best) {
        for (const c of city.flatGrid) {
          if (!c.isOrigin || !c.owner || c.owner===u.owner) continue
          const d = Math.abs(c.x - u.x) + Math.abs(c.y - u.y)
          if (d < bestD && d <= 7) { bestD=d; best={ x:c.x, y:c.y, isBuilding:true, buildingId:c.buildingId, id:c.id, owner:c.owner } }
        }
      }
      if (best) {
        const isPed = best.kind !== undefined
        u.target = { x: best.x, y: best.y, type: best.isBuilding ? 'building' : (isPed ? 'ped' : 'veh'), targetId: best.id, isEnemy:true, buildingId: best.buildingId }
        u.isRunning = true; u.speed = 520
      }
    }
  }

  // tick para unidades seleccionadas con target
  function tick() {
    if (!single.isActive) { autoAttackIdle(); return }
    autoAttackIdle()
    const ents = getSelectedEntities()
    for (const e of ents) {
      if (!e.target) continue
      const tx = e.target.x, ty = e.target.y
      const dist = Math.abs(tx - e.x) + Math.abs(ty - e.y)
      // si es ataque y llegó a 1 de distancia
      if (e.target.type !== 'move' && dist <= 1) {
        // atacar
        if (e.target.type === 'ped') {
          const victim = traffic.pedestrians.find(p => p.id === e.target.targetId)
          if (victim && victim.hp !== undefined) {
            const dmg = e.kind === 'sniper' ? 45 : e.kind === 'swat' ? 28 : e.kind === 'soldier' ? 22 : e.type === 'tank' ? 38 : e.type === 'cannon' ? 45 : 14
            victim.hp -= dmg
            try { import('@/audio/audioManager.js').then(m=>m.useAudioManager().effects.playGunShot()) } catch {}
            if (victim.hp <= 0) {
              const idx = traffic.pedestrians.findIndex(p => p.id === victim.id)
              if (idx !== -1) traffic.pedestrians.splice(idx, 1)
            }
          }
        } else if (e.target.type === 'veh') {
          const victim = traffic.vehicles.find(v => v.id === e.target.targetId)
          if (victim && victim.hp !== undefined) {
            const dmg = e.kind === 'sniper' ? 38 : e.kind === 'swat' ? 24 : e.kind === 'soldier' ? 18 : e.type === 'tank' ? 40 : 28
            victim.hp -= dmg
            if (victim.hp <= 0) {
              const idx = traffic.vehicles.findIndex(v => v.id === victim.id)
              if (idx !== -1) traffic.vehicles.splice(idx, 1)
            }
          }
        } else if (e.target.type === 'building') {
          const cell = city.getCell(tx, ty)
          // si es hijo, busca origen
          let origin = cell
          if (cell?.isChild && cell.occupiedBy) origin = city.getCell(cell.occupiedBy.x, cell.occupiedBy.y)
          if (origin && origin.buildingId) {
            // daño a edificio: si no tiene hp, inicializa 100
            if (origin.hp === undefined) origin.hp = 100
            const isAtomic = e.type === 'atomic' || e.unitType === 'atomic'
            const isCannon = e.type === 'cannon' || e.type === 'tank' || isAtomic
            const dmg = isAtomic ? 95 : isCannon ? 35 : e.type === 'tank' ? 28 : e.kind === 'sniper' ? 28 : e.kind === 'swat' ? 20 : e.kind === 'soldier' ? 16 : 10
            origin.hp -= dmg
            try { if(isAtomic) { useAudioManager().effects.playBomb(); useAudioManager().effects.playExplosion() } else if(isCannon) useAudioManager().effects.playCannon(); else useAudioManager().effects.playGunShot() } catch {}
            if (isAtomic) {
              try { (globalThis||window).dispatchEvent(new CustomEvent('atomic-flash')) } catch {}
              for (let dy=-3; dy<=3; dy++) for (let dx=-3; dx<=3; dx++) {
                if (dx===0 && dy===0) continue
                const nb = city.getCell(origin.x+dx, origin.y+dy)
                let nbOrig = nb
                if (nb?.isChild && nb.occupiedBy) nbOrig = city.getCell(nb.occupiedBy.x, nb.occupiedBy.y)
                if (nbOrig && nbOrig.buildingId) {
                  if (nbOrig.hp===undefined) nbOrig.hp=100
                  nbOrig.hp -= Math.round(dmg*0.6)
                  if (nbOrig.hp<=0) city.demolish(nbOrig.x, nbOrig.y)
                }
                const ped2 = traffic.pedestrians.find(p=>p.x===origin.x+dx && p.y===origin.y+dy)
                if (ped2 && ped2.hp!==undefined) { ped2.hp-=60; if(ped2.hp<=0){ const idx2=traffic.pedestrians.findIndex(x=>x.id===ped2.id); if(idx2!==-1) traffic.pedestrians.splice(idx2,1)} }
                const veh2 = traffic.vehicles.find(v=>v.x===origin.x+dx && v.y===origin.y+dy)
                if (veh2 && veh2.hp!==undefined) { veh2.hp-=60; if(veh2.hp<=0){ const idx2=traffic.vehicles.findIndex(x=>x.id===veh2.id); if(idx2!==-1) traffic.vehicles.splice(idx2,1)} }
              }
              // consume bomba
              const atkIdx = traffic.vehicles.findIndex(v=>v.id===e.id)
              if (atkIdx!==-1) traffic.vehicles.splice(atkIdx,1)
              else { const pIdx=traffic.pedestrians.findIndex(p=>p.id===e.id); if(pIdx!==-1) traffic.pedestrians.splice(pIdx,1) }
            } else if (isCannon) {
              try { useAudioManager().effects.playBomb() } catch {}
              for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) {
                if (dx===0 && dy===0) continue
                const nb = city.getCell(origin.x+dx, origin.y+dy)
                let nbOrig = nb
                if (nb?.isChild && nb.occupiedBy) nbOrig = city.getCell(nb.occupiedBy.x, nb.occupiedBy.y)
                if (nbOrig && nbOrig.buildingId) {
                  if (nbOrig.hp===undefined) nbOrig.hp=100
                  nbOrig.hp -= Math.round(dmg*0.4)
                  if (nbOrig.hp<=0) city.demolish(nbOrig.x, nbOrig.y)
                }
                const ped = traffic.pedestrians.find(p=>p.x===origin.x+dx && p.y===origin.y+dy)
                if (ped && ped.hp!==undefined) { ped.hp-=25; if(ped.hp<=0){ const idx=traffic.pedestrians.findIndex(x=>x.id===ped.id); if(idx!==-1) traffic.pedestrians.splice(idx,1)} }
              }
            }
            if (origin.hp <= 0) {
              // destruir
              const ox = origin.x, oy = origin.y
              city.demolish(ox, oy)
            }
          }
        }
        // tras atacar, limpia target y sigue
        e.target = null
        e.isRunning = false
        e.speed = e.baseSpeed || 1150
        continue
      }
      if (dist <= 0) { e.target = null; e.isRunning = false; e.speed = e.baseSpeed || 1150; continue }
      // moverse un paso hacia target
      const isTrain = e.type === 'train'
      // usa stepTowards si es tráfico, sino random pero dirigido
      // importa stepTowards lógica simple
      const dx = Math.sign(tx - e.x), dy = Math.sign(ty - e.y)
      let moved = false
      const tryMove = (ddx, ddy) => {
        const nx = e.x + ddx, ny = e.y + ddy
        const cell = city.getCell(nx, ny)
        const isRoad = cell && (cell.hasRoad || ['road','dirt_road','concrete_road','cobble_road'].includes(cell.buildingId))
        const isRail = cell && (cell.hasRail || cell.buildingId === 'rail')
        const ok = isTrain ? isRail : isRoad
        if (ok) { e.x = nx; e.y = ny; e.dir = ddx===1?'right':ddx===-1?'left':ddy===-1?'up':'down'; moved=true; return true }
        return false
      }
      if (dx!==0 && tryMove(dx,0)) {}
      else if (dy!==0 && tryMove(0,dy)) {}
      else {
        // intenta cualquiera
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
        for (const [ddx,ddy] of dirs) if (tryMove(ddx,ddy)) break
      }
      if (!moved) { e.target = null; e.isRunning=false }
    }
  }

  return { selected, lastCmd, selectPed, selectVeh, clear, isSelected, getSelectedEntities, commandTo, tick, isOwned }
}
