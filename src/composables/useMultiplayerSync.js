import { supabase } from '@/lib/supabase.js'
import { useCityStore } from '@/stores/cityStore.js'
import { ref } from 'vue'

let channel = null
const remotePlayers = ref(new Map()) // id -> {x,y, characterId, username, color}
const remoteBuilds = ref([])

export function useMultiplayerSync(roomKey) {
  const city = useCityStore()

  function join(roomKey) {
    if (channel) supabase.removeChannel(channel)
    remotePlayers.value = new Map()
    channel = supabase.channel(`game-${roomKey}`)
      .on('broadcast', { event: 'build' }, ({ payload }) => {
        try { city.forcePlaceBuilding(payload.x, payload.y, payload.buildingId, payload.owner) } catch {}
        window.dispatchEvent(new CustomEvent('multi-build-remote', { detail: payload }))
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        window.dispatchEvent(new CustomEvent('multi-chat', { detail: payload }))
      })
      .on('broadcast', { event: 'playerPos' }, ({ payload }) => {
        // payload: {id, x, y, characterId, username, color}
        remotePlayers.value.set(payload.id, payload)
        // trigger reactivity
        remotePlayers.value = new Map(remotePlayers.value)
      })
      .on('broadcast', { event: 'playerLeave' }, ({ payload }) => {
        remotePlayers.value.delete(payload.id)
        remotePlayers.value = new Map(remotePlayers.value)
        window.dispatchEvent(new CustomEvent('multi-player-leave', { detail: payload }))
      })
      .subscribe()
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

  function leave() { if (channel) supabase.removeChannel(channel); channel=null; remotePlayers.value = new Map() }

  return { join, broadcastBuild, broadcastChat, broadcastPlayerPos, broadcastLeave, remotePlayers, leave }
}
