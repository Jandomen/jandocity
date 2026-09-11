<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAudioManager } from '@/audio/audioManager.js'

const audio = useAudioManager()

const musicVol = ref(38)
const ambientVol = ref(55)
const effectsVol = ref(72)
const isMusicMuted = ref(false)
const currentTrack = ref('calma')

function onMusicChange(e) {
  const v = Number(e.target.value) / 100
  musicVol.value = Number(e.target.value)
  if (!isMusicMuted.value) audio.setMusicVolume(v)
}

function onAmbientChange(e) {
  const v = Number(e.target.value) / 100
  ambientVol.value = Number(e.target.value)
  audio.setAmbientVolume(v)
}

function onEffectsChange(e) {
  const v = Number(e.target.value) / 100
  effectsVol.value = Number(e.target.value)
  audio.setEffectsVolume(v)
}

function toggleMusic() {
  isMusicMuted.value = !isMusicMuted.value
  if (isMusicMuted.value) audio.music.mute()
  else audio.music.unmute(musicVol.value / 100)
}

function nextTrack() {
  audio.init()
  currentTrack.value = audio.music.next()
}

const trackInfo = computed(() => audio.music.tracks[currentTrack.value] || audio.music.tracks['calma'])

onMounted(() => {
  audio.setMusicVolume(musicVol.value / 100)
  audio.setAmbientVolume(ambientVol.value / 100)
  audio.setEffectsVolume(effectsVol.value / 100)
  currentTrack.value = audio.music.currentTrack
  // Poll current track cada 500ms para reflejar cambios via N
  setInterval(() => { currentTrack.value = audio.music.currentTrack }, 500)
})
</script>

<template>
  <div class="bg-slate-900/85 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-xs uppercase tracking-wider text-slate-400 font-bold">Audio</h3>
      <span class="text-[10px] font-mono text-white/40">N → siguiente pista</span>
    </div>
    
    <!-- Música con 15 pistas -->
    <div class="bg-black/30 rounded-lg p-2.5 border border-white/5 space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-white flex items-center gap-2">
          🎵 <span :style="{color: trackInfo.color}">{{ trackInfo.label }}</span>
        </span>
        <button @click="nextTrack" class="px-2 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold" title="N">⏭️ N</button>
      </div>
      <div class="text-[11px] text-white/60">Mood: <span class="text-white/90 font-medium">{{ trackInfo.mood }}</span> • {{ audio.music.index + 1 }}/{{ audio.music.trackList.length }}</div>
      <div class="flex gap-1 flex-wrap">
        <button
          v-for="(id, idx) in audio.music.trackList"
          :key="id"
          @click="currentTrack = (audio.music.play(id), id)"
          class="w-2 h-2 rounded-full"
          :class="currentTrack===id ? 'bg-emerald-400 ring-1 ring-white' : 'bg-white/20 hover:bg-white/40'"
          :title="audio.music.tracks[id].label"
        ></button>
      </div>
      <div class="flex items-center gap-2 pt-1">
        <input type="range" min="0" max="100" :value="musicVol" @input="onMusicChange" class="flex-1 accent-amber-500 h-1" />
        <span class="text-xs font-mono w-9 text-right">{{ musicVol }}%</span>
        <button @click="toggleMusic" class="px-1.5 py-1 rounded text-xs" :class="isMusicMuted ? 'bg-red-800' : 'bg-slate-700'">{{ isMusicMuted ? '🔇' : '🔊' }}</button>
      </div>
    </div>

    <!-- Ambiente detallado -->
    <div class="space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="text-xs w-20">🌆 Ambiente</span>
        <input type="range" min="0" max="100" :value="ambientVol" @input="onAmbientChange" class="flex-1 accent-emerald-500 h-1" />
        <span class="text-xs font-mono w-9 text-right">{{ ambientVol }}%</span>
      </div>
      <p class="text-[10px] text-slate-500 leading-tight pl-1">Mezcla por cercanía: tráfico/maquinaria/naturaleza/comercio. Se adapta a lo que construyes.</p>
    </div>

    <!-- Efectos detallados -->
    <div class="space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="text-xs w-20">🔊 Efectos</span>
        <input type="range" min="0" max="100" :value="effectsVol" @input="onEffectsChange" class="flex-1 accent-sky-500 h-1" />
        <span class="text-xs font-mono w-9 text-right">{{ effectsVol }}%</span>
      </div>
      <p class="text-[10px] text-slate-500 leading-tight pl-1">Detallado: martillo casa / caja comercial / asfalto carretera / agua gota / plantar árbol / demolición.</p>
    </div>
  </div>
</template>
