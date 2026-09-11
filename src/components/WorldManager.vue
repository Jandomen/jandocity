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
  <div class="absolute inset-0 z-30 flex flex-col bg-[#0f172a] text-white overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-60"></div>

    <div class="relative flex-1 flex flex-col max-w-[560px] w-full mx-auto p-4 gap-4 overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between shrink-0">
        <button @click="emit('back')" class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs">‹ Volver</button>
        <h2 class="font-black tracking-widest text-sm md:text-base" style="font-family:'Cinzel',serif;">MODO LIBRE — TUS MUNDOS</h2>
        <span class="text-[11px] text-white/50 font-mono">{{ worlds.length }} mundo(s)</span>
      </div>

      <!-- Crear -->
      <div class="bg-slate-800/80 backdrop-blur rounded-xl border border-white/10 p-3 flex flex-col gap-2 shrink-0">
        <div class="text-xs font-bold tracking-wider text-emerald-300">+ Crear mundo local</div>
        <div class="flex gap-2">
          <input v-model="newName" @keydown.enter="handleCreate" placeholder="Nombre del mundo (ej: Ciudad del Norte)" maxlength="28" class="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-500" />
          <button @click="handleCreate" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shrink-0">Crear</button>
        </div>
        <p class="text-[11px] text-white/50 leading-tight">Se guarda en tu dispositivo. Puedes crear y eliminar mundos sin límites.</p>
      </div>

      <!-- Lista -->
      <div class="flex-1 overflow-auto flex flex-col gap-2 pr-1">
        <div v-if="worlds.length===0" class="flex-1 flex flex-col items-center justify-center gap-2 text-white/50 py-12">
          <span class="text-3xl">🌍</span>
          <span class="text-sm">Aún no tienes mundos</span>
          <span class="text-xs">Crea uno arriba para empezar</span>
        </div>

        <div v-for="w in worlds" :key="w.id" class="bg-slate-800/70 backdrop-blur rounded-xl border border-white/10 p-3 flex items-center gap-3 hover:bg-slate-700/60 transition-colors">
          <div class="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center text-lg shrink-0">🏙️</div>
          <div class="flex-1 min-w-0 text-left">
            <div class="font-bold text-sm truncate">{{ w.name }}</div>
            <div class="text-[11px] text-white/50 font-mono">Creado {{ formatDate(w.createdAt) }} • Actualizado {{ formatDate(w.updatedAt) }}</div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button @click="emit('play', w.id)" class="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold">Jugar ▶</button>
            <button @click="handleDelete(w.id)" class="px-2 py-1.5 rounded-lg border text-xs" :class="confirmDelete===w.id ? 'bg-red-600 border-red-500 text-white' : 'bg-white/10 border-white/10 text-white/70 hover:bg-red-600/20'">{{ confirmDelete===w.id ? '¿Seguro? toca otra vez' : '🗑️' }}</button>
          </div>
        </div>
      </div>

      <p class="text-[10px] text-white/30 text-center shrink-0">Modo libre = offline local. Un jugador / Multijugador llegarán con Supabase.</p>
    </div>
  </div>
</template>
