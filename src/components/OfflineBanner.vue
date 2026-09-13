<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMultiplayerSync } from '@/composables/useMultiplayerSync.js'
const multiSync = useMultiplayerSync()
const online = ref(navigator.onLine)
function upd() { online.value = navigator.onLine }
onMounted(() => { window.addEventListener('online', upd); window.addEventListener('offline', upd) })
onUnmounted(() => { window.removeEventListener('online', upd); window.removeEventListener('offline', upd) })
</script>

<template>
  <div v-if="!online && multiSync.isActive && multiSync.isActive()" class="fixed top-0 left-0 right-0 z-[80] bg-red-600 text-white text-xs font-bold text-center py-1.5">📡 Sin señal — reconectando al servidor...</div>
</template>
