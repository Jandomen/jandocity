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

function sanitize(v, max=64) { return v.trim().slice(0, max).replace(/[<>]/g,'') }
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254 }
function validUsername(v) { return /^[a-zA-Z0-9_]{3,20}$/.test(v) }
function validPhone(v) { return /^\+?\d{8,15}$/.test(v.replace(/\s/g,'')) }

async function handleSignUp() {
  error.value=''; ok.value=''
  const e = sanitize(email.value, 254).toLowerCase()
  const u = sanitize(username.value, 20)
  const p = phone.value.trim()
  if (!validEmail(e)) { error.value='Correo inválido'; return }
  if (!validUsername(u)) { error.value='Usuario 3-20 alfanuméricos o _'; return }
  if (password.value.length < 6 || password.value.length > 72) { error.value='Contraseña 6-72 caracteres'; return }
  if (!validPhone(p)) { error.value='Teléfono 8-15 dígitos (+ opcional)'; return }
  loading.value = true
  try {
    // verifica duplicado correo/usuario si existe tabla profiles
    try {
      const { data: dup } = await supabase.from('profiles').select('username').ilike('username', u).limit(1)
      if (dup && dup.length) throw new Error('Usuario ya existe, elige otro')
    } catch (dupErr) {
      if (dupErr.message === 'Usuario ya existe, elige otro') throw dupErr
    }
    const { data, error: err } = await supabase.auth.signUp({
      email: e,
      password: password.value,
      options: { data: { username: u, phone: sanitize(p, 20) } }
    })
    if (err) {
      const msg = (err.message || '').toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('duplicate') || msg.includes('user already')) throw new Error('Correo ya registrado')
      throw err
    }
    // si confirmación por correo está activa, no hay sesión inmediata
    if (!data.user && !data.session) {
      ok.value='Cuenta creada — revisa tu correo para confirmar'
    } else {
      ok.value='Cuenta creada — ya puedes entrar'
    }
    emit('success')
  } catch (e) {
    const m = (e.message || '').toLowerCase()
    if (m.includes('already registered') || m.includes('already exists') || m.includes('duplicate')) error.value = 'Correo ya registrado'
    else if (m.includes('usuario ya existe')) error.value = e.message
    else error.value = e.message || 'Error al crear cuenta'
  } finally { loading.value=false }
}
</script>

<template>
  <div class="bg-slate-800/80 rounded-xl border border-white/10 p-4 space-y-3">
    <h3 class="font-black text-sm">Crear cuenta Jandocity</h3>
    <input v-model="email" type="email" placeholder="Correo" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
    <input v-model="username" type="text" placeholder="Usuario" maxlength="20" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
    <input v-model="password" type="password" placeholder="Contraseña" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
    <input v-model="phone" type="tel" placeholder="Tel +52..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
    <p v-if="error" class="text-xs text-red-400 bg-red-950/30 border border-red-800 rounded px-2 py-1">{{ error }}</p>
    <p v-if="ok" class="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800 rounded px-2 py-1">{{ ok }}</p>
    <button @click="handleSignUp" :disabled="loading" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-50">{{ loading ? 'Creando...' : 'Crear cuenta' }}</button>
    <button @click="emit('switchLogin')" class="w-full text-xs text-sky-300 hover:text-sky-200">¿Ya tienes cuenta? Inicia sesión</button>
  </div>
</template>
