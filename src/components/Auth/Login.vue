<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'

const emit = defineEmits(['success','switchSignUp'])
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

function sanitize(v, max=64) { return v.trim().slice(0, max).replace(/[<>]/g,'') }
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254 }

async function handleLogin() {
  error.value=''
  const e = sanitize(email.value, 254).toLowerCase()
  if (!validEmail(e)) { error.value='Correo inválido'; return }
  if (password.value.length < 6) { error.value='Contraseña requerida'; return }
  loading.value=true
  try {
    const { error: err } = await supabase.auth.signInWithPassword({ email: e, password: password.value })
    if (err) throw err
    emit('success')
  } catch (e) {
    const m = (e.message || '').toLowerCase()
    if (m.includes('invalid login') || m.includes('invalid') || m.includes('not confirmed')) error.value = 'Credenciales incorrectas o correo no confirmado'
    else error.value = e.message
  } finally { loading.value=false }
}
</script>

<template>
  <div class="bg-slate-800/80 rounded-xl border border-white/10 p-4 space-y-3">
    <h3 class="font-black text-sm">Iniciar sesión</h3>
    <input v-model="email" type="email" placeholder="Correo" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
    <input v-model="password" type="password" placeholder="Contraseña" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
    <p v-if="error" class="text-xs text-red-400 bg-red-950/30 border border-red-800 rounded px-2 py-1">{{ error }}</p>
    <button @click="handleLogin" :disabled="loading" class="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold disabled:opacity-50">{{ loading ? 'Entrando...' : 'Entrar' }}</button>
    <button @click="emit('switchSignUp')" class="w-full text-xs text-emerald-300 hover:text-emerald-200">¿No tienes cuenta? Regístrate</button>
  </div>
</template>
