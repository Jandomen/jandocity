import { supabase } from '@/lib/supabase.js'
import { useCityStore } from '@/stores/cityStore.js'
import { ref } from 'vue'

let channel = null
const remotePlayers = ref(new Map()) // id -> {x,y, characterId, username, color}
const disconnected = ref(new Map()) // id -> {username, leftAt, timeoutId}
const remoteBuilds = ref([])
let myId = null
const gameMode = ref('war') // 'war' | 'coop'
const coopSettings = ref({ allowDemolishOthers: false, sharedResources: false, allowCombat: false })

export function useMultiplayerSync(roomKey) {
  const city = useCityStore()

  async function join(roomKey) {
    if (channel) supabase.removeChannel(channel)
    remotePlayers.value = new Map()
    disconnected.value = new Map()
    const { data: { user } } = await supabase.auth.getUser()
    myId = user?.id || null
    channel = supabase.channel(`game-${roomKey}`, { config: { presence: { key: myId || 'anon' } } })
      .on('broadcast', { event: 'build' }, ({ payload }) => {
        try { city.forcePlaceBuilding(payload.x, payload.y, payload.buildingId, payload.owner) } catch {}
        window.dispatchEvent(new CustomEvent('multi-build-remote', { detail: payload }))
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        window.dispatchEvent(new CustomEvent('multi-chat', { detail: payload }))
      })
      .on('broadcast', { event: 'playerPos' }, ({ payload }) => {
        if (disconnected.value.has(payload.id)) {
          const d = disconnected.value.get(payload.id)
          clearTimeout(d.timeoutId)
          disconnected.value.delete(payload.id)
          disconnected.value = new Map(disconnected.value)
        }
        remotePlayers.value.set(payload.id, { ...payload, status: 'connected' })
        remotePlayers.value = new Map(remotePlayers.value)
      })
      .on('broadcast', { event: 'playerLeave' }, ({ payload }) => {
        if (disconnected.value.has(payload.id)) {
          clearTimeout(disconnected.value.get(payload.id).timeoutId)
          disconnected.value.delete(payload.id)
          disconnected.value = new Map(disconnected.value)
        }
        remotePlayers.value.delete(payload.id)
        remotePlayers.value = new Map(remotePlayers.value)
        window.dispatchEvent(new CustomEvent('multi-player-leave', { detail: payload }))
        ;(async () => {
          try {
            const { data: room } = await supabase.from('rooms').select('*').eq('key', channel.topic.replace('game-','')).single()
            if (!room) return
            const upd = room.players.filter(p => p.id !== payload.id)
            if (room.host_id === payload.id && upd.length) {
              const newHost = upd[0]
              const updPlayers = upd.map((p,i) => ({ ...p, isHost: i===0 }))
              await supabase.from('rooms').update({ host_id: newHost.id, players: updPlayers }).eq('id', room.id)
            } else {
              await supabase.from('rooms').update({ players: upd }).eq('id', room.id)
            }
          } catch {}
        })()
      })
      .on('broadcast', { event: 'gameMode' }, ({ payload }) => {
        gameMode.value = payload.mode || 'war'
        window.dispatchEvent(new CustomEvent('multi-game-mode', { detail: payload }))
      })
      .on('broadcast', { event: 'coopSettings' }, ({ payload }) => {
        coopSettings.value = { ...coopSettings.value, ...payload }
        window.dispatchEvent(new CustomEvent('multi-coop-settings', { detail: payload }))
        window.dispatchEvent(new CustomEvent('multi-chat', { detail: { sender: 'Sistema', text: `Host Coop: Demoler ${payload.allowDemolishOthers?'ON':'OFF'}, Recursos ${payload.sharedResources?'compartidos':'individual'}, Combate ${payload.allowCombat?'ON':'OFF'}`, time: new Date().toLocaleTimeString(), at: Date.now() } }))
      })
      .on('broadcast', { event: 'requestCoopSettings' }, () => {
        if (myId) {
          // solo host responde
          supabase.from('rooms').select('host_id').eq('key', channel.topic.replace('game-','')).single().then(({ data }) => {
            if (data && data.host_id === myId) {
              channel.send({ type: 'broadcast', event: 'coopSettings', payload: coopSettings.value })
            }
          })
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const presentIds = new Set(Object.keys(state).map(k => state[k][0]?.id || k))
        // reconexión: si estaba desconectado y ahora presente → cancela cuenta atrás
        for (const [id, d] of Array.from(disconnected.value.entries())) {
          if (presentIds.has(id)) {
            clearTimeout(d.timeoutId)
            disconnected.value.delete(id)
            disconnected.value = new Map(disconnected.value)
            const rp = remotePlayers.value.get(id)
            if (rp) {
              remotePlayers.value.set(id, { ...rp, status: 'connected' })
              remotePlayers.value = new Map(remotePlayers.value)
            }
            window.dispatchEvent(new CustomEvent('multi-player-reconnected', { detail: { id } }))
          }
        }
        // detecta desconexiones no anunciadas
        for (const [id, p] of remotePlayers.value.entries()) {
          if (!presentIds.has(id) && id !== myId && !disconnected.value.has(id) && p.status !== 'disconnected') {
            handleDisconnect(id, p.username)
          }
        }
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        for (const pres of leftPresences) {
          const id = pres.id || pres.key
          if (!id || id === myId) continue
          const existing = remotePlayers.value.get(id)
          if (existing && !disconnected.value.has(id)) handleDisconnect(id, existing.username)
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && myId) {
          await channel.track({ id: myId, username: user.email?.split('@')[0] || 'Tú', online_at: new Date().toISOString() })
          // pide settings actuales al host
          setTimeout(() => channel.send({ type: 'broadcast', event: 'requestCoopSettings', payload: {} }), 800)
        }
      })
  }

  function handleDisconnect(id, username) {
    if (disconnected.value.has(id)) return
    const existing = remotePlayers.value.get(id)
    const leftAt = Date.now()
    const timeoutId = setTimeout(async () => {
      disconnected.value.delete(id)
      disconnected.value = new Map(disconnected.value)
      remotePlayers.value.delete(id)
      remotePlayers.value = new Map(remotePlayers.value)
      window.dispatchEvent(new CustomEvent('multi-player-leave', { detail: { id, username } }))
      try {
        const { data: room } = await supabase.from('rooms').select('*').eq('key', channel.topic.replace('game-','')).single()
        if (room && room.host_id === id) {
          const remaining = room.players.filter(p => p.id !== id)
          if (remaining.length) {
            const newHost = remaining[0]
            const updPlayers = remaining.map((p,i) => ({ ...p, isHost: i===0 }))
            await supabase.from('rooms').update({ host_id: newHost.id, players: updPlayers }).eq('id', room.id)
            window.dispatchEvent(new CustomEvent('multi-host-transfer', { detail: { newHostId: newHost.id } }))
          }
        } else if (room) {
          const upd = room.players.filter(p => p.id !== id)
          await supabase.from('rooms').update({ players: upd }).eq('id', room.id)
        }
      } catch {}
      const remaining = remotePlayers.value.size + 1
      if (remaining === 1) {
        window.dispatchEvent(new CustomEvent('multi-victory-solo', { detail: {} }))
      }
    }, 45000)
    const x = existing?.x, y = existing?.y
    disconnected.value.set(id, { username: username || existing?.username || 'Jugador', x, y, leftAt, timeoutId, status: 'disconnected' })
    disconnected.value = new Map(disconnected.value)
    if (existing) {
      remotePlayers.value.set(id, { ...existing, status: 'disconnected', leftAt })
      remotePlayers.value = new Map(remotePlayers.value)
    }
    window.dispatchEvent(new CustomEvent('multi-player-disconnected', { detail: { id, username } }))
  }

  function broadcastBuild(x, y, buildingId, owner) {
    if (!channel) return
    channel.send({ type: 'broadcast', event: 'build', payload: { x, y, buildingId, owner } })
  }

  function broadcastChat(text, sender) {
    if (!channel) return
    channel.send({ type: 'broadcast', event: 'chat', payload: { text, sender, time: new Date().toLocaleTimeString() } })
  }
  function broadcastPlayerPos(payload) {
    if (!channel) return
    channel.send({ type: 'broadcast', event: 'playerPos', payload })
  }
  function broadcastLeave(id) {
    if (!channel) return
    channel.send({ type: 'broadcast', event: 'playerLeave', payload: { id } })
  }

  function leave() { if (channel) supabase.removeChannel(channel); channel=null; remotePlayers.value = new Map(); disconnected.value = new Map() }
  function isActive() { return !!channel }
  function setGameMode(mode) { gameMode.value = mode; if (channel) channel.send({ type: 'broadcast', event: 'gameMode', payload: { mode } }) }
  function setCoopSettings(patch) { coopSettings.value = { ...coopSettings.value, ...patch }; if (channel) channel.send({ type: 'broadcast', event: 'coopSettings', payload: coopSettings.value }) }

  return { join, broadcastBuild, broadcastChat, broadcastPlayerPos, broadcastLeave, remotePlayers, disconnected, gameMode, coopSettings, setGameMode, setCoopSettings, isActive, leave }
}
