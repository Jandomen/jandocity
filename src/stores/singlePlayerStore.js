import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'

const COLORS = [
  { id: 'blue', label: 'Azul', bg: '#2563eb', light: '#60a5fa', text: '#fff' },
  { id: 'red', label: 'Rojo', bg: '#dc2626', light: '#f87171', text: '#fff' },
  { id: 'green', label: 'Verde', bg: '#16a34a', light: '#4ade80', text: '#fff' },
  { id: 'yellow', label: 'Amarillo', bg: '#eab308', light: '#facc15', text: '#000' },
  { id: 'purple', label: 'Morado', bg: '#7c3aed', light: '#a78bfa', text: '#fff' },
  { id: 'orange', label: 'Naranja', bg: '#ea580c', light: '#fb923c', text: '#fff' },
  { id: 'cyan', label: 'Cian', bg: '#0891b2', light: '#22d3ee', text: '#fff' },
  { id: 'pink', label: 'Rosa', bg: '#db2777', light: '#f472b6', text: '#fff' },
  { id: 'white', label: 'Blanco', bg: '#f8fafc', light: '#e2e8f0', text: '#000' },
  { id: 'black', label: 'Negro', bg: '#0f172a', light: '#334155', text: '#fff' },
]

export const useSinglePlayerStore = defineStore('single', () => {
  const isActive = ref(false)
  const playerColor = ref('blue')
  const enemyCount = ref(1) // 1..3 => total 2..4
  const players = ref([]) // {id,color,x,y, money}
  const startedAt = ref(null)
  const hasEverBuilt = ref(false)
  const cpuMoney = ref({}) // {p1:1500, p2:1500...}

  const totalPlayers = computed(() => enemyCount.value + 1)

  function setup(count, opts = {}) {
    // count = 1..3 enemigos => 2..4 jugadores, opts: {teamMode:'1vs3'|'2vs2', colors:[c0,c1,c2,c3], random:false}
    const teamMode = opts.teamMode || (count === 3 ? '1vs3' : null)
    const is2vs2 = teamMode === '2vs2' && count === 3
    enemyCount.value = Math.min(3, Math.max(1, count))
    const n = is2vs2 ? 4 : totalPlayers.value
    const half = 75
    const margin = 12
    const spots = [
      { x: -half + margin, y: -half + margin }, // NW tú
      { x: half - margin - 4, y: half - margin - 4 }, // SE
      { x: half - margin - 4, y: -half + margin }, // NE
      { x: -half + margin, y: half - margin - 4 }, // SW
    ]
    // colores: si random o custom, baraja
    let colorPool = [...COLORS]
    if (opts.random) {
      for (let i = colorPool.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]] }
    } else if (opts.colors && opts.colors.length) {
      // mapea por id
      colorPool = opts.colors.map(id => COLORS.find(c=>c.id===id) || COLORS[0])
      // rellena si faltan
      while (colorPool.length < n) colorPool.push(COLORS[colorPool.length % COLORS.length])
    }
    players.value = []
    cpuMoney.value = {}
    for (let i = 0; i < n; i++) {
      const c = colorPool[i % colorPool.length]
      const s = spots[i]
      const isHuman = i === 0
      const team = is2vs2 ? (i < 2 ? 'A' : 'B') : (isHuman ? 'A' : 'B')
      players.value.push({ id: `p${i}`, color: c.id, bg: c.bg, light: c.light, x: s.x, y: s.y, isHuman, team, text: c.text, money: 1500 })
      if (!isHuman) cpuMoney.value[`p${i}`] = 1500
      if (isHuman) playerColor.value = c.id
    }
    startedAt.value = Date.now()
    hasEverBuilt.value = false
    isActive.value = true
  }

  function reset() {
    isActive.value = false
    players.value = []
    startedAt.value = null
    hasEverBuilt.value = false
    cpuMoney.value = {}
  }

  function getMoney(pid) {
    if (pid === 'p0') {
      try { return useCityStore().money } catch { return 1500 }
    }
    return cpuMoney.value[pid] ?? 1500
  }
  function addMoney(pid, amt) {
    if (pid === 'p0') return
    cpuMoney.value[pid] = (cpuMoney.value[pid] ?? 1500) + amt
  }
  function canAfford(pid, cost) {
    if (pid === 'p0') { try { return useCityStore().money >= cost } catch { return true } }
    return (cpuMoney.value[pid] ?? 1500) >= cost
  }
  function deduct(pid, cost) {
    if (pid === 'p0') { try { useCityStore().money -= cost } catch {} }
    else cpuMoney.value[pid] = (cpuMoney.value[pid] ?? 1500) - cost
  }

  function colorForOwner(ownerId) {
    const p = players.value.find(x => x.id === ownerId)
    return p ? p.bg : '#22c55e'
  }

  function humanPlayer() { return players.value.find(p => p.isHuman) }

  return { isActive, playerColor, enemyCount, players, totalPlayers, COLORS, startedAt, hasEverBuilt, cpuMoney, setup, reset, colorForOwner, humanPlayer, getMoney, addMoney, canAfford, deduct }
})
