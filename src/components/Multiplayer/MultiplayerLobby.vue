<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'

const emit = defineEmits(['start','back'])
const single = useSinglePlayerStore()
const mode = ref('menu') // menu | host | join | lobby
const key = ref('')
const room = ref(null)
const myColor = ref('blue')
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
  const { data, error: err } = await supabase.from('rooms').insert({ key: k, host_id: user.id, max_players: 8, players: [{ id: user.id, username: user.email.split('@')[0], color: myColor.value, isHost: true, ready: false }], status: 'waiting' }).select().single()
  if (err) { error.value=err.message; loading.value=false; return }
  room.value = data
  players.value = data.players
  mode.value='lobby'
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
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.value.id}` }, payload => {
      room.value = payload.new
      players.value = payload.new.players
      if (payload.new.status === 'starting') emit('start', payload.new)
    }).subscribe()
}

async function startGame() {
  if (!room.value) return
  const { data: { user } } = await supabase.auth.getUser()
  if (room.value.host_id !== user.id) { error.value='Solo anfitrión inicia'; return }
  const notReady = players.value.filter(p=>!p.ready).length
  if (notReady>0) { error.value=`Esperando ${notReady} confirmaciones`; return }
  await supabase.from('rooms').update({ status: 'starting' }).eq('id', room.value.id)
}

async function loadPublic() {
  const { data } = await supabase.from('rooms').select('*').eq('status','waiting').limit(10)
  return data || []
}
const publicRooms = ref([])
onMounted(async () => { publicRooms.value = await loadPublic() })
</script>

<template>
  <div class="absolute inset-0 z-30 flex flex-col bg-[#0f172a] text-white overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-60"></div>
    <div class="relative flex-1 flex flex-col max-w-[560px] w-full mx-auto p-4 gap-4 overflow-auto">
      <div class="flex items-center justify-between">
        <button @click="emit('back')" class="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs">‹ Volver</button>
        <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif;">MULTIJUGADOR — 8</h2>
        <span class="text-[10px] text-white/40">En línea</span>
      </div>

      <div v-if="mode==='menu'" class="space-y-3">
        <button @click="mode='host'" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black">🏠 Anfitrión — Crear sala</button>
        <div class="bg-slate-800/80 rounded-xl border border-white/10 p-3 space-y-2">
          <div class="text-xs font-bold">Unirse por clave</div>
          <div class="flex gap-2">
            <input v-model="key" placeholder="JND-XXXX" class="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm uppercase" maxlength="8" />
            <button @click="joinRoom" class="px-4 py-2 rounded-lg bg-sky-600 text-white font-bold">Unirse</button>
          </div>
          <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
        </div>
        <div class="bg-slate-800/60 rounded-xl border border-white/10 p-3">
          <div class="text-xs font-bold mb-2">Servidores públicos</div>
          <div v-if="publicRooms.length===0" class="text-xs text-white/40">No hay salas públicas</div>
          <button v-for="r in publicRooms" :key="r.id" @click="key=r.key; joinRoom()" class="w-full text-left py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 border border-white/10 text-xs flex justify-between"><span>{{ r.key }}</span><span>{{ r.players.length }}/8</span></button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs w-20">Tu color:</span>
          <button v-for="c in single.COLORS" :key="c.id" @click="myColor=c.id" class="w-6 h-6 rounded-full border-2" :style="{background:c.bg, borderColor: myColor===c.id ? '#fff' : 'transparent'}"></button>
        </div>
      </div>

      <div v-else-if="mode==='host'" class="bg-slate-800/80 rounded-xl border border-white/10 p-4 space-y-3">
        <div class="text-xs font-bold">Tu color anfitrión</div>
        <div class="flex gap-1.5 flex-wrap">
          <button v-for="c in single.COLORS" :key="c.id" @click="myColor=c.id" class="w-7 h-7 rounded-full border-2" :style="{background:c.bg, borderColor: myColor===c.id ? '#fff' : 'transparent'}"></button>
        </div>
        <button @click="createRoom" :disabled="loading" class="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50">{{ loading ? 'Creando...' : 'Crear sala JND-XXXX' }}</button>
        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
        <button @click="mode='menu'" class="text-xs text-white/60">‹ Volver</button>
      </div>

      <div v-else-if="mode==='lobby'" class="bg-slate-800/80 rounded-xl border border-white/10 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="font-black text-sm">Sala {{ room?.key }}</span>
          <span class="text-xs bg-white/10 px-2 py-1 rounded-full">{{ players.length }}/8</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div v-for="p in players" :key="p.id" class="bg-slate-900 rounded-lg p-2 border flex items-center gap-2" :class="p.ready ? 'border-emerald-500 bg-emerald-950/30' : 'border-white/10'">
            <span class="w-3 h-3 rounded-full" :style="{background: single.COLORS.find(c=>c.id===p.color)?.bg || '#fff'}"></span>
            <span class="text-xs truncate flex-1">{{ p.username }} {{ p.isHost ? '👑' : '' }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full" :class="p.ready ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white/60'">{{ p.ready ? '✓' : '○' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs">Tu color:</span>
          <button v-for="c in single.COLORS" :key="c.id" @click="myColor=c.id; updateMyColor()" class="w-6 h-6 rounded-full border-2" :style="{background:c.bg, borderColor: myColor===c.id ? '#fff' : 'transparent'}"></button>
        </div>
        <button @click="toggleReady" class="w-full py-2 rounded-xl font-bold text-sm border" :class="players.find(p=>p.id && p.ready) ? 'bg-white/10 border-white/10 text-white/70' : 'bg-sky-600 border-sky-500 text-white'">{{ players.find(p=>p.ready) ? 'Desmarcar' : '✓ Confirmar listo' }}</button>
        <p class="text-[11px] text-white/40">Cada uno elige su color flexible (duplicados permitidos). Todos deben confirmar ✓ antes de que anfitrión entre en terreno. Reconexión automática si se cae la señal.</p>
        <button @click="startGame" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black">▶ Entrar en terreno (Anfitrión — {{ players.filter(p=>p.ready).length }}/{{ players.length }} listos)</button>
        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
