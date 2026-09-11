<script setup>
import { ref } from 'vue'
import SignUp from './SignUp.vue'
import Login from './Login.vue'

defineProps({ show: Boolean })
const emit = defineEmits(['close','authenticated'])
const mode = ref('login') // login | signup
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
    <div class="w-full max-w-[400px] space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-black tracking-widest text-sm" style="font-family:'Cinzel',serif;">JANDOCITY — CUENTA</h2>
        <button @click="emit('close')" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white">✕</button>
      </div>
      <SignUp v-if="mode==='signup'" @success="emit('authenticated')" @switchLogin="mode='login'" />
      <Login v-else @success="emit('authenticated')" @switchSignUp="mode='signup'" />
    </div>
  </div>
</template>
