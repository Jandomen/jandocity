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
import ChatBox from '@/components/ChatBox.vue'
import SinglePlayerSetup from '@/components/SinglePlayerSetup.vue'
import VictoryOverlay from '@/components/VictoryOverlay.vue'
import AuthModal from '@/components/Auth/AuthModal.vue'
import OfflineBanner from '@/components/OfflineBanner.vue'
import MultiplayerLobby from '@/components/Multiplayer/MultiplayerLobby.vue'
import EnteringServer from '@/components/Multiplayer/EnteringServer.vue'
import Returning from '@/components/Multiplayer/Returning.vue'
import { useAudioManager } from '@/audio/audioManager.js'
import { getWorld, setActiveWorldId, getActiveWorldId, clearActiveWorldId, updateWorldData } from '@/utils/worldPersistence.js'
import { useServiceSpawns } from '@/composables/useServiceSpawns.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useBuildQueue } from '@/composables/useBuildQueue.js'
import { useUnitQueue } from '@/composables/useUnitQueue.js'
import { useSingleAI } from '@/composables/useSingleAI.js'
import { useTrafficStore } from '@/stores/trafficStore.js'
import { useVictory } from '@/composables/useVictory.js'
import { supabase } from '@/lib/supabase.js'
import { useMultiplayerSync } from '@/composables/useMultiplayerSync.js'
import { useKeepAlive } from '@/composables/useKeepAlive.js'
import { APP_URL } from '@/config.js'

const city = useCityStore()
const player = usePlayerStore()

useAudioEvents(city)
const audioMgr = useAudioManager()

// Flujo: splash (2s) -> menu -> worlds / loading -> playing + singleSetup + multiLobby + enteringMulti/returning
const appState = ref('splash') // splash | menu | loading | worlds | playing | singleSetup | multiLobby | enteringMulti | returning
const multiRoom = ref(null)
const loadingText = ref('Cargando...')
const loadingSub = ref('')
const activeWorldId = ref(getActiveWorldId() || null)
const showUI = ref(true)
const isPaused = ref(false)
const joystickType = ref(localStorage.getItem('jandocity-joystick') || 'thumb')
const showChat = ref(false)
const single = useSinglePlayerStore()
const buildQueue = useBuildQueue()
const unitQueue = useUnitQueue()
const singleAI = useSingleAI()
const traffic = useTrafficStore()
const victory = useVictory()
const keepAlive = useKeepAlive()
const showVictory = ref(false)
const victoryData = ref(null)
const showAuth = ref(false)
const pendingMulti = ref(false)
const chatMessages = ref([])
const multiSync = useMultiplayerSync()
function onAuthenticated() { showAuth.value=false; if(pendingMulti.value){ pendingMulti.value=false; handleMenuSelect('multi') } }
const botPhrases = ['Construyendo…','Avanzando con cautela','Reforzando defensas','En camino','Posicionando unidades','Ajustando estrategia']
function sendChat(text) {
  chatMessages.value.push({ id: Date.now() + Math.random(), sender: 'Tú', text, time: new Date().toLocaleTimeString() })
  if (multiRoom.value) {
    multiSync.broadcastChat(text, 'Tú')
  } else if (single.isActive) {
    setTimeout(() => {
      const cpu = single.players.find(p=>!p.isHuman)
      const reply = botPhrases[Math.floor(Math.random()*botPhrases.length)]
      chatMessages.value.push({ id: Date.now()+Math.random(), sender: cpu ? `CPU ${cpu.color}` : 'CPU', text: reply, time: new Date().toLocaleTimeString() })
      if (chatMessages.value.length > 80) chatMessages.value.shift()
    }, 900 + Math.random()*800)
  }
  if (chatMessages.value.length > 80) chatMessages.value.shift()
}
function toggleChat() { showChat.value = !showChat.value }
function surrender() {
  const m = victory.metrics()
  victoryData.value = { isWin: false, winner: single.players.find(p=>!p.isHuman), metrics: m }
  showVictory.value = true
  isPaused.value = true
  city.pause()
  singleAI.stop()
  serviceSpawns.stop()
}
function closeVictory(toMenu=true) {
  showVictory.value = false
  victoryData.value = null
  if (toMenu) exitToMenu()
  else {
    // revancha: reinicia misma config
    const n = single.enemyCount
    const team = single.players.some(p=>p.team==='A' && !p.isHuman) ? '2vs2' : '1vs3'
    handleSingleStart()
  }
}

watch(joystickType, (v) => { try { localStorage.setItem('jandocity-joystick', v) } catch {} })

const serviceSpawns = useServiceSpawns()

useGameLoop(() => {
  if (appState.value === 'playing' && !isPaused.value) {
    city.tick()
    // check victoria solo en single
    if (single.isActive) {
      const res = victory.check()
      if (res) {
        const m = victory.metrics()
        victoryData.value = { isWin: res.isWin, winner: res.winner, metrics: m }
        showVictory.value = true
        isPaused.value = true
        city.pause()
        singleAI.stop()
        serviceSpawns.stop()
      }
    }
  }
}, { interval: 2000 })

watch(() => [appState.value, isPaused.value], ([state, paused]) => {
  if (state === 'playing' && !paused) { serviceSpawns.start(); if (single.isActive) singleAI.start() }
  else { serviceSpawns.stop(); singleAI.stop() }
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
  // T → chat (web)
  if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping) {
    e.preventDefault()
    showChat.value = true
    return
  }
  if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping) {
    if (!isPaused.value && !showChat.value) showUI.value = !showUI.value
  }
  if (e.key.toLowerCase() === 'n' && !isTyping && !e.ctrlKey && !e.metaKey) {
    audioMgr.init()
    const next = audioMgr.music.next()
    city.logs.unshift(`[Audio] ▶ ${audioMgr.music.tracks[next].label} (${audioMgr.music.tracks[next].mood}) — N para siguiente`)
    if (city.logs.length > 50) city.logs.pop()
  }
  if (e.key.toLowerCase() === 'escape' && !isTyping) {
    if (showChat.value) { showChat.value = false; return }
    togglePause()
  }
}

function handleMenuSelect(mode) {
  if (mode === 'free') {
    single.isActive = false
    buildQueue.clear()
    unitQueue.clear()
    loadingText.value = 'Cargando...'
    loadingSub.value = 'Preparando tus mundos locales'
    appState.value = 'loading'
    setTimeout(() => { appState.value = 'worlds' }, 700)
  } else if (mode === 'single') {
    // Un jugador offline vs CPU — sin Supabase
    appState.value = 'singleSetup'
    return
  } else if (mode === 'multi') {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { showAuth.value = true; pendingMulti.value = true; return }
      appState.value = 'multiLobby'
    })
  }
}

function handleSingleStart() {
  loadingText.value = 'Generando partida...'
  loadingSub.value = `${single.totalPlayers} jugadores — ${single.playerColor} vs CPU`
  appState.value = 'loading'
  setTimeout(() => {
    city.resetCity()
    city.syncDerivedResources()
    // colocar jugador en su esquina azul
    const human = single.humanPlayer()
    if (human) player.setPos(human.x, human.y)
    activeWorldId.value = null
    buildQueue.clear()
    unitQueue.clear()
    appState.value = 'playing'
    showUI.value = true
    isPaused.value = false
  }, 700)
}
function handleMultiStart(room) {
  // solo anfitrión puede iniciar cuando todos confirmen (8 max)
  if (room.players.length < 2) { city.logs.unshift('[Multi] Necesitas al menos 2 para iniciar'); return }
  // requiere que todos hayan confirmado (campo ready) — si no, espera
  const notReady = room.players.filter(p=>!p.ready).length
  if (notReady > 0) { city.logs.unshift(`[Multi] Esperando ${notReady} confirmaciones`); return }
  multiRoom.value = room
  appState.value = 'enteringMulti'
  setTimeout(() => {
    city.resetCity()
    city.syncDerivedResources()
    activeWorldId.value = null
    buildQueue.clear()
    unitQueue.clear()
    multiSync.join(room.key)
    // reconexión automática vía Supabase Realtime + OfflineBanner
    window.addEventListener('multi-chat', (e) => {
      const d = e.detail
      chatMessages.value.push({ id: Date.now()+Math.random(), sender: d.sender, text: d.text, time: d.time })
      if (chatMessages.value.length > 80) chatMessages.value.shift()
    })
    // al construir, CityGrid broadcastBuild vía watcher abajo
    appState.value = 'playing'
    showUI.value = true
    isPaused.value = false
  }, 900)
}

function handlePlay(worldId) {
  single.isActive = false
  buildQueue.clear()
  unitQueue.clear()
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
  if (multiRoom.value) {
    appState.value = 'returning'
    multiSync.leave()
    setTimeout(() => { multiRoom.value = null; appState.value = 'menu' }, 700)
    return
  }
  // guardar mundo actual antes de salir
  if (activeWorldId.value) {
    try { updateWorldData(activeWorldId.value, city.getSaveData()) } catch {}
    try { localStorage.setItem('jandocity-player', JSON.stringify({ x: player.x, y: player.y, dir: player.dir })) } catch {}
    try { city.flushSave() } catch {}
  }
  isPaused.value = false
  showVictory.value = false
  city.resume()
  single.isActive = false
  buildQueue.clear()
  unitQueue.clear()
  singleAI.stop()
  serviceSpawns.stop()
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
  keepAlive.start()
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
    <OfflineBanner />
    <!-- Splash 2s -->
    <SplashScreen v-if="appState==='splash'" />

    <!-- Menú principal -->
    <MainMenu v-else-if="appState==='menu'" @select="handleMenuSelect" />

    <!-- Loading genérico (Cargando... / Entrando al servidor...) — funciona web y móvil/APK -->
    <LoadingScreen v-else-if="appState==='loading'" :text="loadingText" :subtext="loadingSub" />

    <!-- Gestor de mundos locales -->
    <WorldManager v-else-if="appState==='worlds'" @play="handlePlay" @back="appState='menu'" />

    <!-- Un jugador setup -->
    <SinglePlayerSetup v-else-if="appState==='singleSetup'" @start="handleSingleStart" @back="appState='menu'" />

    <!-- Multi lobby -->
    <MultiplayerLobby v-else-if="appState==='multiLobby'" @start="handleMultiStart" @back="appState='menu'" />
    <EnteringServer v-else-if="appState==='enteringMulti'" :roomKey="multiRoom?.key" />
    <Returning v-else-if="appState==='returning'" />

    <!-- Juego -->
    <template v-else-if="appState==='playing'">
      <CityGrid :show-ui="showUI && !isPaused" class="absolute inset-0 w-full h-full overflow-hidden bg-[#22c55e]" @toggleUi="showUI = !showUI" @openChat="showChat=true" />
      <Joystick v-if="joystickType==='thumb'" />
      <DPad v-else />
      <div class="absolute top-2 right-2 z-20 md:hidden bg-black/50 backdrop-blur px-2 py-1 rounded-full text-[10px] text-white/70 border border-white/10 pointer-events-none">JANDOSOFT • {{ activeWorldId ? 'mundo local' : 'offline' }} ✓</div>

      <Transition name="fade">
        <ResourceBar v-show="showUI" class="absolute top-0 left-0 right-0 z-30" />
      </Transition>

      <!-- Botón pausa (Esc) + chat T -->
      <div class="absolute top-[42px] md:top-[40px] right-2 z-30 flex items-center gap-1.5">
        <button @click="showChat=true" class="hidden md:flex px-2.5 py-1 rounded-full bg-sky-600/80 backdrop-blur border border-white/15 text-[11px] text-white hover:bg-sky-600 gap-1 items-center">💬 Chat <span class="bg-white text-sky-700 px-1 rounded text-[9px] font-black">T</span></button>
        <button @click="togglePause" class="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/15 text-[11px] text-white/80 hover:bg-black/70">{{ isPaused ? '▶' : '⏸' }} Pausa (Esc)</button>
      </div>

      <!-- Desktop: panel izquierdo -->
      <Transition name="slide-left">
        <div v-show="showUI" class="hidden md:flex absolute left-3 top-[72px] z-20 w-[300px] max-h-[calc(100vh-84px)] overflow-auto scrollbar-thin flex-col gap-3 pointer-events-auto">
          <ToolPalette class="shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-xl" />
          <AudioControls class="shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-xl" />
        </div>
      </Transition>
      <!-- Móvil: carrusel inferior extendido + modal centrado con X (oculto en pausa/chat) -->
      <MobileToolCarousel v-if="!isPaused && !showChat" :showUI="showUI" />

      <!-- Chat overlay — T web / 💬 móvil, listo para multijugador -->
      <ChatBox :show="showChat" :messages="chatMessages" @send="sendChat" @close="showChat=false" />

      <!-- Overlay pausa — web Esc y móvil -->
      <PauseMenu :show="isPaused && !showVictory" :joystickType="joystickType" @resume="resumeGame" @exit="exitToMenu" @surrender="surrender" @update:joystickType="joystickType=$event" />

      <!-- Victoria / Derrota -->
      <VictoryOverlay :show="showVictory" :isWin="victoryData?.isWin" :winner="victoryData?.winner" :metrics="victoryData?.metrics" @menu="closeVictory(true)" @rematch="closeVictory(false)" />

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
    <!-- Auth multijugador (fuera de la cadena v-if) -->
    <AuthModal :show="showAuth" @close="showAuth=false" @authenticated="onAuthenticated" />
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
