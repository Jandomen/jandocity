<script setup>
import { WEAPONS } from '@/config/weapons.js'
import { supabase } from '@/lib/supabase.js'

async function buy(w) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return alert('Inicia sesión')
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weaponId: w.id, priceMX: w.priceMX, userId: user.id })
  })
  const { url, error } = await res.json()
  if (error) return alert(error)
  window.location.href = url
}
</script>

<template>
  <div class="bg-slate-900/80 rounded-xl border border-amber-500/30 p-3 space-y-2">
    <div class="text-xs font-black tracking-widest text-amber-300">🏪 ARSENAL EXCLUSIVO — Solo Multijugador</div>
    <div class="grid grid-cols-2 gap-2">
      <div v-for="w in WEAPONS" :key="w.id" class="bg-slate-800 rounded-lg border border-white/10 p-2 flex flex-col gap-1">
        <span class="text-lg">{{ w.icon }}</span>
        <span class="text-xs font-bold">{{ w.label }}</span>
        <span class="text-[11px] text-white/60">{{ w.desc }} • Daño {{ w.damage }}</span>
        <span class="text-xs font-mono text-emerald-400">${{ w.priceMX }} MXN</span>
        <button @click="buy(w)" class="mt-1 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold">Comprar</button>
      </div>
    </div>
    <p class="text-[10px] text-white/40">Pago automático vía Stripe → se refleja al instante y podrás seleccionarlo como en Un Jugador, pero con armamento superior.</p>
  </div>
</template>
