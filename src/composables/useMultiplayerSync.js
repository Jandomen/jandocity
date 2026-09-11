import { supabase } from '@/lib/supabase.js'
import { useCityStore } from '@/stores/cityStore.js'

let channel = null

export function useMultiplayerSync(roomKey) {
  const city = useCityStore()

  function join(roomKey) {
    if (channel) supabase.removeChannel(channel)
    channel = supabase.channel(`game-${roomKey}`)
      .on('broadcast', { event: 'build' }, ({ payload }) => {
        // payload: {x,y, buildingId, owner}
        try { city.forcePlaceBuilding(payload.x, payload.y, payload.buildingId, payload.owner) } catch {}
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        // manejado en App.vue chat
        window.dispatchEvent(new CustomEvent('multi-chat', { detail: payload }))
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

  function leave() { if (channel) supabase.removeChannel(channel); channel=null }

  return { join, broadcastBuild, broadcastChat, leave }
}
