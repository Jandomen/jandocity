<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useGameLoop } from '@/composables/useGameLoop.js'
import { useAudioEvents } from '@/audio/useAudioEvents.js'
import ResourceBar from '@/components/ResourceBar.vue'
import ToolPalette from '@/components/ToolPalette.vue'
import CityGrid from '@/components/CityGrid.vue'
import AudioControls from '@/components/AudioControls.vue'
import Joystick from '@/components/Joystick.vue'
import DPad from '@/components/DPad.vue'
import MobileToolCarousel from '@/components/MobileToolCarousel.vue'
import SplashScreen from '@/components/SplashScreen.vue'
import MainMenu from '@/components/MainMenu.vue'
import WorldManager from '@/components/WorldManager.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import PauseMenu from '@/components/PauseMenu.vue'
import { useAudioManager } from '@/audio/audioManager.js'
import { getWorld, setActiveWorldId, getActiveWorldId, clearActiveWorldId, updateWorldData } from '@/utils/worldPersistence.js'
import { useServiceSpawns } from '@/composables/useServiceSpawns.js'

const city = useCityStore()
const player = usePlayerStore()

useAudioEvents(city)
const audioMgr = useAudioManager()

// Flujo: splash (2s) -> menu -> worlds / loading -> playing
const appState = ref('splash') // splash | menu | loading | worlds | playing
const loadingText = ref('Cargando...')
const loadingSub = ref('')
const activeWorldId = ref(getActiveWorldId() || null)
const showUI = ref(true)
const isPaused = ref(false)
const joystickType = ref(localStorage.getItem('jandocity-joystick') || 'thumb')

watch(joystickType, (v) => { try { localStorage.setItem('jandocity-joystick', v) } catch {} })

const serviceSpawns = useServiceSpawns()

useGameLoop(() => {
  if (appState.value === 'playing' && !isPaused.value) city.tick()
}, { interval: 2000 })

watch(() => [appState.value, isPaused.value], ([state, paused]) => {
  if (state === 'playing' && !paused) serviceSpawns.start()
  else serviceSpawns.stop()
})

function togglePause() {
  if (appState.value !== 'playing') return
  isPaused.value = !isPaused.value
  if (isPaused.value) city.pause()
  else city.resume()
}
function resumeGame() { isPaused.value = false; city.resume() }

function onKeydown(e) {
  if (appState.value !== 'playing') return
  const tag = document.activeElement?.tagName
  const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable
  if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping) {
    if (!isPaused.value) showUI.value = !showUI.value
  }
  if (e.key.toLowerCase() === 'n' && !isTyping && !e.ctrlKey && !e.metaKey) {
    audioMgr.init()
    const next = audioMgr.music.next()
    city.logs.unshift(`[Audio] ▶ ${audioMgr.music.tracks[next].label} (${audioMgr.music.tracks[next].mood}) — N para siguiente`)
    if (city.logs.length > 50) city.logs.pop()
  }
  if (e.key.toLowerCase() === 'escape' && !isTyping) {
    togglePause()
  }
}

function handleMenuSelect(mode) {
  if (mode === 'free') {
    loadingText.value = 'Cargando...'
    loadingSub.value = 'Preparando tus mundos locales'
    appState.value = 'loading'
    setTimeout(() => { appState.value = 'worlds' }, 700)
  } else if (mode === 'single') {
    loadingText.value = 'Entrando al servidor...'
    loadingSub.value = 'Conectando con Jandocity • Supabase (próximamente)'
    appState.value = 'loading'
    setTimeout(() => {
      appState.value = 'menu'
      city.logs.unshift('[Sistema] Un jugador — Próximamente: requiere cuenta Jandocity + Supabase')
    }, 1600)
  } else if (mode === 'multi') {
    loadingText.value = 'Entrando al servidor...'
    loadingSub.value = 'Buscando partida multijugador • modo Age of Empires (próximamente)'
    appState.value = 'loading'
    setTimeout(() => {
      appState.value = 'menu'
      city.logs.unshift('[Sistema] Multijugador — Próximamente: elimina al rival para ganar')
    }, 1600)
  }
}

function handlePlay(worldId) {
  loadingText.value = 'Cargando mundo...'
  loadingSub.value = 'Generando terreno y edificios'
  appState.value = 'loading'
  setTimeout(() => {
    const w = getWorld(worldId)
    if (!w) { appState.value = 'worlds'; return }
    city.loadFromData(w.data)
    city.syncDerivedResources()
    activeWorldId.value = worldId
    setActiveWorldId(worldId)
    // restaurar jugador si estaba en ese mundo (global por ahora)
    try {
      const p = JSON.parse(localStorage.getItem('jandocity-player') || 'null')
      if (p && typeof p.x === 'number' && typeof p.y === 'number') {
        player.setPos(p.x, p.y)
        if (p.dir) player.dir = p.dir
      }
    } catch {}
    appState.value = 'playing'
    showUI.value = true
  }, 800)
}

function exitToMenu() {
  // guardar mundo actual antes de salir
  if (activeWorldId.value) {
    try { updateWorldData(activeWorldId.value, city.getSaveData()) } catch {}
    try { localStorage.setItem('jandocity-player', JSON.stringify({ x: player.x, y: player.y, dir: player.dir })) } catch {}
    try { city.flushSave() } catch {}
  }
  isPaused.value = false
  city.resume()
  appState.value = 'menu'
  loadingText.value = 'Cargando...'
}

 // autosave al mundo activo cada 2s + al cambiar
let worldSaveTimer = null
watch(() => [city.money, city.tickCount], () => {
  if (appState.value !== 'playing' || !activeWorldId.value) return
  clearTimeout(worldSaveTimer)
  worldSaveTimer = setTimeout(() => {
    try { updateWorldData(activeWorldId.value, city.getSaveData()) } catch {}
  }, 800)
})

onMounted(() => {
  // Splash 2s
  setTimeout(() => { appState.value = 'menu' }, 2000)

  // no cargar legacy al inicio — se hace al entrar a mundo
  window.addEventListener('keydown', onKeydown)
  watch(() => [player.x, player.y, player.dir], () => {
    try { localStorage.setItem('jandocity-player', JSON.stringify({ x: player.x, y: player.y, dir: player.dir })) } catch {}
  })
  const flushAll = () => {
    if (activeWorldId.value) {
      try { updateWorldData(activeWorldId.value, city.getSaveData()) } catch {}
    }
    try { localStorage.setItem('jandocity-player', JSON.stringify({ x: player.x, y: player.y, dir: player.dir })) } catch {}
    try { city.flushSave() } catch { try { city.saveCity() } catch {} }
  }
  window.addEventListener('beforeunload', flushAll)
  window.addEventListener('pagehide', flushAll)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushAll() })

  const tryAutoPlay = () => {
    try {
      audioMgr.init()
      if (!audioMgr.music.currentTrack || audioMgr.music.currentTrack === 'calma') {
        audioMgr.music.play('calma')
      } else {
        audioMgr.music.play(audioMgr.music.currentTrack)
      }
    } catch {}
  }
  setTimeout(tryAutoPlay, 600)
  const onFirstGesture = () => {
    tryAutoPlay()
    window.removeEventListener('click', onFirstGesture)
    window.removeEventListener('keydown', onFirstGesture)
  }
  window.addEventListener('click', onFirstGesture, { once: true })
  window.addEventListener('keydown', onFirstGesture, { once: true })
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- Viewport entero fullscreen — 100dvh para APK sin barras -->
  <div class="relative w-screen h-[100dvh] h-screen overflow-hidden bg-[#0f172a] text-slate-100 font-sans antialiased">
    <!-- Splash 2s -->
    <SplashScreen v-if="appState==='splash'" />

    <!-- Menú principal -->
    <MainMenu v-else-if="appState==='menu'" @select="handleMenuSelect" />

    <!-- Loading genérico (Cargando... / Entrando al servidor...) — funciona web y móvil/APK -->
    <LoadingScreen v-else-if="appState==='loading'" :text="loadingText" :subtext="loadingSub" />

    <!-- Gestor de mundos locales -->
    <WorldManager v-else-if="appState==='worlds'" @play="handlePlay" @back="appState='menu'" />

    <!-- Juego -->
    <template v-else-if="appState==='playing'">
      <CityGrid :show-ui="showUI && !isPaused" class="absolute inset-0 w-full h-full overflow-hidden bg-[#22c55e]" @toggleUi="showUI = !showUI" />
      <Joystick v-if="joystickType==='thumb'" />
      <DPad v-else />
      <div class="absolute top-2 right-2 z-20 md:hidden bg-black/50 backdrop-blur px-2 py-1 rounded-full text-[10px] text-white/70 border border-white/10 pointer-events-none">JANDOCITY • {{ activeWorldId ? 'mundo local' : 'offline' }} ✓</div>

      <Transition name="fade">
        <ResourceBar v-show="showUI" class="absolute top-0 left-0 right-0 z-30" />
      </Transition>

      <!-- Botón pausa (Esc) + salir -->
      <button @click="togglePause" class="absolute top-[42px] md:top-[40px] right-2 z-30 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/15 text-[11px] text-white/80 hover:bg-black/70">{{ isPaused ? '▶' : '⏸' }} Pausa (Esc)</button>

      <!-- Desktop: panel izquierdo -->
      <Transition name="slide-left">
        <div v-show="showUI" class="hidden md:flex absolute left-3 top-[72px] z-20 w-[300px] max-h-[calc(100vh-84px)] overflow-auto scrollbar-thin flex-col gap-3 pointer-events-auto">
          <ToolPalette class="shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-xl" />
          <AudioControls class="shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-xl" />
        </div>
      </Transition>
      <!-- Móvil: carrusel inferior extendido + modal centrado con X (oculto en pausa) -->
      <MobileToolCarousel v-if="!isPaused" :showUI="showUI" />

      <!-- Overlay pausa — web Esc y móvil -->
      <PauseMenu :show="isPaused" :joystickType="joystickType" @resume="resumeGame" @exit="exitToMenu" @update:joystickType="joystickType=$event" />

      <Transition name="fade">
        <div v-show="showUI" class="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div class="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[11px] text-white/70 border border-white/10">
            Presiona <span class="font-bold text-white">H</span> para ocultar • <span class="font-bold text-white">Esc</span> menú
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div v-show="!showUI" class="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div class="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[11px] text-white/70 border border-white/10">
            Presiona <span class="font-bold text-white">H</span> para mostrar
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style>
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-left-enter-from, .slide-left-leave-to {
  transform: translateX(-110%);
  opacity: 0;
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(110%);
  opacity: 0;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
