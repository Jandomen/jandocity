<script setup>
import { ref, computed } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useUnitQueue } from '@/composables/useUnitQueue.js'
import { BUILDINGS } from '@/constants/buildings.js'

const city = useCityStore()
const single = useSinglePlayerStore()
const unitQueue = useUnitQueue()

const hasPolice = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='police_station' && c.owner===single.humanPlayer()?.id))
const hasMil = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='military_academy' && c.owner===single.humanPlayer()?.id))
const hasArs = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='arsenal' && c.owner===single.humanPlayer()?.id))
const hasResidential = computed(() => city.flatGrid.some(c=>c.isOrigin && ['residential','residential_small','residential_medium','residential_large'].includes(c.buildingId) && c.owner===single.humanPlayer()?.id))
const hasCityHall = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='city_hall' && c.owner===single.humanPlayer()?.id))
const hasMuseum = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='museum' && c.owner===single.humanPlayer()?.id))
const hasPower = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='power' && c.owner===single.humanPlayer()?.id))
const hasRoadBuilt = computed(() => city.flatGrid.some(c=> (c.hasRoad || ['road','dirt_road','concrete_road','cobble_road'].includes(c.buildingId)) && c.owner===single.humanPlayer()?.id))

// estado colapsable por categoría (como carreteras, todas organizadas igual)
const open = ref({
  zonas: true,
  altura: true,
  grandes: true,
  mega: true,
  servicios: true,
  publica: true,
  produccion: true,
  cultura: true,
  mundial: true,
  banderas: true,
  vehiculos: true,
  infra: true,
  transporte: true,
  terreno: true,
  cercas: true,
  costa: true,
  naturaleza: true,
  utils: true,
})

function toggle(cat) { open.value[cat] = !open.value[cat] }

const roadVariants = [
  { id: 'straight-h', label: 'Recta H', icon: '━' },
  { id: 'straight-v', label: 'Recta V', icon: '┃' },
  { id: 'diagonal', label: 'Diagonal', icon: '╱' },
  { id: 'diagonal2', label: 'Diagonal2', icon: '╲' },
  { id: 'curve-nw', label: 'Curva NW', icon: '┌' },
  { id: 'curve-ne', label: 'Curva NE', icon: '┐' },
  { id: 'curve-sw', label: 'Curva SW', icon: '└' },
  { id: 'curve-se', label: 'Curva SE', icon: '┘' },
  { id: 't-n', label: 'T Norte', icon: '┬' },
  { id: 't-s', label: 'T Sur', icon: '┴' },
  { id: 't-e', label: 'T Este', icon: '┤' },
  { id: 't-w', label: 'T Oeste', icon: '├' },
  { id: 'cross', label: 'Cruce', icon: '┼' },
  { id: 'end-n', label: 'Final N', icon: '╹' },
  { id: 'end-s', label: 'Final S', icon: '╻' },
  { id: 'end-e', label: 'Final E', icon: '╺' },
  { id: 'end-w', label: 'Final O', icon: '╸' },
  { id: 'double-h', label: 'Doble H', icon: '═' },
  { id: 'double-v', label: 'Doble V', icon: '║' },
  { id: 'roundabout', label: 'Glorieta', icon: '◯' },
  { id: 's-curve', label: 'S Curva', icon: '〰️' },
]
const wallVariants = [
  { id: 'straight-h', label: 'Recta H', icon: '━' },
  { id: 'straight-v', label: 'Recta V', icon: '┃' },
  { id: 'diagonal', label: 'Diag', icon: '╱' },
  { id: 'diagonal2', label: 'Diag2', icon: '╲' },
  { id: 'curve-nw', label: 'Esq NW', icon: '┌' },
  { id: 'curve-ne', label: 'Esq NE', icon: '┐' },
  { id: 'curve-sw', label: 'Esq SW', icon: '└' },
  { id: 'curve-se', label: 'Esq SE', icon: '┘' },
  { id: 't-n', label: 'T', icon: '┬' },
  { id: 'cross', label: 'Cruz', icon: '┼' },
  { id: 'end-n', label: 'Fin', icon: '╹' },
]

// helpers estilo carreteras
function btnBase(selected, color) {
  if (selected) return `bg-${color}-500/20 border-${color}-500 text-${color}-300 ring-1 ring-${color}-500`
  return 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'
}
</script>

<template>
  <aside class="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl p-3 w-full flex flex-col gap-2.5 select-none shadow-[0_8px_24px_rgba(0,0,0,0.4)] pointer-events-auto" style="contain: layout;">

    <!-- 1. ZONAS HABITACIONALES — como carreteras: grid 2/3 cols con variantes -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('zonas')" class="w-full flex items-center justify-between px-3 py-2 bg-emerald-900/20 hover:bg-emerald-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-300"><span>🏘️</span> ZONAS — Habitacional <span class="text-emerald-500/60 font-normal">4 variantes</span></span>
        <span class="text-emerald-300 text-xs">{{ open.zonas ? '−' : '+' }}</span>
      </button>
      <div v-show="open.zonas" class="p-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="v in [
            { id: 'residential', label: 'Normal', icon: '🏠', cost: BUILDINGS.residential.cost, sub: '1×1' },
            { id: 'residential_small', label: 'Pequeña', icon: '🏠', cost: BUILDINGS.residential_small.cost, sub: '1×1 · 8 hab' },
            { id: 'residential_medium', label: 'Mediana', icon: '🏡', cost: BUILDINGS.residential_medium.cost, sub: '1×1 · 14 hab' },
            { id: 'residential_large', label: 'Grande', icon: '🏘️', cost: BUILDINGS.residential_large.cost, sub: '2×2 · 28 hab' },
          ]"
          :key="v.id"
          @click="city.selectedTool = v.id; city.selectedHouseVariant = v.id"
          class="p-2 rounded border text-xs text-left flex flex-col gap-0.5"
          :class="city.selectedTool===v.id && city.selectedHouseVariant===v.id ? (single.isActive ? 'bg-slate-600 border-white text-white ring-1 ring-white' : 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500') : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <div class="flex items-center gap-1.5"><span class="text-sm">{{ v.icon }}</span><span class="font-semibold text-[11px]">{{ v.label }}</span><span class="ml-auto text-[10px] font-mono text-emerald-400">${{ v.cost }}</span></div>
          <div class="text-[9px] opacity-60">{{ v.sub }}</div>
        </button>
      </div>
      <div v-show="open.zonas" class="px-2 pb-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="tool in [
            { id: 'commercial', label: 'Comercial', icon: '🏪', cost: BUILDINGS.commercial.cost, sub: '+18💰/tick 1×1' },
            { id: 'shop', label: 'Tienda', icon: '🛒', cost: BUILDINGS.shop.cost, sub: '+12💰 1×1' },
            { id: 'supermarket', label: 'Super', icon: '🛍️', cost: BUILDINGS.supermarket.cost, sub: '+24💰 2×2' },
            { id: 'mall', label: 'Mall', icon: '🏬', cost: BUILDINGS.mall.cost, sub: '+36💰 3×2' },
            { id: 'bank', label: 'Banco', icon: '🏦', cost: BUILDINGS.bank.cost, sub: '+28💰 2×1' },
            { id: 'park', label: 'Parque', icon: '🌳', cost: BUILDINGS.park.cost, sub: '2×2 +10 O₂' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border text-xs text-left flex flex-col gap-0.5"
          :class="city.selectedTool===tool.id ? (single.isActive ? 'bg-slate-600 border-white text-white ring-1 ring-white' : 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500') : 'bg-slate-800 border-slate-700 text-white/70'"
        >
          <div class="flex items-center gap-1.5"><span class="text-sm">{{ tool.icon }}</span><span class="font-semibold text-[11px]">{{ tool.label }}</span><span class="ml-auto text-[10px] font-mono text-sky-400">${{ tool.cost }}</span></div>
          <div class="text-[9px] opacity-60">{{ tool.sub }}</div>
        </button>
      </div>
    </section>

    <!-- 1b. ALTURA — 2 cuadros de altura (bloqueado hasta 1 casa en Un Jugador) -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('altura')" class="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-200"><span>🏙️</span> ALTURA — 2 cuadros <span class="text-slate-400 font-normal">vertical</span></span>
        <span class="text-slate-200 text-xs">{{ open.altura ? '−' : '+' }}</span>
      </button>
      <div v-if="single.isActive && !hasResidential" v-show="open.altura" class="p-3 text-center text-[11px] text-white/40">🏠 Construye 1 casa para desbloquear altura</div>
      <div v-else v-show="open.altura" class="p-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="tool in [
            { id: 'tower_residential', label: 'Torre vivienda', icon: '🏢', cost: BUILDINGS.tower_residential.cost, sub: '1×2 · +26 hab' },
            { id: 'tower_commercial', label: 'Torre oficinas', icon: '🏢', cost: BUILDINGS.tower_commercial.cost, sub: '1×2 · +26💰' },
            { id: 'apartment_block', label: 'Bloque 2×2', icon: '🏢', cost: BUILDINGS.apartment_block.cost, sub: '2×2 · +36 hab' },
            { id: 'skyscraper', label: 'Rascacielos', icon: '🌃', cost: BUILDINGS.skyscraper.cost, sub: '2×2 · +48 hab' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border text-xs flex flex-col gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-slate-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-slate-300">${{ tool.cost }}</span>
        </button>
      </div>
      <p v-show="open.altura" class="px-2 pb-2 text-[9px] text-slate-400 leading-tight">Ocupan 2 cuadros de alto — se anclan al origen y bloquean 2 celdas.</p>
    </section>

    <!-- 2. GRANDES / OCIO (bloqueado hasta Ayuntamiento en Un Jugador) -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('grandes')" class="w-full flex items-center justify-between px-3 py-2 bg-violet-900/20 hover:bg-violet-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-violet-300"><span>🏟️</span> GRANDES — Ocio <span class="text-violet-500/60 font-normal">2 edificios</span></span>
        <span class="text-violet-300 text-xs">{{ open.grandes ? '−' : '+' }}</span>
      </button>
      <div v-if="single.isActive && !hasCityHall" v-show="open.grandes" class="p-3 text-center text-[11px] text-white/40">🏛️ Construye Ayuntamiento para desbloquear</div>
      <div v-else v-show="open.grandes" class="p-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="tool in [
            { id: 'stadium', label: 'Estadio', icon: '🏟️', cost: BUILDINGS.stadium.cost, sub: '3×3' },
            { id: 'airport', label: 'Aeropuerto', icon: '✈️', cost: BUILDINGS.airport.cost, sub: '4×3' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border text-xs flex flex-col gap-1"
          :class="city.selectedTool===tool.id ? 'bg-violet-500/20 border-violet-500 text-violet-300 ring-1 ring-violet-500' : 'bg-slate-800 border-slate-700 text-white/70'"
        >
          <span class="text-lg">{{ tool.icon }}</span><span class="text-[11px] font-semibold">{{ tool.label }}</span><span class="text-[10px] font-mono text-violet-400">${{ tool.cost }}</span>
        </button>
      </div>
    </section>

    <!-- 2b. MEGA — 11 grandes (bloqueado hasta Ayuntamiento) -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('mega')" class="w-full flex items-center justify-between px-3 py-2 bg-zinc-800 hover:bg-zinc-700 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-200"><span>🏛️</span> MEGA — 11 grandes <span class="text-zinc-400 font-normal">3×3 a 5×5</span></span>
        <span class="text-zinc-200 text-xs">{{ open.mega ? '−' : '+' }}</span>
      </button>
      <div v-if="single.isActive && !hasCityHall" v-show="open.mega" class="p-3 text-center text-[11px] text-white/40">🏛️ Construye Ayuntamiento para desbloquear</div>
      <div v-else v-show="open.mega" class="p-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="tool in [
            { id: 'city_hall', label: 'Ayuntamiento', icon: '🏛️', cost: BUILDINGS.city_hall.cost, sub: '3×3' },
            { id: 'museum', label: 'Museo', icon: '🖼️', cost: BUILDINGS.museum.cost, sub: '3×3' },
            { id: 'port', label: 'Puerto', icon: '⚓', cost: BUILDINGS.port.cost, sub: '5×2' },
            { id: 'solar_farm', label: 'Solar', icon: '☀️', cost: BUILDINGS.solar_farm.cost, sub: '3×3 +32⚡' },
            { id: 'financial_district', label: 'Financiero', icon: '🏙️', cost: BUILDINGS.financial_district.cost, sub: '4×4' },
            { id: 'opera', label: 'Ópera', icon: '🎭', cost: BUILDINGS.opera.cost, sub: '3×3' },
            { id: 'olympic_stadium', label: 'Olímpico', icon: '🏟️', cost: BUILDINGS.olympic_stadium.cost, sub: '5×5' },
            { id: 'nuclear_plant', label: 'Nuclear', icon: '☢️', cost: BUILDINGS.nuclear_plant.cost, sub: '4×4 +55⚡' },
            { id: 'intl_airport', label: 'Intl. Airport', icon: '✈️', cost: BUILDINGS.intl_airport.cost, sub: '5×3' },
            { id: 'library', label: 'Biblioteca', icon: '📚', cost: BUILDINGS.library.cost, sub: '3×2' },
            { id: 'convention_center', label: 'Convenciones', icon: '🏢', cost: BUILDINGS.convention_center.cost, sub: '4×3' },
          ]"
          :key="tool.id"
          @click="!(single.isActive && !hasPower && ['solar_farm','nuclear_plant'].includes(tool.id)) && (city.selectedTool = tool.id)"
          class="p-2 rounded border text-xs flex flex-col gap-0.5"
          :class="[city.selectedTool===tool.id ? 'bg-zinc-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700', single.isActive && !hasPower && ['solar_farm','nuclear_plant'].includes(tool.id) ? 'opacity-40 pointer-events-none' : '']"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-zinc-300">${{ tool.cost }}</span>
        </button>
      </div>
    </section>

    <!-- 2b. SERVICIOS — Hoteles / Restaurantes / Educación -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('servicios')" class="w-full flex items-center justify-between px-3 py-2 bg-indigo-900/20 hover:bg-indigo-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-300"><span>🏨</span> SERVICIOS — Hotel / Rest / Uni <span class="text-indigo-500/60 font-normal">6 edificios</span></span>
        <span class="text-indigo-300 text-xs">{{ open.servicios ? '−' : '+' }}</span>
      </button>
      <div v-show="open.servicios" class="p-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="tool in [
            { id: 'hotel', label: 'Hotel', icon: '🏨', cost: BUILDINGS.hotel.cost, sub: '2×2 · +18 hab' },
            { id: 'hotel_large', label: 'Hotel G', icon: '🏨', cost: BUILDINGS.hotel_large.cost, sub: '3×2 · +32 hab' },
            { id: 'restaurant_small', label: 'Cafetería', icon: '☕', cost: BUILDINGS.restaurant_small.cost, sub: '1×1 · +9💰' },
            { id: 'restaurant', label: 'Restaurante', icon: '🍽️', cost: BUILDINGS.restaurant.cost, sub: '2×1 · +16💰' },
            { id: 'school', label: 'Escuela', icon: '🏫', cost: BUILDINGS.school.cost, sub: '2×2 · +6 hab' },
            { id: 'university', label: 'Universidad', icon: '🎓', cost: BUILDINGS.university.cost, sub: '3×3 · +12 hab' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border text-xs flex flex-col gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-indigo-400">${{ tool.cost }}</span>
        </button>
      </div>
    </section>

    <!-- 2c. SEGURIDAD / SALUD / JUSTICIA + Colegio Militar -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('publica')" class="w-full flex items-center justify-between px-3 py-2 bg-slate-700/40 hover:bg-slate-700/60 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-200"><span>🏛️</span> PÚBLICA — Policía/Bomberos/Salud/Justicia/Militar <span class="text-slate-400 font-normal">7 edificios</span></span>
        <span class="text-slate-200 text-xs">{{ open.publica ? '−' : '+' }}</span>
      </button>
      <div v-show="open.publica" class="p-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="tool in [
            { id: 'police_station', label: 'Comisaría', icon: '🚔', cost: BUILDINGS.police_station.cost, sub: '2×2' },
            { id: 'fire_station', label: 'Bomberos', icon: '🚒', cost: BUILDINGS.fire_station.cost, sub: '2×2' },
            { id: 'hospital', label: 'Hospital', icon: '🏥', cost: BUILDINGS.hospital.cost, sub: '3×2' },
            { id: 'gym', label: 'Gimnasio', icon: '🏋️', cost: BUILDINGS.gym.cost, sub: '2×2' },
            { id: 'courthouse', label: 'Juzgado', icon: '⚖️', cost: BUILDINGS.courthouse.cost, sub: '2×2' },
            { id: 'prison', label: 'Cárcel', icon: '🔒', cost: BUILDINGS.prison.cost, sub: '3×3' },
            { id: 'military_academy', label: 'Colegio Militar', icon: '🪖', cost: BUILDINGS.military_academy.cost, sub: '3×3 soldados' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border text-xs flex flex-col gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-slate-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-slate-300">${{ tool.cost }}</span>
        </button>
      </div>
    </section>

    <!-- PRODUCCIÓN UN JUGADOR — Comisaría / Colegio / Arsenal -->
    <section v-if="single.isActive" class="bg-slate-900/60 rounded-lg border border-sky-700/50 overflow-hidden">
      <button @click="toggle('produccion')" class="w-full flex items-center justify-between px-3 py-2 bg-sky-900/30 hover:bg-sky-900/40 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-sky-300"><span>⚔️</span> PRODUCCIÓN — Unidades <span class="text-sky-500/60 font-normal">0-100% cola 4</span></span>
        <span class="text-sky-300 text-xs">{{ open.produccion ? '−' : '+' }}</span>
      </button>
      <div v-show="open.produccion" class="p-2 space-y-2">
        <div v-if="!hasPolice && !hasMil && !hasArs" class="text-[11px] text-white/40 text-center py-2">Construye Comisaría, Colegio Militar o Arsenal para desbloquear producción</div>
        <template v-if="hasPolice">
        <div class="text-[10px] font-bold text-sky-400">Comisaría → Policías</div>
        <div class="grid grid-cols-2 gap-1.5">
          <button @click="unitQueue.enqueue('police_station','police', single.humanPlayer()?.id || 'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700">
            <span class="text-base">👮</span><span class="text-[10px] font-semibold">Policía</span><span class="text-[9px] font-mono">$30 · 2.8s</span>
          </button>
          <button @click="unitQueue.enqueue('police_station','police_car', single.humanPlayer()?.id || 'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700">
            <span class="text-base">🚔</span><span class="text-[10px] font-semibold">Patrulla</span><span class="text-[9px] font-mono">$80 · 4s</span>
          </button>
        </div>
        </template>
        <template v-if="hasMil">
        <div class="text-[10px] font-bold text-green-400">Colegio Militar → Soldados</div>
        <div class="grid grid-cols-2 gap-1.5">
          <button @click="unitQueue.enqueue('military_academy','soldier', single.humanPlayer()?.id || 'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700">
            <span class="text-base">🪖</span><span class="text-[10px] font-semibold">Soldado</span><span class="text-[9px] font-mono">$40 · 2.5s</span>
          </button>
          <button @click="unitQueue.enqueue('military_academy','soldier_heavy', single.humanPlayer()?.id || 'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700">
            <span class="text-base">🎖️</span><span class="text-[10px] font-semibold">Pesado</span><span class="text-[9px] font-mono">$60 · 3.2s</span>
          </button>
          <button @click="unitQueue.enqueue('military_academy','army_jeep', single.humanPlayer()?.id || 'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700">
            <span class="text-base">🚙</span><span class="text-[10px] font-semibold">Jeep</span><span class="text-[9px] font-mono">$90 · 3.8s</span>
          </button>
          <button @click="unitQueue.enqueue('military_academy','tank', single.humanPlayer()?.id || 'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700">
            <span class="text-base">🛡️</span><span class="text-[10px] font-semibold">Tanque</span><span class="text-[9px] font-mono">$180 · 6.5s</span>
          </button>
        </div>
        </template>
        <template v-if="hasArs">
        <div class="text-[10px] font-bold text-zinc-400">Arsenal → Maquinaria/Cañones</div>
        <div class="grid grid-cols-2 gap-1.5">
          <button @click="unitQueue.enqueue('arsenal','tractor', single.humanPlayer()?.id || 'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700">
            <span class="text-base">🚜</span><span class="text-[10px] font-semibold">Tractor</span><span class="text-[9px] font-mono">$50 · 3s</span>
          </button>
          <button @click="unitQueue.enqueue('arsenal','cannon', single.humanPlayer()?.id || 'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700">
            <span class="text-base">💣</span><span class="text-[10px] font-semibold">Cañón</span><span class="text-[9px] font-mono">$120 · 5.5s</span>
          </button>
        </div>
        </template>
        <div v-if="unitQueue.queue.length" class="bg-slate-900 rounded border border-white/10 p-2 space-y-1">
          <div class="text-[10px] font-bold text-white/60">Cola ({{ unitQueue.queue.length }})</div>
          <div v-for="q in unitQueue.queue" :key="q.id" class="flex items-center gap-2 text-[11px] bg-slate-800 rounded px-2 py-1 border border-slate-700">
            <span class="flex-1 truncate">{{ q.unitType }} @ {{ q.buildingId }}</span>
            <span class="font-mono text-sky-300">{{ Math.round(q.progress) }}%</span>
            <div class="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10"><div class="h-full bg-sky-400" :style="{width: q.progress+'%'}"></div></div>
          </div>
        </div>
        <p class="text-[10px] text-white/40 leading-tight">Requiere edificio construido junto a carretera. Cola máx 4 por edificio.</p>
      </div>
    </section>

    <!-- 2d. CULTURA / MONUMENTOS / INFRA -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('cultura')" class="w-full flex items-center justify-between px-3 py-2 bg-amber-900/20 hover:bg-amber-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-300"><span>🏛️</span> CULTURA — Iglesias/Castillos/Monumentos <span class="text-amber-500/60 font-normal">11 edificios</span></span>
        <span class="text-amber-300 text-xs">{{ open.cultura ? '−' : '+' }}</span>
      </button>
      <div v-show="open.cultura" class="p-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="tool in [
            { id: 'church', label: 'Iglesia', icon: '⛪', cost: BUILDINGS.church.cost, sub: '2×2' },
            { id: 'cathedral', label: 'Catedral', icon: '⛪', cost: BUILDINGS.cathedral.cost, sub: '3×2' },
            { id: 'castle', label: 'Castillo', icon: '🏰', cost: BUILDINGS.castle.cost, sub: '4×4' },
            { id: 'monument', label: 'Monumento', icon: '🗽', cost: BUILDINGS.monument.cost, sub: '1×1' },
            { id: 'obelisk', label: 'Obelisco', icon: '🗼', cost: BUILDINGS.obelisk.cost, sub: '1×1' },
            { id: 'arch', label: 'Arco', icon: '⛩️', cost: BUILDINGS.arch.cost, sub: '2×1' },
            { id: 'memorial', label: 'Memorial', icon: '🪦', cost: BUILDINGS.memorial.cost, sub: '2×2' },
            { id: 'fountain', label: 'Fuente', icon: '⛲', cost: BUILDINGS.fountain.cost, sub: '2×2' },
            { id: 'lighthouse', label: 'Faro', icon: '🗼', cost: BUILDINGS.lighthouse.cost, sub: '1×2' },
            { id: 'dam', label: 'Presa', icon: '🌊', cost: BUILDINGS.dam.cost, sub: '3×1' },
            { id: 'wind_turbine', label: 'Eólica', icon: '🌬️', cost: BUILDINGS.wind_turbine.cost, sub: '1×1' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border text-xs flex flex-col gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-amber-400">${{ tool.cost }}</span>
        </button>
      </div>
    </section>

    <!-- 2e. BANDERAS ONDEANDO (bloqueado hasta Ayuntamiento) -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('banderas')" class="w-full flex items-center justify-between px-3 py-2 bg-emerald-900/20 hover:bg-emerald-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-300"><span>🏳️</span> BANDERAS — Ondeando <span class="text-emerald-500/60 font-normal">15 países · 1×1</span></span>
        <span class="text-emerald-300 text-xs">{{ open.banderas ? '−' : '+' }}</span>
      </button>
      <div v-if="single.isActive && !hasCityHall" v-show="open.banderas" class="p-3 text-center text-[11px] text-white/40">🏛️ Construye Ayuntamiento para desbloquear banderas</div>
      <div v-else v-show="open.banderas" class="p-2 grid grid-cols-4 gap-1">
        <button
          v-for="tool in [
            { id: 'flag_mx', label: 'MX', icon: '🇲🇽', cost: 12 },
            { id: 'flag_co', label: 'CO', icon: '🇨🇴', cost: 12 },
            { id: 'flag_br', label: 'BR', icon: '🇧🇷', cost: 12 },
            { id: 'flag_us', label: 'US', icon: '🇺🇸', cost: 12 },
            { id: 'flag_fr', label: 'FR', icon: '🇫🇷', cost: 12 },
            { id: 'flag_de', label: 'DE', icon: '🇩🇪', cost: 12 },
            { id: 'flag_es', label: 'ES', icon: '🇪🇸', cost: 12 },
            { id: 'flag_it', label: 'IT', icon: '🇮🇹', cost: 12 },
            { id: 'flag_jp', label: 'JP', icon: '🇯🇵', cost: 12 },
            { id: 'flag_kr', label: 'KR', icon: '🇰🇷', cost: 12 },
            { id: 'flag_gb', label: 'GB', icon: '🇬🇧', cost: 12 },
            { id: 'flag_peru', label: 'PE', icon: '🇵🇪', cost: 12 },
            { id: 'flag_ar', label: 'AR', icon: '🇦🇷', cost: 12 },
            { id: 'flag_cl', label: 'CL', icon: '🇨🇱', cost: 12 },
            { id: 'flag_ve', label: 'VE', icon: '🇻🇪', cost: 12 },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-1.5 rounded border flex flex-col items-center gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[9px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[9px] font-mono text-emerald-400">${{ tool.cost }}</span>
        </button>
      </div>
    </section>

    <!-- 2f. MONUMENTOS MUNDIALES CON BANDERAS REALES — 20 países (bloqueado hasta Museo) -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('mundial')" class="w-full flex items-center justify-between px-3 py-2 bg-sky-900/20 hover:bg-sky-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-sky-300"><span>🌍</span> MUNDIAL — Monumentos con banderas <span class="text-sky-500/60 font-normal">20 países</span></span>
        <span class="text-sky-300 text-xs">{{ open.mundial ? '−' : '+' }}</span>
      </button>
      <div v-if="single.isActive && !hasMuseum" v-show="open.mundial" class="p-3 text-center text-[11px] text-white/40">🖼️ Construye Museo para desbloquear mundial</div>
      <div v-else v-show="open.mundial" class="p-2 grid grid-cols-2 gap-1.5 max-h-[320px] overflow-auto">
        <button
          v-for="tool in [
            { id: 'eiffel', label: 'Eiffel', icon: '🗼', cost: BUILDINGS.eiffel.cost, sub: '🇫🇷 2×2' },
            { id: 'liberty', label: 'Libertad', icon: '🗽', cost: BUILDINGS.liberty.cost, sub: '🇺🇸 2×2' },
            { id: 'big_ben', label: 'Big Ben', icon: '🕰️', cost: BUILDINGS.big_ben.cost, sub: '🇬🇧 1×3' },
            { id: 'christ_rio', label: 'Cristo', icon: '⛪', cost: BUILDINGS.christ_rio.cost, sub: '🇧🇷 2×2' },
            { id: 'colosseum', label: 'Coliseo', icon: '🏟️', cost: BUILDINGS.colosseum.cost, sub: '🇮🇹 3×3' },
            { id: 'taj_mahal', label: 'Taj Mahal', icon: '🕌', cost: BUILDINGS.taj_mahal.cost, sub: '🇮🇳 3×3' },
            { id: 'great_wall', label: 'Muralla', icon: '🧱', cost: BUILDINGS.great_wall.cost, sub: '🇨🇳 4×1' },
            { id: 'pyramid', label: 'Pirámide', icon: '🔺', cost: BUILDINGS.pyramid.cost, sub: '🇪🇬 3×3' },
            { id: 'chichen', label: 'Chichén', icon: '🏛️', cost: BUILDINGS.chichen.cost, sub: '🇲🇽 3×3' },
            { id: 'monserrate', label: 'Monserrate', icon: '⛪', cost: BUILDINGS.monserrate.cost, sub: '🇨🇴 2×2' },
            { id: 'machu', label: 'Machu', icon: '🏔️', cost: BUILDINGS.machu.cost, sub: '🇵🇪 3×2' },
            { id: 'obelisco_ar', label: 'Obelisco', icon: '🗼', cost: BUILDINGS.obelisco_ar.cost, sub: '🇦🇷 1×2' },
            { id: 'torii', label: 'Torii', icon: '⛩️', cost: BUILDINGS.torii.cost, sub: '🇯🇵 2×1' },
            { id: 'palace_kr', label: 'Gyeongbok', icon: '🏯', cost: BUILDINGS.palace_kr.cost, sub: '🇰🇷 3×2' },
            { id: 'wat_thai', label: 'Wat Thai', icon: '🛕', cost: BUILDINGS.wat_thai.cost, sub: '🇹🇭 2×2' },
            { id: 'table_za', label: 'Table Mtn', icon: '⛰️', cost: BUILDINGS.table_za.cost, sub: '🇿🇦 3×2' },
            { id: 'hassan_ma', label: 'Hassan', icon: '🕌', cost: BUILDINGS.hassan_ma.cost, sub: '🇲🇦 1×3' },
            { id: 'gate_de', label: 'Brandenb.', icon: '🏛️', cost: BUILDINGS.gate_de.cost, sub: '🇩🇪 3×2' },
            { id: 'sagrada_es', label: 'Sagrada', icon: '⛪', cost: BUILDINGS.sagrada_es.cost, sub: '🇪🇸 3×3' },
            { id: 'parthenon_gr', label: 'Partenón', icon: '🏛️', cost: BUILDINGS.parthenon_gr.cost, sub: '🇬🇷 3×2' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border text-xs flex flex-col gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-sky-400">${{ tool.cost }}</span>
        </button>
      </div>
    </section>

    <!-- 3. INFRAESTRUCTURA -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('infra')" class="w-full flex items-center justify-between px-3 py-2 bg-amber-900/20 hover:bg-amber-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-300"><span>⚡</span> INFRA — Energía/Agua/Industria <span class="text-amber-500/60 font-normal">8 edificios</span></span>
        <span class="text-amber-300 text-xs">{{ open.infra ? '−' : '+' }}</span>
      </button>
      <div v-show="open.infra" class="p-2 grid grid-cols-2 gap-1.5">
        <button
          v-for="tool in [
            { id: 'arsenal', label: 'Arsenal', icon: '💣', cost: BUILDINGS.arsenal.cost, sub: '3×3 · 🚜→💣' },
            { id: 'power', label: 'Planta energía', icon: '⚡', cost: BUILDINGS.power.cost, sub: '2×2 · +25⚡' },
            { id: 'waterPlant', label: 'Planta agua', icon: '🏭', cost: BUILDINGS.waterPlant.cost, sub: '2×2 · +25💧' },
            { id: 'factory', label: 'Fábrica', icon: '🏭', cost: BUILDINGS.factory.cost, sub: '3×2 · +22💰' },
            { id: 'warehouse', label: 'Almacén', icon: '🏚️', cost: BUILDINGS.warehouse.cost, sub: '2×2' },
            { id: 'telecom_tower', label: 'Antena', icon: '📡', cost: BUILDINGS.telecom_tower.cost, sub: '1×1' },
            { id: 'data_center', label: 'Data center', icon: '💾', cost: BUILDINGS.data_center.cost, sub: '2×2 · -14⚡' },
            { id: 'sewage_plant', label: 'Depuradora', icon: '🚿', cost: BUILDINGS.sewage_plant.cost, sub: '2×2 · +18💧' },
            { id: 'recycling_plant', label: 'Reciclaje', icon: '♻️', cost: BUILDINGS.recycling_plant.cost, sub: '+6 O₂' },
          ]"
          :key="tool.id"
          @click="!(single.isActive && !hasPower && ['solar_farm','nuclear_plant'].includes(tool.id)) && (city.selectedTool = tool.id)"
          class="p-2 rounded border text-xs text-left"
          :class="[
            city.selectedTool===tool.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500' : 'bg-slate-800 border-slate-700 text-white/70',
            single.isActive && !hasPower && ['solar_farm','nuclear_plant'].includes(tool.id) ? 'opacity-40 pointer-events-none' : ''
          ]"
        >
          <div class="flex items-center gap-1.5"><span>{{ tool.icon }}</span><span class="font-semibold text-[11px]">{{ tool.label }}</span></div>
          <div class="text-[9px] opacity-60">{{ tool.sub }}</div>
          <div class="text-[10px] font-mono text-amber-400">${{ tool.cost }}</div>
        </button>
      </div>
    </section>

    <!-- 4. TRANSPORTE — CARRETERAS + RIELES -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('transporte')" class="w-full flex items-center justify-between px-3 py-2 bg-zinc-700/40 hover:bg-zinc-700/60 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-200"><span>🛤️</span> TRANSPORTE — Carreteras + Rieles <span class="text-zinc-400 font-normal">20+16 piezas</span></span>
        <span class="text-zinc-200 text-xs">{{ open.transporte ? '−' : '+' }}</span>
      </button>
      <div v-show="open.transporte" class="p-2 flex flex-col gap-2">
        <!-- Pavimentos carretera -->
        <div class="text-[10px] text-zinc-400 font-bold">Carreteras — 4 pavimentos</div>
        <div class="grid grid-cols-4 gap-1">
          <button
            v-for="r in [
              { id: 'road', label: 'Asfalto', icon: '🛣️', cost: BUILDINGS.road.cost, sub: 'pavimento' },
              { id: 'dirt_road', label: 'Terracería', icon: '🟫', cost: BUILDINGS.dirt_road.cost, sub: 'tierra' },
              { id: 'concrete_road', label: 'Concreto', icon: '⬜', cost: BUILDINGS.concrete_road.cost, sub: 'concreto' },
              { id: 'cobble_road', label: 'Empedrado', icon: '🪨', cost: BUILDINGS.cobble_road.cost, sub: 'piedra' },
            ]"
            :key="r.id"
            @click="city.selectedTool = r.id"
            class="p-2 rounded border flex flex-col items-center gap-0.5"
            :class="['road','dirt_road','concrete_road','cobble_road'].includes(city.selectedTool) && city.selectedTool===r.id ? 'bg-zinc-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
          >
            <span class="text-base">{{ r.icon }}</span><span class="text-[9px] font-semibold leading-none">{{ r.label }}</span><span class="text-[9px] font-mono">${{ r.cost }}</span>
          </button>
        </div>
        <div v-if="['road','dirt_road','concrete_road','cobble_road'].includes(city.selectedTool)" class="grid grid-cols-4 gap-1">
          <button
            v-for="v in roadVariants"
            :key="v.id"
            @click="city.selectedRoadVariant = v.id"
            class="p-1.5 rounded border text-xs"
            :class="city.selectedRoadVariant===v.id ? 'bg-zinc-600 border-white text-white' : 'bg-slate-800 border-slate-700 text-white/60 hover:bg-slate-700'"
          >
            <div class="text-sm leading-none">{{ v.icon }}</div><div class="text-[8px] leading-tight mt-0.5">{{ v.label }}</div>
          </button>
        </div>
        <p v-if="['road','dirt_road','concrete_road','cobble_road'].includes(city.selectedTool)" class="text-[9px] text-zinc-400 leading-tight">Elige pieza; sobre agua crea puente 🌉 — 4 pavimentos hacen puente.</p>
        <!-- Rieles -->
        <div class="text-[10px] text-zinc-400 font-bold mt-1">Rieles — 16 piezas con curvas</div>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            @click="city.selectedTool='rail'"
            class="p-2 rounded border flex flex-col items-center gap-0.5"
            :class="city.selectedTool==='rail' ? 'bg-stone-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
          >
            <span class="text-base">🛤️</span><span class="text-[10px] font-semibold">Riel</span><span class="text-[9px] font-mono">${{ BUILDINGS.rail.cost }}</span>
          </button>
          <button
            @click="city.selectedTool='train'"
            class="p-2 rounded border flex flex-col items-center gap-0.5"
            :class="city.selectedTool==='train' ? 'bg-zinc-800 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
          >
            <span class="text-base">🚂</span><span class="text-[10px] font-semibold">Tren</span><span class="text-[9px] font-mono">${{ BUILDINGS.train.cost }}</span>
          </button>
        </div>
        <div v-if="['rail','train'].includes(city.selectedTool)" class="grid grid-cols-4 gap-1">
          <button
            v-for="v in roadVariants"
            :key="'rail-'+v.id"
            @click="city.selectedRailVariant = v.id"
            class="p-1.5 rounded border text-xs"
            :class="city.selectedRailVariant===v.id ? 'bg-stone-600 border-white text-white' : 'bg-slate-800 border-slate-700 text-white/60 hover:bg-slate-700'"
          >
            <div class="text-sm leading-none">{{ v.icon }}</div><div class="text-[8px] leading-tight mt-0.5">{{ v.label }}</div>
          </button>
        </div>
        <p v-if="city.selectedTool==='rail'" class="text-[9px] text-zinc-400 leading-tight">Rieles con curvas/T/cruz como carreteras — pon tren encima y circula solo.</p>
        <p v-if="city.selectedTool==='train'" class="text-[9px] text-zinc-400 leading-tight">Coloca el tren sobre rieles y avanza solo; al final se regresa.</p>
      </div>
    </section>

    <!-- 4b. VEHÍCULOS — 5 tipos que circulan solos -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('vehiculos')" class="w-full flex items-center justify-between px-3 py-2 bg-blue-900/20 hover:bg-blue-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-300"><span>🚗</span> VEHÍCULOS — Circulan solos <span class="text-blue-500/60 font-normal">5 tipos · sobre carretera</span></span>
        <span class="text-blue-300 text-xs">{{ open.vehiculos ? '−' : '+' }}</span>
      </button>
      <div v-show="open.vehiculos" class="p-2 grid grid-cols-3 gap-1.5">
        <button
          v-for="v in [
            { id: 'car', label: 'Coche', icon: '🚗', cost: 25 },
            { id: 'pickup', label: 'Camioneta', icon: '🛻', cost: 35 },
            { id: 'moto', label: 'Moto', icon: '🏍️', cost: 18 },
            { id: 'trailer', label: 'Trailer', icon: '🚛', cost: 45 },
            { id: 'bus', label: 'Bus', icon: '🚌', cost: 40 },
          ]"
          :key="v.id"
          @click="city.selectedTool = v.id"
          class="p-2 rounded border flex flex-col items-center gap-0.5"
          :class="city.selectedTool===v.id ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ v.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ v.label }}</span><span class="text-[9px] font-mono text-blue-400">${{ v.cost }}</span>
        </button>
      </div>
      <div v-show="open.vehiculos" class="p-2 grid grid-cols-3 gap-1.5 border-t border-slate-700/30 mt-1 pt-2">
        <button v-for="tool in [
          { id: 'bus_terminal', label: 'Terminal buses', icon: '🚌', cost: BUILDINGS.bus_terminal.cost, sub: '3×2 · spawnea buses' },
          { id: 'car_dealership', label: 'Autos', icon: '🏎️', cost: BUILDINGS.car_dealership.cost, sub: '2×2 · spawnea autos' },
          { id: 'moto_dealership', label: 'Motos', icon: '🏍️', cost: BUILDINGS.moto_dealership.cost, sub: '2×2 · moto con piloto' },
        ]" :key="tool.id" @click="city.selectedTool = tool.id" class="p-2 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool===tool.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500' : 'bg-slate-800 border-slate-700 text-white/70'">
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-amber-400">${{ tool.cost }}</span>
        </button>
      </div>
      <p v-show="open.vehiculos" class="px-2 pb-2 text-[9px] text-blue-400/60 leading-tight">Terminal y concesionarias spawnean solos sobre pavimento — colócalos junto a carretera.</p>
    </section>

    <!-- 5. TERRENO — LAGOS / SUELO + CEMENTO/AZULEJO/MADERA/MÁRMOL/PIEDRA -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('terreno')" class="w-full flex items-center justify-between px-3 py-2 bg-sky-900/20 hover:bg-sky-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-sky-300"><span>🌊</span> TERRENO — Lagos / Suelo <span class="text-sky-500/60 font-normal">10 pinceles</span></span>
        <span class="text-sky-300 text-xs">{{ open.terreno ? '−' : '+' }}</span>
      </button>
      <div v-show="open.terreno" class="p-2 grid grid-cols-4 gap-1">
        <button
          v-for="tool in [
            { id: 'lake', label: 'Lago', icon: '🌊', cost: 15 },
            { id: 'deep_lake', label: 'Profundo', icon: '🌊', cost: 20 },
            { id: 'sand_brush', label: 'Arena', icon: '🏖️', cost: 8 },
            { id: 'forest_brush', label: 'Bosque', icon: '🌲', cost: 12 },
            { id: 'grass_brush', label: 'Pasto', icon: '🌱', cost: 10 },
            { id: 'concrete_brush', label: 'Cemento', icon: '⬜', cost: 10 },
            { id: 'tile_brush', label: 'Azulejo', icon: '🔲', cost: 12 },
            { id: 'wood_brush', label: 'Madera', icon: '🪵', cost: 12 },
            { id: 'marble_brush', label: 'Mármol', icon: '⬜', cost: 14 },
            { id: 'stone_brush', label: 'Piedra', icon: '🪨', cost: 10 },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-1.5 rounded border flex flex-col items-center gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-sm">{{ tool.icon }}</span><span class="text-[9px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[9px] font-mono text-sky-400">${{ tool.cost }}</span>
        </button>
      </div>
      <p v-show="open.terreno" class="px-2 pb-2 text-[9px] text-slate-500 leading-tight">10 pisos: cemento, azulejo, madera, mármol, piedra.</p>
    </section>

    <!-- 5b. CERCAS / MUROS con variantes H/V/esquineros -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('cercas')" class="w-full flex items-center justify-between px-3 py-2 bg-stone-700/40 hover:bg-stone-700/60 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-stone-300"><span>🧱</span> CERCAS — Vallas/Muros <span class="text-stone-400 font-normal">6 tipos + 9 variantes</span></span>
        <span class="text-stone-300 text-xs">{{ open.cercas ? '−' : '+' }}</span>
      </button>
      <div v-show="open.cercas" class="p-2 grid grid-cols-3 gap-1.5">
        <button
          v-for="tool in [
            { id: 'fence', label: 'Valla', icon: '🪵', cost: BUILDINGS.fence.cost, sub: '1×1' },
            { id: 'wall', label: 'Muro', icon: '🧱', cost: BUILDINGS.wall.cost, sub: '1×1' },
            { id: 'hedge', label: 'Seto', icon: '🌿', cost: BUILDINGS.hedge.cost, sub: '+2 O₂' },
            { id: 'brick_wall', label: 'Ladrillo', icon: '🧱', cost: BUILDINGS.brick_wall.cost, sub: '1×1' },
            { id: 'metal_fence', label: 'Malla', icon: '⛓️', cost: BUILDINGS.metal_fence.cost, sub: '1×1' },
            { id: 'gate', label: 'Reja', icon: '🚪', cost: BUILDINGS.gate.cost, sub: '1×1' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border flex flex-col items-center gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-stone-500/20 border-stone-400 text-stone-200 ring-1 ring-stone-400' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[9px] font-mono text-stone-400">${{ tool.cost }}</span>
        </button>
      </div>
      <div v-if="['fence','wall','hedge','brick_wall','metal_fence','gate'].includes(city.selectedTool)" class="px-2 pb-2">
        <div class="text-[10px] text-stone-400 font-bold mb-1">Variante muro — H/V/esquineros</div>
        <div class="grid grid-cols-4 gap-1">
          <button v-for="v in wallVariants" :key="v.id" @click="city.selectedWallVariant=v.id"
            class="p-1.5 rounded border text-xs"
            :class="city.selectedWallVariant===v.id ? 'bg-stone-600 border-white text-white' : 'bg-slate-800 border-slate-700 text-white/60 hover:bg-slate-700'">
            <div class="text-sm leading-none">{{ v.icon }}</div><div class="text-[8px] leading-tight mt-0.5">{{ v.label }}</div>
          </button>
        </div>
      </div>
    </section>

    <!-- 6. COSTA / MUELLES — requiere agua, igual que carreteras requieren variante -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('costa')" class="w-full flex items-center justify-between px-3 py-2 bg-blue-900/20 hover:bg-blue-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-300"><span>⚓</span> COSTA — Muelles <span class="text-blue-500/60 font-normal">solo al lado del agua</span></span>
        <span class="text-blue-300 text-xs">{{ open.costa ? '−' : '+' }}</span>
      </button>
      <div v-show="open.costa" class="p-2 grid grid-cols-3 gap-1.5">
        <button
          v-for="tool in [
            { id: 'dock', label: 'Muelle', icon: '⚓', cost: BUILDINGS.dock.cost, sub: '2×1' },
            { id: 'pier', label: 'Muelle L', icon: '🛥️', cost: BUILDINGS.pier.cost, sub: '3×1' },
            { id: 'fishing_hut', label: 'Cabaña', icon: '🎣', cost: BUILDINGS.fishing_hut.cost, sub: '1×1' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-2 rounded border flex flex-col items-center gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-blue-400">${{ tool.cost }}</span>
        </button>
      </div>
      <p v-show="open.costa" class="px-2 pb-2 text-[9px] text-blue-400/70 leading-tight">Requiere lago adyacente 🌊 — pinta agua primero.</p>
    </section>

    <!-- 7. NATURALEZA — Oxígeno (como carreteras, grid 4 cols) -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('naturaleza')" class="w-full flex items-center justify-between px-3 py-2 bg-green-900/20 hover:bg-green-900/30 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-green-300"><span>🌳</span> NATURALEZA — Oxígeno <span class="text-green-500/60 font-normal">árboles filtran</span></span>
        <span class="text-green-300 text-xs">{{ open.naturaleza ? '−' : '+' }}</span>
      </button>
      <div v-show="open.naturaleza" class="p-2 grid grid-cols-4 gap-1">
        <button
          v-for="tool in [
            { id: 'tree', label: 'Árbol', icon: '🌳', cost: BUILDINGS.tree.cost, sub: '+6 O₂' },
            { id: 'oak', label: 'Roble', icon: '🌲', cost: BUILDINGS.oak.cost, sub: '+9 O₂' },
            { id: 'pine', label: 'Pino', icon: '🌲', cost: BUILDINGS.pine.cost, sub: '+12 O₂' },
            { id: 'palm', label: 'Palma', icon: '🌴', cost: BUILDINGS.palm.cost, sub: '+5 O₂' },
            { id: 'ceiba', label: 'Ceiba', icon: '🌳', cost: BUILDINGS.ceiba.cost, sub: '+22 O₂ 2×2' },
            { id: 'bush', label: 'Arbusto', icon: '🌿', cost: BUILDINGS.bush.cost, sub: '+2 O₂' },
            { id: 'flower', label: 'Flores', icon: '🌸', cost: BUILDINGS.flower.cost, sub: '+1 O₂' },
            { id: 'rock', label: 'Roca', icon: '🪨', cost: BUILDINGS.rock.cost, sub: '—' },
          ]"
          :key="tool.id"
          @click="city.selectedTool = tool.id"
          class="p-1.5 rounded border flex flex-col items-center gap-0.5"
          :class="city.selectedTool===tool.id ? 'bg-green-500/20 border-green-500 text-green-300 ring-1 ring-green-500' : 'bg-slate-800 border-slate-700 text-white/70 hover:bg-slate-700'"
        >
          <span class="text-sm">{{ tool.icon }}</span><span class="text-[9px] font-semibold leading-none">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-green-400">${{ tool.cost }}</span>
        </button>
      </div>
      <p v-show="open.naturaleza" class="px-2 pb-2 text-[9px] text-green-400/60 leading-tight">A más población/industria (-O₂) necesitas más árboles (+O₂). Déficit baja ingresos.</p>
    </section>

    <!-- 8. UTILIDADES -->
    <section class="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden">
      <button @click="toggle('utils')" class="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 transition-colors">
        <span class="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-200"><span>🧰</span> UTILIDADES</span>
        <span class="text-slate-300 text-xs">{{ open.utils ? '−' : '+' }}</span>
      </button>
      <div v-show="open.utils" class="p-2 grid grid-cols-2 gap-1.5">
        <button @click="city.selectedTool='demolish'" class="p-2.5 rounded border flex items-center justify-between" :class="city.selectedTool==='demolish' ? 'bg-red-600 border-red-400 text-white ring-1 ring-red-400' : 'bg-slate-800 border-slate-700 text-white/70'">
          <span class="flex items-center gap-1.5 text-xs font-semibold">🚜 Demoler</span><span class="text-[9px] opacity-60">50% reembolso</span>
        </button>
        <button @click="city.selectedTool='fill'" class="p-2.5 rounded border flex items-center justify-between" :class="city.selectedTool==='fill' ? 'bg-amber-600 border-amber-400 text-white ring-1 ring-amber-400' : 'bg-slate-800 border-slate-700 text-white/70'">
          <span class="flex items-center gap-1.5 text-xs font-semibold">⛏️ Rellenar</span><span class="text-xs font-mono">$25</span>
        </button>
      </div>
    </section>

    <!-- Info contextual -->
    <div v-if="city.selectedTool && BUILDINGS[city.selectedTool]" class="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 text-xs text-slate-400 space-y-1">
      <div class="font-semibold text-slate-200 capitalize mb-1">{{ BUILDINGS[city.selectedTool].label }} — {{ BUILDINGS[city.selectedTool].description }}</div>
      <div v-if="BUILDINGS[city.selectedTool].population>0">👥 +{{ BUILDINGS[city.selectedTool].population }} hab</div>
      <div v-if="BUILDINGS[city.selectedTool].incomePerTick>0">💰 +${{ BUILDINGS[city.selectedTool].incomePerTick }}/tick</div>
      <div v-if="BUILDINGS[city.selectedTool].energyGenerated>0">⚡ +{{ BUILDINGS[city.selectedTool].energyGenerated }} prod</div>
      <div v-if="BUILDINGS[city.selectedTool].energyConsumed>0">⚡ -{{ BUILDINGS[city.selectedTool].energyConsumed }} cons</div>
      <div v-if="BUILDINGS[city.selectedTool].waterGenerated>0">💧 +{{ BUILDINGS[city.selectedTool].waterGenerated }} prod</div>
      <div v-if="BUILDINGS[city.selectedTool].waterConsumed>0">💧 -{{ BUILDINGS[city.selectedTool].waterConsumed }} cons</div>
      <div v-if="BUILDINGS[city.selectedTool].oxygenGenerated>0">🍃 +{{ BUILDINGS[city.selectedTool].oxygenGenerated }} O₂</div>
      <div v-if="BUILDINGS[city.selectedTool].oxygenConsumed>0">🍃 -{{ BUILDINGS[city.selectedTool].oxygenConsumed }} O₂</div>
    </div>
  </aside>
</template>
