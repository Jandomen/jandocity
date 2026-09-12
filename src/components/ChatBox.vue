<script setup>
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['send','close'])

const text = ref('')
const listRef = ref(null)

function send() {
  let t = text.value.trim().slice(0, 80)
  if (!t) return
  if (t.length > 80) t = t.slice(0, 80)
  emit('send', t)
  text.value = ''
}

watch(() => props.messages.length, async () => {
  await nextTick()
  if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
})
</script>

<template>
  <div v-if="show" class="absolute inset-0 z-40 flex flex-col justify-end p-3 md:p-4 pointer-events-none">
    <!-- fondo semitransparente para no tapar juego pero legible -->
    <div class="w-full max-w-[380px] md:max-w-[360px] bg-slate-900/85 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-slate-800/60">
        <span class="text-xs font-black tracking-wider">💬 Chat</span>
        <span class="text-[10px] text-white/40">T para escribir • Enter enviar • Esc cerrar</span>
        <button @click="emit('close')" class="ml-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs">✕</button>
      </div>
      <div ref="listRef" class="flex-1 max-h-[22vh] md:max-h-[28vh] overflow-auto p-2 space-y-1.5">
        <div v-if="messages.length===0" class="text-center text-[11px] text-white/40 py-6">Sin mensajes — escribe el primero con <span class="font-mono bg-white/10 px-1 rounded">T</span></div>
        <div v-for="m in messages" :key="m.id" class="flex flex-col gap-0.5">
          <div class="flex items-baseline gap-1.5">
            <span class="text-[10px] font-bold text-emerald-300">{{ m.sender }}</span>
            <span class="text-[9px] text-white/30 font-mono">{{ m.time }}</span>
          </div>
          <div class="bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs leading-tight break-words">{{ m.text }}</div>
        </div>
      </div>
      <form @submit.prevent="send" class="flex items-center gap-2 p-2 border-t border-white/10 bg-slate-800/40">
        <input v-model="text" type="text" maxlength="80" placeholder="Oración corta (80)…" class="flex-1 bg-slate-900 border border-slate-700 rounded-full px-3 py-2 text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-500" autofocus />
        <button type="submit" class="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0">Enviar</button>
      </form>
      <div class="px-3 py-1 text-[10px] text-white/30 text-center">Local por ahora — multijugador usará Supabase Realtime</div>
    </div>
  </div>
</template>
