<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'

const emit = defineEmits(['success','switchLogin'])
const email = ref('')
const username = ref('')
const password = ref('')
const phone = ref('')
const loading = ref(false)
const error = ref('')
const ok = ref('')
const showPass = ref(false)

function sanitize(v, max=64) { return v.trim().slice(0, max).replace(/[<>]/g,'') }
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254 }
function validUsername(v) { return /^[a-zA-Z0-9_]{3,20}$/.test(v) }
function validPhone(v) { return /^\+?\d{8,15}$/.test(v.replace(/\s/g,'')) }
function preciseError(e) {
  const raw = e?.message || String(e) || ''
  const m = raw.toLowerCase()
  if (m.includes('failed to fetch') || m.includes('networkerror') || (m.includes('fetch') && m.includes('failed')) || m.includes('load failed') || m.includes('network request failed') || m.includes('not reachable')) return 'Sin conexión a internet o servidor no responde. Revisa tu conexión.'
  if (m.includes('timeout') || m.includes('aborted')) return 'Tiempo de espera agotado.'
  if (m.includes('too many requests') || m.includes('rate limit')) return 'Demasiados intentos. Espera 1 minuto.'
  if (m.includes('already registered') || m.includes('user already exists') || (m.includes('already exists') && m.includes('user'))) return 'Correo ya registrado. Usa otro o inicia sesión.'
  if (m.includes('duplicate') && m.includes('phone')) return 'Número telefónico ya en uso por otra cuenta.'
  if (m.includes('phone') && m.includes('exists')) return 'Número telefónico ya en uso.'
  if (m.includes('username') && m.includes('exists')) return 'Usuario ya ocupado. Elige otro.'
  if (m.includes('password') && m.includes('weak')) return 'Contraseña muy débil. Usa 6+ caracteres variados.'
  if (m.includes('password should be')) return 'Contraseña no cumple requisitos.'
  return raw || 'Error desconocido.'
}

async function handleSignUp() {
  error.value=''; ok.value=''
  const e = sanitize(email.value, 254).toLowerCase()
  const u = sanitize(username.value, 20)
  const p = phone.value.trim().replace(/\s/g,'')
  if (!validEmail(e)) { error.value='Correo inválido. Ej: tu@correo.com'; return }
  if (!validUsername(u)) { error.value='Usuario 3-20 alfanuméricos o _ (sin espacios)'; return }
  if (password.value.length < 6 || password.value.length > 72) { error.value='Contraseña 6-72 caracteres'; return }
  if (!validPhone(p)) { error.value='Teléfono 8-15 dígitos (+ opcional). Ej: +525551234567'; return }
  loading.value = true
  try {
    // verifica duplicado usuario y telefono si existe tabla profiles
    try {
      const { data: dupU } = await supabase.from('profiles').select('username').ilike('username', u).limit(1)
      if (dupU && dupU.length) throw new Error('Usuario ya ocupado, elige otro')
    } catch (dupErr) {
      if (String(dupErr.message).includes('Usuario ya ocupado')) throw dupErr
    }
    try {
      const { data: dupP } = await supabase.from('profiles').select('phone').eq('phone', p).limit(1)
      if (dupP && dupP.length) throw new Error('Número telefónico ya en uso por otra cuenta')
      // fallback si columna es phone en user_metadata json?
      const { data: dupP2 } = await supabase.from('profiles').select('id').ilike('phone', `%${p}%`).limit(1).catch(()=>({data:null}))
      if (dupP2 && dupP2.length) throw new Error('Número telefónico ya en uso por otra cuenta')
    } catch (dupErr2) {
      if (String(dupErr2.message).includes('Número telefónico ya en uso')) throw dupErr2
    }
    const { data, error: err } = await supabase.auth.signUp({
      email: e,
      password: password.value,
      options: { data: { username: u, phone: p } }
    })
    if (err) throw err
    // si confirmación por correo está activa, no hay sesión inmediata
    if (!data.user && !data.session) {
      ok.value='Cuenta creada — revisa tu correo para confirmar'
    } else {
      ok.value='Cuenta creada — ya puedes entrar'
    }
    emit('success')
  } catch (e) {
    error.value = preciseError(e)
  } finally { loading.value=false }
}
</script>

<template>
  <div class="bg-slate-800/80 rounded-xl border border-white/10 p-4 space-y-3">
    <h3 class="font-black text-sm">Crear cuenta Jandocity</h3>
    <input v-model="email" type="email" placeholder="Correo" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" autocomplete="email" />
    <input v-model="username" type="text" placeholder="Usuario" maxlength="20" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" autocomplete="username" />
    <div class="relative">
      <input v-model="password" :type="showPass ? 'text' : 'password'" placeholder="Contraseña" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm" autocomplete="new-password" />
      <button type="button" @click="showPass=!showPass" class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white" :title="showPass ? 'Ocultar' : 'Ver'">{{ showPass ? '🙈' : '👁️' }}</button>
    </div>
    <input v-model="phone" type="tel" placeholder="Tel +52..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" autocomplete="tel" />
    <p v-if="error" class="text-xs text-red-400 bg-red-950/30 border border-red-800 rounded px-2 py-1">{{ error }}</p>
    <p v-if="ok" class="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800 rounded px-2 py-1">{{ ok }}</p>
    <button @click="handleSignUp" :disabled="loading" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-50">{{ loading ? 'Creando...' : 'Crear cuenta' }}</button>
    <button @click="emit('switchLogin')" class="w-full text-xs text-sky-300 hover:text-sky-200">¿Ya tienes cuenta? Inicia sesión</button>
  </div>
</template>
