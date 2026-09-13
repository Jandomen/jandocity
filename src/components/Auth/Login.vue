<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'

const emit = defineEmits(['success','switchSignUp'])
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

function sanitize(v, max=64) { return v.trim().slice(0, max).replace(/[<>]/g,'') }
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254 }
function preciseError(e) {
  const raw = e?.message || String(e) || ''
  const m = raw.toLowerCase()
  if (m.includes('failed to fetch') || m.includes('networkerror') || m.includes('fetch') && m.includes('failed') || m.includes('load failed') || m.includes('network request failed') || m.includes('not reachable')) return 'Sin conexión a internet o servidor no responde. Revisa tu conexión y vuelve a intentar.'
  if (m.includes('timeout') || m.includes('aborted')) return 'Tiempo de espera agotado. Revisa tu conexión.'
  if (m.includes('too many requests') || m.includes('rate limit')) return 'Demasiados intentos. Espera 1 minuto e intenta de nuevo.'
  if (m.includes('email not confirmed') || m.includes('not confirmed') || m.includes('confirm')) return 'Correo no confirmado. Revisa tu bandeja y confirma tu cuenta.'
  if (m.includes('invalid login') || m.includes('invalid credentials') || m.includes('user not found')) return 'Correo o contraseña incorrectos.'
  if (m.includes('invalid') && m.includes('password')) return 'Contraseña incorrecta.'
  return raw || 'Error desconocido. Intenta de nuevo.'
}

async function handleLogin() {
  error.value=''
  const e = sanitize(email.value, 254).toLowerCase()
  if (!validEmail(e)) { error.value='Correo inválido. Ej: tu@correo.com'; return }
  if (password.value.length < 6) { error.value='Contraseña requerida (mín 6 caracteres)'; return }
  loading.value=true
  try {
    const { error: err } = await supabase.auth.signInWithPassword({ email: e, password: password.value })
    if (err) throw err
    emit('success')
  } catch (e) {
    error.value = preciseError(e)
  } finally { loading.value=false }
}
</script>

<template>
  <div class="bg-slate-800/80 rounded-xl border border-white/10 p-4 space-y-3">
    <h3 class="font-black text-sm">Iniciar sesión</h3>
    <input v-model="email" type="email" placeholder="Correo" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" autocomplete="email" />
    <div class="relative">
      <input v-model="password" :type="showPass ? 'text' : 'password'" placeholder="Contraseña" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm" autocomplete="current-password" />
      <button type="button" @click="showPass=!showPass" class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white" :title="showPass ? 'Ocultar' : 'Ver'">{{ showPass ? '🙈' : '👁️' }}</button>
    </div>
    <p v-if="error" class="text-xs text-red-400 bg-red-950/30 border border-red-800 rounded px-2 py-1">{{ error }}</p>
    <button @click="handleLogin" :disabled="loading" class="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold disabled:opacity-50">{{ loading ? 'Entrando...' : 'Entrar' }}</button>
    <button @click="emit('switchSignUp')" class="w-full text-xs text-emerald-300 hover:text-emerald-200">¿No tienes cuenta? Regístrate</button>
  </div>
</template>
