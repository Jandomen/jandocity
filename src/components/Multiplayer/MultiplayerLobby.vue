<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useMultiplayerSync } from '@/composables/useMultiplayerSync.js'

const emit = defineEmits(['start','back'])
const single = useSinglePlayerStore()
const multiSync = useMultiplayerSync()
const mode = ref('menu') // menu | host | join | lobby
const key = ref('')
const room = ref(null)
const myColor = ref('blue')
const selectedGameMode = ref('war') // war | coop
const isPublicRoom = ref(true) // Pública vs Privada
const coopAllowDemolish = ref(false)
const coopSharedResources = ref(false)
const coopAllowCombat = ref(false)
const players = ref([]) // {id, username, color, isHost, ready}
const loading = ref(false)
const error = ref('')

function genKey() { return 'JND-' + Math.random().toString(36).slice(2,6).toUpperCase() }

async function createRoom() {
  loading.value=true; error.value=''
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { error.value='Debes iniciar sesión'; loading.value=false; return }
  const k = genKey()
  key.value = k
  let status = selectedGameMode.value === 'coop' ? 'waiting_coop' : 'waiting'
  if (!isPublicRoom.value) status = 'private_' + status
  const { data, error: err } = await supabase.from('rooms').insert({ key: k, host_id: user.id, max_players: 8, players: [{ id: user.id, username: user.email.split('@')[0], color: myColor.value, isHost: true, ready: true }], status }).select().single()
  if (err) { error.value=err.message; loading.value=false; return }
  room.value = data
  players.value = data.players
  mode.value='lobby'
  // host guarda modo y settings para coop
  multiSync.gameMode.value = selectedGameMode.value
  if (selectedGameMode.value === 'coop') {
    multiSync.coopSettings.value = { allowDemolishOthers: coopAllowDemolish.value, sharedResources: coopSharedResources.value, allowCombat: coopAllowCombat.value }
  }
  subscribe()
  loading.value=false
}

async function joinRoom() {
  loading.value=true; error.value=''
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { error.value='Debes iniciar sesión'; loading.value=false; return }
  const { data, error: err } = await supabase.from('rooms').select('*').eq('key', key.value.trim().toUpperCase()).single()
  if (err || !data) { error.value='Clave no encontrada'; loading.value=false; return }
  if (data.players.length >= 8) { error.value='Sala llena (8)'; loading.value=false; return }
  if (data.players.find(p=>p.id===user.id)) { room.value=data; players.value=data.players; mode.value='lobby'; subscribe(); loading.value=false; return }
  const updated = [...data.players, { id: user.id, username: user.email.split('@')[0], color: myColor.value, isHost: false, ready: false }]
  const { data: upd, error: e2 } = await supabase.from('rooms').update({ players: updated }).eq('id', data.id).select().single()
  if (e2) { error.value=e2.message; loading.value=false; return }
  room.value=upd; players.value=upd.players; mode.value='lobby'; subscribe(); loading.value=false
}

async function updateMyColor() {
  if (!room.value) return
  const { data: { user } } = await supabase.auth.getUser()
  const upd = players.value.map(p=> p.id===user.id ? { ...p, color: myColor.value } : p)
  const { data } = await supabase.from('rooms').update({ players: upd }).eq('id', room.value.id).select().single()
  if (data) { players.value=data.players; room.value=data }
}
async function toggleReady() {
  if (!room.value) return
  const { data: { user } } = await supabase.auth.getUser()
  const upd = players.value.map(p=> p.id===user.id ? { ...p, ready: !p.ready } : p)
  const { data } = await supabase.from('rooms').update({ players: upd }).eq('id', room.value.id).select().single()
  if (data) { players.value=data.players; room.value=data }
}

function subscribe() {
  if (!room.value) return
  supabase.channel(`room-${room.value.id}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.value.id}` }, async payload => {
      room.value = payload.new
      players.value = payload.new.players
      // Sala persiste pública aunque se vaya el anfitrión — promueve al primero como nuevo host
      if (payload.new.players.length > 0 && !payload.new.players.find(p=>p.id===payload.new.host_id)) {
        const newHost = payload.new.players[0]
        // solo el nuevo host hace el update para evitar carrera
        const { data: { user } } = await supabase.auth.getUser()
        if (user && user.id === newHost.id) {
          const updPlayers = payload.new.players.map((p,i)=> ({...p, isHost: i===0, ready: i===0 ? true : p.ready}))
          await supabase.from('rooms').update({ host_id: newHost.id, players: updPlayers }).eq('id', payload.new.id)
        }
      }
      if (payload.new.status === 'starting') emit('start', payload.new)
    }).subscribe()
}

async function startGame() {
  if (!room.value) return
  const { data: { user } } = await supabase.auth.getUser()
  if (room.value.host_id !== user.id) { error.value='Solo anfitrión inicia'; return }
  const notReady = players.value.filter(p=>!p.ready && !p.isHost).length
  if (notReady>0) { error.value=`Esperando ${notReady} confirmaciones (anfitrión ya listo)`; return }
  await supabase.from('rooms').update({ status: 'starting' }).eq('id', room.value.id)
}

async function loadPublic() {
  const { data } = await supabase.from('rooms').select('*').in('status',['waiting','waiting_coop']).limit(10)
  return data || []
}
const publicRooms = ref([])
const myId = ref(null)
onMounted(async () => {
  publicRooms.value = await loadPublic()
  const { data: { user } } = await supabase.auth.getUser()
  myId.value = user?.id || null
  window.addEventListener('multi-coop-settings', (e) => {
    coopAllowDemolish.value = !!e.detail.allowDemolishOthers
    coopSharedResources.value = !!e.detail.sharedResources
    coopAllowCombat.value = !!e.detail.allowCombat
  })
  window.addEventListener('multi-game-mode', (e) => {
    selectedGameMode.value = e.detail.mode || 'war'
  })
})
watch([coopAllowDemolish, coopSharedResources, coopAllowCombat], () => {
  if (!room.value || !room.value.status.includes('coop')) return
  // solo host puede cambiar
  const me = players.value.find(p=>p.id===myId.value)
  if (!me?.isHost) return
  const patch = { allowDemolishOthers: coopAllowDemolish.value, sharedResources: coopSharedResources.value, allowCombat: coopAllowCombat.value }
  multiSync.setCoopSettings(patch)
  // notifica
  window.dispatchEvent(new CustomEvent('multi-chat', { detail: { sender: 'Sistema', text: `Host cambió Coop: Demoler ${patch.allowDemolishOthers?'ON':'OFF'}, Recursos ${patch.sharedResources?'compartidos':'individual'}, Combate ${patch.allowCombat?'ON':'OFF'}`, time: new Date().toLocaleTimeString(), at: Date.now() } }))
})
</script>

<template>
  <div class="absolute inset-0 z-30 flex flex-col bg-[#0a0f1e] text-white overflow-auto p-4">
    <div class="fixed inset-0 bg-[#0a0f1e] pointer-events-none"></div>
    <div class="fixed inset-0 opacity-40 pointer-events-none" style="background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 28px 28px;"></div>
    <div class="fixed inset-0 pointer-events-none" style="background: radial-gradient(ellipse at 50% 0%, rgba(168,122,248,0.18), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(56,189,248,0.12), transparent 50%);"></div>
    <div class="relative w-full max-w-[340px] md:max-w-[560px] mx-auto flex flex-col gap-4 pb-6">
      <div class="flex items-center justify-between">
        <button @click="emit('back')" class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs backdrop-blur">‹ Volver</button>
        <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif; color:#fde68a; text-shadow: 0 1px 0 #581c87;">MULTIJUGADOR — 8</h2>
        <span class="text-[10px] text-white/40 bg-black/30 px-2 py-1 rounded-full border border-white/10">En línea</span>
      </div>

      <div v-if="mode==='menu'" class="space-y-3">
        <button @click="mode='host'" class="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] border-2 border-[#22c55e] shadow-[0_6px_0_#052e16] text-white font-black active:translate-y-[2px] transition-all">🏠 Anfitrión — Crear sala</button>
        <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-xl shadow-[0_8px_0_#0f172a] p-3 space-y-2">
          <div class="text-xs font-bold">Unirse por clave</div>
          <div class="flex gap-2">
            <input v-model="key" placeholder="JND-XXXX" class="flex-1 bg-[#0f172a] border-2 border-[#334155] rounded-xl px-3 py-2 text-sm uppercase" maxlength="8" />
            <button @click="joinRoom" class="px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] border-2 border-[#38bdf8] shadow-[0_4px_0_#1e1b4b] text-white font-bold active:translate-y-[1px]">Unirse</button>
          </div>
          <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
        </div>
        <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-xl shadow-[0_8px_0_#0f172a] p-3">
          <div class="text-xs font-bold mb-2" style="color:#fde68a;">Servidores públicos</div>
          <div v-if="publicRooms.length===0" class="text-xs text-white/40">No hay salas públicas</div>
          <button v-for="r in publicRooms" :key="r.id" @click="key=r.key; joinRoom()" class="w-full text-left py-2 px-3 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] border-2 border-[#334155] text-xs flex justify-between"><span>{{ r.key }}</span><span>{{ r.players.length }}/8</span></button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs w-20">Tu color:</span>
          <button v-for="c in single.COLORS" :key="c.id" @click="myColor=c.id" class="w-6 h-6 rounded-full border-2" :style="{background:c.bg, borderColor: myColor===c.id ? '#fff' : 'transparent'}"></button>
        </div>
      </div>

      <div v-else-if="mode==='host'" class="bg-[#1e293b] border-[3px] border-[#334155] rounded-xl shadow-[0_8px_0_#0f172a] p-4 space-y-3">
        <div class="text-xs font-bold" style="color:#fde68a;">Modo de partida (8 máx)</div>
        <div class="grid grid-cols-2 gap-2">
          <button @click="selectedGameMode='war'" class="py-3 rounded-xl border-2 flex flex-col items-center gap-1 shadow-[0_4px_0_#0f172a]" :class="selectedGameMode==='war' ? 'bg-[#581c87] border-[#a78bfa] text-white' : 'bg-[#0f172a] border-[#334155] text-white/60'"><span class="text-lg">⚔️</span><span class="text-xs font-black">Guerra</span><span class="text-[9px]">Con cola %</span></button>
          <button @click="selectedGameMode='coop'" class="py-3 rounded-xl border-2 flex flex-col items-center gap-1 shadow-[0_4px_0_#0f172a]" :class="selectedGameMode==='coop' ? 'bg-[#14532d] border-[#16a34a] text-white' : 'bg-[#0f172a] border-[#334155] text-white/60'"><span class="text-lg">🏗️</span><span class="text-xs font-black">Coop Libre</span><span class="text-[9px]">Instantáneo</span></button>
        </div>
        <div class="flex gap-2">
          <button @click="isPublicRoom=true" class="flex-1 py-2 rounded-xl border-2 text-xs font-black shadow-[0_3px_0_#0f172a]" :class="isPublicRoom ? 'bg-sky-600 border-sky-400 text-white' : 'bg-[#0f172a] border-[#334155] text-white/60'">🌐 Pública</button>
          <button @click="isPublicRoom=false" class="flex-1 py-2 rounded-xl border-2 text-xs font-black shadow-[0_3px_0_#0f172a]" :class="!isPublicRoom ? 'bg-amber-600 border-amber-400 text-white' : 'bg-[#0f172a] border-[#334155] text-white/60'">🔒 Privada</button>
        </div>
        <p class="text-[10px] text-white/40">{{ isPublicRoom ? 'Aparece en servidores públicos' : 'Solo con clave JND-XXXX' }}</p>
        <div v-if="selectedGameMode==='coop'" class="bg-[#0f172a] border-2 border-[#334155] rounded-lg p-2 space-y-2">
          <div class="text-[11px] font-bold text-white">Host configura Coop</div>
          <label class="flex items-center justify-between text-xs cursor-pointer"><span>Demoler ajeno</span><input type="checkbox" v-model="coopAllowDemolish" class="accent-emerald-500" /></label>
          <label class="flex items-center justify-between text-xs cursor-pointer"><span>Recursos compartidos</span><input type="checkbox" v-model="coopSharedResources" class="accent-emerald-500" /></label>
          <label class="flex items-center justify-between text-xs cursor-pointer"><span>Combate</span><input type="checkbox" v-model="coopAllowCombat" class="accent-emerald-500" /></label>
          <p class="text-[10px] text-white/40">Se notifica a todos al cambiar en vivo. Construcción instantánea.</p>
        </div>
        <div class="text-xs font-bold" style="color:#fde68a;">Tu color anfitrión</div>
        <div class="flex gap-1.5 flex-wrap">
          <button v-for="c in single.COLORS" :key="c.id" @click="myColor=c.id" class="w-7 h-7 rounded-full border-2 shadow-[0_2px_0_#0f172a]" :style="{background:c.bg, borderColor: myColor===c.id ? '#fff' : 'transparent'}"></button>
        </div>
        <button @click="createRoom" :disabled="loading" class="w-full py-2.5 rounded-xl bg-[#16a34a] border-2 border-[#22c55e] shadow-[0_6px_0_#052e16] text-white font-black disabled:opacity-50 active:translate-y-[2px]">{{ loading ? 'Creando...' : 'Crear sala JND-XXXX' }}</button>
        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
        <button @click="mode='menu'" class="text-xs text-white/60">‹ Volver</button>
      </div>

      <div v-else-if="mode==='lobby'" class="bg-[#1e293b] border-[3px] border-[#334155] rounded-xl shadow-[0_8px_0_#0f172a] p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="font-black text-sm" style="color:#fde68a;">Sala {{ room?.key }} <span class="text-[10px] px-1.5 py-0.5 rounded-full" :class="room?.status?.includes('coop') ? 'bg-[#14532d] text-white border border-[#16a34a]' : 'bg-[#581c87] text-white border border-[#a78bfa]'">{{ room?.status?.includes('coop') ? '🏗️ Coop' : '⚔️ Guerra' }}</span> <span v-if="room?.status?.includes('private')" class="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full">🔒 Privada</span><span v-else class="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">🌐 Pública</span></span>
          <span class="text-xs bg-black/30 px-2 py-1 rounded-full border border-white/10">{{ players.length }}/8</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div v-for="p in players" :key="p.id" class="bg-[#0f172a] rounded-lg p-2 border-2 flex items-center gap-2" :class="p.ready ? 'border-emerald-500 bg-emerald-950/30' : 'border-[#334155]'">
            <span class="w-3 h-3 rounded-full" :style="{background: single.COLORS.find(c=>c.id===p.color)?.bg || '#fff'}"></span>
            <span class="text-xs truncate flex-1">{{ p.username }} {{ p.isHost ? '👑' : '' }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full" :class="p.ready ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white/60'">{{ p.ready ? '✓' : '○' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs">Tu color:</span>
          <button v-for="c in single.COLORS" :key="c.id" @click="myColor=c.id; updateMyColor()" class="w-6 h-6 rounded-full border-2 shadow-[0_2px_0_#0f172a]" :style="{background:c.bg, borderColor: myColor===c.id ? '#fff' : 'transparent'}"></button>
        </div>
        <div v-if="room?.status?.includes('coop') && players.find(p=>p.id===myId)?.isHost" class="bg-[#0f172a] border-2 border-amber-400/30 rounded-lg p-2 space-y-2">
          <div class="text-[11px] font-bold text-amber-300">Host Coop en vivo (instantáneo)</div>
          <label class="flex items-center justify-between text-xs cursor-pointer"><span>Demoler ajeno</span><input type="checkbox" v-model="coopAllowDemolish" class="accent-emerald-500" /></label>
          <label class="flex items-center justify-between text-xs cursor-pointer"><span>Recursos compartidos</span><input type="checkbox" v-model="coopSharedResources" class="accent-emerald-500" /></label>
          <label class="flex items-center justify-between text-xs cursor-pointer"><span>Combate</span><input type="checkbox" v-model="coopAllowCombat" class="accent-emerald-500" /></label>
        </div>
        <div v-else-if="room?.status?.includes('coop')" class="bg-black/20 border border-white/10 rounded-lg p-2 text-[11px] text-white/60">
          Coop Libre 8 — instantáneo. Host: {{ players.find(p=>p.isHost)?.username }} controla permisos. Demoler {{ multiSync.coopSettings.value.allowDemolishOthers ? 'ON' : 'OFF' }} • Recursos {{ multiSync.coopSettings.value.sharedResources ? 'compartidos' : 'individual' }} • Combate {{ multiSync.coopSettings.value.allowCombat ? 'ON' : 'OFF' }}
        </div>
        <button @click="toggleReady" class="w-full py-2 rounded-xl font-bold text-sm border-2 shadow-[0_4px_0_#0f172a]" :class="players.find(p=>p.id && p.ready) ? 'bg-white/10 border-white/10 text-white/70' : 'bg-sky-600 border-sky-400 text-white'">{{ players.find(p=>p.ready) ? 'Desmarcar' : '✓ Confirmar listo' }}</button>
        <p class="text-[11px] text-white/40">Anfitrión entra directo (ya listo). Invitados confirman ✓. Colores duplicados permitidos. Reconexión auto.</p>
        <button @click="startGame" class="w-full py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] border-2 border-[#22c55e] shadow-[0_6px_0_#052e16] text-white font-black active:translate-y-[2px]">▶ Entrar en terreno (Anfitrión — {{ players.filter(p=>p.ready).length }}/{{ players.length }} listos)</button>
        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
