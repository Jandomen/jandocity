<script setup>
import { ref, onMounted } from 'vue'
import { loadWorlds, createWorld, deleteWorld } from '@/utils/worldPersistence.js'

const emit = defineEmits(['play','back'])

const worlds = ref([])
const newName = ref('')
const confirmDelete = ref(null)

function refresh() { worlds.value = loadWorlds() }
onMounted(refresh)

function handleCreate() {
  const w = createWorld(newName.value || `Mundo ${worlds.value.length + 1}`)
  newName.value = ''
  refresh()
}

function handleDelete(id) {
  if (confirmDelete.value !== id) { confirmDelete.value = id; setTimeout(()=> confirmDelete.value=null, 3000); return }
  deleteWorld(id)
  confirmDelete.value = null
  refresh()
}

function formatDate(ts) {
  try { return new Date(ts).toLocaleString('es-MX', { dateStyle:'short', timeStyle:'short' }) } catch { return '' }
}
</script>

<template>
  <div class="absolute inset-0 z-30 flex flex-col bg-[#0a0f1e] text-white overflow-auto">
    <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 28px 28px;"></div>
    <div class="relative flex-1 flex flex-col max-w-[340px] md:max-w-[560px] w-full mx-auto p-4 gap-4 min-h-[100dvh]">
      <div class="bg-[#1e293b] border-[3px] border-[#334155] rounded-xl shadow-[0_6px_0_#0f172a] p-3 flex items-center justify-between">
        <button @click="emit('back')" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-black">‹ Volver</button>
        <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif; color:#fde68a; text-shadow: 0 1px 0 #92400e;">TUS MUNDOS</h2>
        <span class="text-[11px] text-white/50 font-mono bg-black/30 px-2 py-1 rounded-full border border-white/10">{{ worlds.length }}</span>
      </div>

      <div class="bg-[#14532d] border-2 border-[#16a34a] rounded-xl shadow-[0_6px_0_#052e16] p-3 flex flex-col gap-2">
        <div class="text-xs font-black tracking-wider text-white" style="text-shadow: 0 1px 0 #052e16;">+ CREAR MUNDO</div>
        <div class="flex gap-2">
          <input v-model="newName" @keydown.enter="handleCreate" placeholder="Ciudad del Norte" maxlength="28" class="flex-1 bg-black/30 border-2 border-[#16a34a] rounded-lg px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-emerald-400 text-white" />
          <button @click="handleCreate" class="px-5 py-2 rounded-lg bg-white text-[#14532d] font-black shadow-[0_3px_0_#052e16] active:translate-y-[2px]">Crear</button>
        </div>
      </div>

      <div class="flex-1 flex flex-col gap-2">
        <div v-if="worlds.length===0" class="flex-1 flex flex-col items-center justify-center gap-2 text-white/50 py-12 bg-black/20 rounded-xl border-2 border-dashed border-white/10">
          <span class="text-3xl">🌍</span>
          <span class="text-sm font-black">Sin mundos</span>
          <span class="text-xs">Crea uno arriba</span>
        </div>
        <div v-for="w in worlds" :key="w.id" class="bg-[#1e293b] border-2 border-[#334155] rounded-xl shadow-[0_4px_0_#0f172a] p-3 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#0f172a] border-2 border-[#334155] flex items-center justify-center text-lg">🏙️</div>
          <div class="flex-1 min-w-0 text-left">
            <div class="font-black text-sm text-white truncate" style="text-shadow: 0 1px 0 #000;">{{ w.name }}</div>
            <div class="text-[11px] text-white/50 font-mono">{{ formatDate(w.createdAt) }}</div>
          </div>
          <button @click="emit('play', w.id)" class="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-black shadow-[0_3px_0_#052e16] text-xs">Jugar ▶</button>
          <button @click="handleDelete(w.id)" class="px-2 py-2 rounded-lg border-2 text-xs font-black" :class="confirmDelete===w.id ? 'bg-red-600 border-red-400 text-white' : 'bg-white/10 border-white/10 text-white/60'">{{ confirmDelete===w.id ? '¿Seguro?' : '🗑️' }}</button>
        </div>
      </div>

      <div class="text-center text-[10px] text-white/30 font-mono bg-black/20 rounded-full py-1 border border-white/5">JANDOSOFT • Tus mundos en tu dispositivo</div>
    </div>
  </div>
</template>
