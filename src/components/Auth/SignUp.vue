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

function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function validPhone(v) { return /^\+?\d{8,15}$/.test(v.replace(/\s/g,'')) }

async function handleSignUp() {
  error.value=''; ok.value=''
  if (!validEmail(email.value)) { error.value='Correo inválido'; return }
  if (username.value.trim().length < 3) { error.value='Usuario mínimo 3 caracteres'; return }
  if (password.value.length < 6) { error.value='Contraseña mínimo 6 caracteres'; return }
  if (!validPhone(phone.value)) { error.value='Teléfono 8-15 dígitos (+ opcional)'; return }
  loading.value = true
  try {
    const { data, error: err } = await supabase.auth.signUp({
      email: email.value.trim(),
      password: password.value,
      options: { data: { username: username.value.trim(), phone: phone.value.trim() } }
    })
    if (err) throw err
    ok.value='Cuenta creada — revisa tu correo'
    emit('success')
  } catch (e) {
    error.value = e.message || 'Error al crear cuenta'
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
