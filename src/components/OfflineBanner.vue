<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const online = ref(navigator.onLine)
function upd() { online.value = navigator.onLine }
onMounted(() => { window.addEventListener('online', upd); window.addEventListener('offline', upd) })
onUnmounted(() => { window.removeEventListener('online', upd); window.removeEventListener('offline', upd) })
</script>

<template>
  <div v-if="!online" class="fixed top-0 left-0 right-0 z-[80] bg-red-600 text-white text-xs font-bold text-center py-1.5">📡 Sin señal — revisa tu conexión</div>
</template>
