<script setup>
import { ref, computed } from 'vue'
import { useCityStore } from '@/stores/cityStore.js'
import { useSinglePlayerStore } from '@/stores/singlePlayerStore.js'
import { useUnitQueue } from '@/composables/useUnitQueue.js'
import { BUILDINGS } from '@/constants/buildings.js'

defineProps({ showUI: { type: Boolean, default: true } })

const city = useCityStore()
const single = useSinglePlayerStore()
const unitQueue = useUnitQueue()
const selected = ref(null)

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

const baseCategories = [
  { id: 'zonas', label: 'Zonas', icon: '🏘️' },
  { id: 'altura', label: 'Altura', icon: '🏙️' },
  { id: 'grandes', label: 'Grandes', icon: '🏟️' },
  { id: 'mega', label: 'Mega', icon: '🏛️' },
  { id: 'servicios', label: 'Servicios', icon: '🏨' },
  { id: 'publica', label: 'Pública', icon: '🚔' },
  { id: 'cultura', label: 'Cultura', icon: '⛪' },
  { id: 'banderas', label: 'Banderas', icon: '🏳️' },
  { id: 'mundial', label: 'Mundial', icon: '🌍' },
  { id: 'infra', label: 'Infra', icon: '⚡' },
  { id: 'transporte', label: 'Transporte', icon: '🛤️' },
  { id: 'vehiculos', label: 'Vehículos', icon: '🚗' },
  { id: 'terreno', label: 'Terreno', icon: '🌊' },
  { id: 'cercas', label: 'Cercas', icon: '🧱' },
  { id: 'costa', label: 'Costa', icon: '⚓' },
  { id: 'naturaleza', label: 'Naturaleza', icon: '🌳' },
  { id: 'utils', label: 'Utils', icon: '🧰' },
]
const categories = computed(() => {
  if (single.isActive) return [{ id: 'produccion', label: 'Prod.', icon: '⚔️' }, ...baseCategories]
  return baseCategories
})
const hasPolice = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='police_station' && c.owner===single.humanPlayer()?.id))
const hasMil = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='military_academy' && c.owner===single.humanPlayer()?.id))
const hasArs = computed(() => city.flatGrid.some(c=>c.isOrigin && c.buildingId==='arsenal' && c.owner===single.humanPlayer()?.id))

function open(cat) { selected.value = selected.value === cat ? null : cat }
function close() { selected.value = null }
function pick(toolId) {
  city.selectedTool = toolId
  // no cerrar automático para que usuario vea precio, pero modal tiene X abajo
}
</script>

<template>
  <div class="md:hidden">
    <!-- Carrusel inferior — una sola línea, altura del antiguo "Presiona H" -->
    <Transition name="fade">
      <div v-show="showUI" class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <div class="bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-thin snap-x snap-mandatory max-w-[68vw] sm:max-w-[520px]">
          <button
            v-for="c in categories"
            :key="c.id"
            @click="open(c.id)"
            class="snap-start shrink-0 flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-full border text-[10px] leading-none min-w-[44px]"
            :class="selected===c.id ? 'bg-white text-slate-900 border-white' : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/15'"
          >
            <span class="text-[14px] leading-none">{{ c.icon }}</span>
            <span class="text-[8px] font-bold tracking-wide">{{ c.label }}</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Modal centrado — cuadrote con X inferior para cerrar -->
    <Transition name="fade">
      <div v-if="selected" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3" @click.self="close">
        <div class="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-[390px] max-h-[74vh] flex flex-col overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
          <!-- header -->
          <div class="shrink-0 flex items-center justify-between px-3 py-2 border-b border-white/10 bg-slate-800/60">
            <span class="text-xs font-black tracking-wider text-white flex items-center gap-2">
              <span>{{ categories.find(x=>x.id===selected)?.icon }}</span>
              {{ categories.find(x=>x.id===selected)?.label }}
            </span>
            <span class="text-[10px] text-white/50">{{ selected==='produccion' ? 'encola unidad' : 'toca un ítem para equipar' }}</span>
          </div>

          <div class="flex-1 overflow-auto p-3 space-y-3">
            <!-- PRODUCCIÓN UN JUGADOR -->
            <template v-if="selected==='produccion'">
              <div v-if="!hasPolice && !hasMil && !hasArs" class="text-[11px] text-white/40 text-center py-3">Construye Comisaría, Colegio Militar o Arsenal para desbloquear</div>
              <template v-if="hasPolice">
              <div class="text-[10px] font-bold text-sky-400">Comisaría → Policías</div>
              <div class="grid grid-cols-2 gap-1.5">
                <button @click="unitQueue.enqueue('police_station','police', single.humanPlayer()?.id||'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70"><span class="text-base">👮</span><span class="text-[10px] font-semibold">Policía</span><span class="text-[9px] font-mono">$30 · 2.8s</span></button>
                <button @click="unitQueue.enqueue('police_station','police_car', single.humanPlayer()?.id||'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70"><span class="text-base">🚔</span><span class="text-[10px] font-semibold">Patrulla</span><span class="text-[9px] font-mono">$80 · 4s</span></button>
              </div>
              </template>
              <template v-if="hasMil">
              <div class="text-[10px] font-bold text-green-400">Colegio Militar → Soldados</div>
              <div class="grid grid-cols-2 gap-1.5">
                <button @click="unitQueue.enqueue('military_academy','soldier', single.humanPlayer()?.id||'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70"><span class="text-base">🪖</span><span class="text-[10px] font-semibold">Soldado</span><span class="text-[9px] font-mono">$40</span></button>
                <button @click="unitQueue.enqueue('military_academy','soldier_heavy', single.humanPlayer()?.id||'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70"><span class="text-base">🎖️</span><span class="text-[10px] font-semibold">Pesado</span><span class="text-[9px] font-mono">$60</span></button>
                <button @click="unitQueue.enqueue('military_academy','army_jeep', single.humanPlayer()?.id||'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70"><span class="text-base">🚙</span><span class="text-[10px] font-semibold">Jeep</span><span class="text-[9px] font-mono">$90</span></button>
                <button @click="unitQueue.enqueue('military_academy','tank', single.humanPlayer()?.id||'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70"><span class="text-base">🛡️</span><span class="text-[10px] font-semibold">Tanque</span><span class="text-[9px] font-mono">$180</span></button>
              </div>
              </template>
              <template v-if="hasArs">
              <div class="text-[10px] font-bold text-zinc-400">Arsenal → Maquinaria/Cañones</div>
              <div class="grid grid-cols-2 gap-1.5">
                <button @click="unitQueue.enqueue('arsenal','tractor', single.humanPlayer()?.id||'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70"><span class="text-base">🚜</span><span class="text-[10px] font-semibold">Tractor</span><span class="text-[9px] font-mono">$50</span></button>
                <button @click="unitQueue.enqueue('arsenal','cannon', single.humanPlayer()?.id||'p0')" class="p-2 rounded border flex flex-col items-center gap-0.5 bg-slate-800 border-slate-700 text-white/70"><span class="text-base">💣</span><span class="text-[10px] font-semibold">Cañón</span><span class="text-[9px] font-mono">$120</span></button>
              </div>
              </template>
              <div v-if="unitQueue.queue.length" class="bg-slate-900 rounded border border-white/10 p-2 space-y-1">
                <div class="text-[10px] font-bold text-white/60">Cola ({{ unitQueue.queue.length }})</div>
                <div v-for="q in unitQueue.queue" :key="q.id" class="flex items-center gap-2 text-[11px] bg-slate-800 rounded px-2 py-1 border border-slate-700">
                  <span class="flex-1 truncate">{{ q.unitType }}</span><span class="font-mono text-sky-300">{{ Math.round(q.progress) }}%</span><div class="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden"><div class="h-full bg-amber-400" :style="{width: q.progress+'%'}"></div></div>
                </div>
              </div>
            </template>

            <!-- ZONAS -->
            <template v-if="selected==='zonas'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="v in [
                  { id: 'residential', label: 'Normal', icon: '🏠', cost: BUILDINGS.residential.cost, sub: '1×1' },
                  { id: 'residential_small', label: 'Pequeña', icon: '🏠', cost: BUILDINGS.residential_small.cost, sub: '8 hab' },
                  { id: 'residential_medium', label: 'Mediana', icon: '🏡', cost: BUILDINGS.residential_medium.cost, sub: '14 hab' },
                  { id: 'residential_large', label: 'Grande', icon: '🏘️', cost: BUILDINGS.residential_large.cost, sub: '28 hab 2×2' },
                ]" :key="v.id" @click="pick(v.id); city.selectedHouseVariant=v.id" class="p-2 rounded border text-xs text-left flex flex-col gap-0.5" :class="city.selectedTool===v.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <div class="flex items-center gap-1.5"><span>{{ v.icon }}</span><span class="font-semibold text-[11px]">{{ v.label }}</span><span class="ml-auto text-[10px] font-mono text-emerald-400">${{ v.cost }}</span></div><div class="text-[9px] opacity-60">{{ v.sub }}</div>
                </button>
              </div>
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
                  { id: 'commercial', label: 'Comercial', icon: '🏪', cost: BUILDINGS.commercial.cost, sub: '+18💰/tick' },
                  { id: 'shop', label: 'Tienda', icon: '🛒', cost: BUILDINGS.shop.cost, sub: '+12💰' },
                  { id: 'supermarket', label: 'Super', icon: '🛍️', cost: BUILDINGS.supermarket.cost, sub: '+24💰 2×2' },
                  { id: 'mall', label: 'Mall', icon: '🏬', cost: BUILDINGS.mall.cost, sub: '+36💰 3×2' },
                  { id: 'bank', label: 'Banco', icon: '🏦', cost: BUILDINGS.bank.cost, sub: '+28💰 2×1' },
                  { id: 'park', label: 'Parque', icon: '🌳', cost: BUILDINGS.park.cost, sub: '+10 O₂ 2×2' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border text-xs text-left" :class="city.selectedTool===tool.id ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <div class="flex items-center gap-1.5"><span>{{ tool.icon }}</span><span class="font-semibold text-[11px]">{{ tool.label }}</span><span class="ml-auto text-[10px] font-mono text-sky-400">${{ tool.cost }}</span></div><div class="text-[9px] opacity-60">{{ tool.sub }}</div>
                </button>
              </div>
            </template>

            <!-- ALTURA -->
            <template v-else-if="selected==='altura'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
                  { id: 'tower_residential', label: 'Torre vivienda', icon: '🏢', cost: BUILDINGS.tower_residential.cost, sub: '1×2 · +26 hab' },
                  { id: 'tower_commercial', label: 'Torre oficinas', icon: '🏢', cost: BUILDINGS.tower_commercial.cost, sub: '1×2 · +26💰' },
                  { id: 'apartment_block', label: 'Bloque 2×2', icon: '🏢', cost: BUILDINGS.apartment_block.cost, sub: '2×2 · +36 hab' },
                  { id: 'skyscraper', label: 'Rascacielos', icon: '🌃', cost: BUILDINGS.skyscraper.cost, sub: '2×2 · +48 hab' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border text-xs flex flex-col gap-0.5" :class="city.selectedTool===tool.id ? 'bg-slate-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- GRANDES -->
            <template v-else-if="selected==='grandes'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
                  { id: 'stadium', label: 'Estadio', icon: '🏟️', cost: BUILDINGS.stadium.cost, sub: '3×3' },
                  { id: 'airport', label: 'Aeropuerto', icon: '✈️', cost: BUILDINGS.airport.cost, sub: '4×3' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col gap-1" :class="city.selectedTool===tool.id ? 'bg-violet-500/20 border-violet-500 text-violet-300 ring-1 ring-violet-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-lg">{{ tool.icon }}</span><span class="text-[11px] font-semibold">{{ tool.label }}</span><span class="text-[10px] font-mono text-violet-400">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- MEGA -->
            <template v-else-if="selected==='mega'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
                  { id: 'city_hall', label: 'Ayuntamiento', icon: '🏛️', cost: BUILDINGS.city_hall.cost, sub: '3×3' },
                  { id: 'museum', label: 'Museo', icon: '🖼️', cost: BUILDINGS.museum.cost, sub: '3×3' },
                  { id: 'port', label: 'Puerto', icon: '⚓', cost: BUILDINGS.port.cost, sub: '5×2' },
                  { id: 'solar_farm', label: 'Solar', icon: '☀️', cost: BUILDINGS.solar_farm.cost, sub: '+32⚡ 3×3' },
                  { id: 'financial_district', label: 'Financiero', icon: '🏙️', cost: BUILDINGS.financial_district.cost, sub: '4×4' },
                  { id: 'opera', label: 'Ópera', icon: '🎭', cost: BUILDINGS.opera.cost, sub: '3×3' },
                  { id: 'olympic_stadium', label: 'Olímpico', icon: '🏟️', cost: BUILDINGS.olympic_stadium.cost, sub: '5×5' },
                  { id: 'nuclear_plant', label: 'Nuclear', icon: '☢️', cost: BUILDINGS.nuclear_plant.cost, sub: '+55⚡ 4×4' },
                  { id: 'intl_airport', label: 'Intl. Airport', icon: '✈️', cost: BUILDINGS.intl_airport.cost, sub: '5×3' },
                  { id: 'library', label: 'Biblioteca', icon: '📚', cost: BUILDINGS.library.cost, sub: '3×2' },
                  { id: 'convention_center', label: 'Convenciones', icon: '🏢', cost: BUILDINGS.convention_center.cost, sub: '4×3' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col gap-0.5" :class="city.selectedTool===tool.id ? 'bg-zinc-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- SERVICIOS -->
            <template v-else-if="selected==='servicios'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
                  { id: 'hotel', label: 'Hotel', icon: '🏨', cost: BUILDINGS.hotel.cost, sub: '2×2 · +18 hab' },
                  { id: 'hotel_large', label: 'Hotel G', icon: '🏨', cost: BUILDINGS.hotel_large.cost, sub: '3×2 · +32 hab' },
                  { id: 'restaurant_small', label: 'Cafetería', icon: '☕', cost: BUILDINGS.restaurant_small.cost, sub: '1×1 · +9💰' },
                  { id: 'restaurant', label: 'Restaurante', icon: '🍽️', cost: BUILDINGS.restaurant.cost, sub: '2×1 · +16💰' },
                  { id: 'school', label: 'Escuela', icon: '🏫', cost: BUILDINGS.school.cost, sub: '2×2 · +6 hab' },
                  { id: 'university', label: 'Universidad', icon: '🎓', cost: BUILDINGS.university.cost, sub: '3×3 · +12 hab' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col gap-0.5" :class="city.selectedTool===tool.id ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-indigo-400">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- PUBLICA -->
            <template v-else-if="selected==='publica'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
                  { id: 'police_station', label: 'Comisaría', icon: '🚔', cost: BUILDINGS.police_station.cost, sub: '2×2' },
                  { id: 'fire_station', label: 'Bomberos', icon: '🚒', cost: BUILDINGS.fire_station.cost, sub: '2×2' },
                  { id: 'hospital', label: 'Hospital', icon: '🏥', cost: BUILDINGS.hospital.cost, sub: '3×2' },
                  { id: 'gym', label: 'Gimnasio', icon: '🏋️', cost: BUILDINGS.gym.cost, sub: '2×2' },
                  { id: 'courthouse', label: 'Juzgado', icon: '⚖️', cost: BUILDINGS.courthouse.cost, sub: '2×2' },
                  { id: 'prison', label: 'Cárcel', icon: '🔒', cost: BUILDINGS.prison.cost, sub: '3×3' },
                  { id: 'military_academy', label: 'Colegio Militar', icon: '🪖', cost: BUILDINGS.military_academy.cost, sub: '3×3 soldados' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col gap-0.5" :class="city.selectedTool===tool.id ? 'bg-slate-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- CULTURA -->
            <template v-else-if="selected==='cultura'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
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
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col gap-0.5" :class="city.selectedTool===tool.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- BANDERAS -->
            <template v-else-if="selected==='banderas'">
              <div class="grid grid-cols-4 gap-1">
                <button v-for="tool in [
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
                ]" :key="tool.id" @click="pick(tool.id)" class="p-1.5 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool===tool.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[9px] font-semibold">{{ tool.label }}</span><span class="text-[9px] font-mono text-emerald-400">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- MUNDIAL -->
            <template v-else-if="selected==='mundial'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
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
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col gap-0.5" :class="city.selectedTool===tool.id ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-sky-400">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- INFRA -->
            <template v-else-if="selected==='infra'">
              <div class="grid grid-cols-2 gap-1.5">
                <button v-for="tool in [
                  { id: 'arsenal', label: 'Arsenal', icon: '💣', cost: BUILDINGS.arsenal.cost, sub: '3×3 · 🚜→💣' },
                  { id: 'power', label: 'Planta energía', icon: '⚡', cost: BUILDINGS.power.cost, sub: '+25⚡ 2×2' },
                  { id: 'waterPlant', label: 'Planta agua', icon: '🏭', cost: BUILDINGS.waterPlant.cost, sub: '+25💧 2×2' },
                  { id: 'factory', label: 'Fábrica', icon: '🏭', cost: BUILDINGS.factory.cost, sub: '+22💰 3×2' },
                  { id: 'warehouse', label: 'Almacén', icon: '🏚️', cost: BUILDINGS.warehouse.cost, sub: '2×2' },
                  { id: 'telecom_tower', label: 'Antena', icon: '📡', cost: BUILDINGS.telecom_tower.cost, sub: '1×1' },
                  { id: 'data_center', label: 'Data center', icon: '💾', cost: BUILDINGS.data_center.cost, sub: '2×2 · -14⚡' },
                  { id: 'sewage_plant', label: 'Depuradora', icon: '🚿', cost: BUILDINGS.sewage_plant.cost, sub: '+18💧 2×2' },
                  { id: 'recycling_plant', label: 'Reciclaje', icon: '♻️', cost: BUILDINGS.recycling_plant.cost, sub: '+6 O₂' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border text-xs text-left" :class="city.selectedTool===tool.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <div class="flex items-center gap-1.5"><span>{{ tool.icon }}</span><span class="font-semibold text-[11px]">{{ tool.label }}</span></div><div class="text-[9px] opacity-60">{{ tool.sub }}</div><div class="text-[10px] font-mono text-amber-400">${{ tool.cost }}</div>
                </button>
              </div>
            </template>

            <!-- TRANSPORTE -->
            <template v-else-if="selected==='transporte'">
              <div class="text-[10px] text-zinc-400 font-bold">Carreteras — 4 pavimentos</div>
              <div class="grid grid-cols-4 gap-1">
                <button v-for="r in [
                  { id: 'road', label: 'Asfalto', icon: '🛣️', cost: BUILDINGS.road.cost },
                  { id: 'dirt_road', label: 'Terracería', icon: '🟫', cost: BUILDINGS.dirt_road.cost },
                  { id: 'concrete_road', label: 'Concreto', icon: '⬜', cost: BUILDINGS.concrete_road.cost },
                  { id: 'cobble_road', label: 'Empedrado', icon: '🪨', cost: BUILDINGS.cobble_road.cost },
                ]" :key="r.id" @click="pick(r.id)" class="p-2 rounded border flex flex-col items-center gap-0.5" :class="['road','dirt_road','concrete_road','cobble_road'].includes(city.selectedTool) && city.selectedTool===r.id ? 'bg-zinc-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ r.icon }}</span><span class="text-[9px] font-semibold">{{ r.label }}</span><span class="text-[9px] font-mono">${{ r.cost }}</span>
                </button>
              </div>
              <div v-if="['road','dirt_road','concrete_road','cobble_road'].includes(city.selectedTool)" class="grid grid-cols-4 gap-1">
                <button v-for="v in roadVariants" :key="v.id" @click="city.selectedRoadVariant=v.id" class="p-1.5 rounded border text-xs" :class="city.selectedRoadVariant===v.id ? 'bg-zinc-600 border-white text-white' : 'bg-slate-800 border-slate-700 text-white/60'"><div class="text-sm leading-none">{{ v.icon }}</div><div class="text-[8px] leading-tight mt-0.5">{{ v.label }}</div></button>
              </div>
              <div class="grid grid-cols-2 gap-1.5 mt-2">
                <button @click="pick('rail')" class="p-2 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool==='rail' ? 'bg-stone-600 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70'"><span class="text-base">🛤️</span><span class="text-[10px] font-semibold">Riel</span><span class="text-[9px] font-mono">${{ BUILDINGS.rail.cost }}</span></button>
                <button @click="pick('train')" class="p-2 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool==='train' ? 'bg-zinc-800 border-white text-white ring-1 ring-white' : 'bg-slate-800 border-slate-700 text-white/70'"><span class="text-base">🚂</span><span class="text-[10px] font-semibold">Tren</span><span class="text-[9px] font-mono">${{ BUILDINGS.train.cost }}</span></button>
              </div>
              <div v-if="['rail','train'].includes(city.selectedTool)" class="grid grid-cols-4 gap-1 mt-1">
                <button v-for="v in roadVariants" :key="'rail-'+v.id" @click="city.selectedRailVariant=v.id" class="p-1.5 rounded border text-xs" :class="city.selectedRailVariant===v.id ? 'bg-stone-600 border-white text-white' : 'bg-slate-800 border-slate-700 text-white/60'"><div class="text-sm leading-none">{{ v.icon }}</div><div class="text-[8px] leading-tight mt-0.5">{{ v.label }}</div></button>
              </div>
            </template>

            <!-- VEHICULOS -->
            <template v-else-if="selected==='vehiculos'">
              <div class="grid grid-cols-3 gap-1.5">
                <button v-for="v in [
                  { id: 'car', label: 'Coche', icon: '🚗', cost: 25 },
                  { id: 'pickup', label: 'Camioneta', icon: '🛻', cost: 35 },
                  { id: 'moto', label: 'Moto', icon: '🏍️', cost: 18 },
                  { id: 'trailer', label: 'Trailer', icon: '🚛', cost: 45 },
                  { id: 'bus', label: 'Bus', icon: '🚌', cost: 40 },
                ]" :key="v.id" @click="pick(v.id)" class="p-2 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool===v.id ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ v.icon }}</span><span class="text-[10px] font-semibold">{{ v.label }}</span><span class="text-[9px] font-mono text-blue-400">${{ v.cost }}</span>
                </button>
              </div>
              <div class="grid grid-cols-3 gap-1.5 border-t border-slate-700/30 mt-2 pt-2">
                <button v-for="tool in [
                  { id: 'bus_terminal', label: 'Terminal', icon: '🚌', cost: BUILDINGS.bus_terminal.cost, sub: '3×2 buses' },
                  { id: 'car_dealership', label: 'Autos', icon: '🏎️', cost: BUILDINGS.car_dealership.cost, sub: '2×2 autos' },
                  { id: 'moto_dealership', label: 'Motos', icon: '🏍️', cost: BUILDINGS.moto_dealership.cost, sub: '2×2 motos' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool===tool.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-amber-400">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- TERRENO -->
            <template v-else-if="selected==='terreno'">
              <div class="grid grid-cols-4 gap-1">
                <button v-for="tool in [
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
                ]" :key="tool.id" @click="pick(tool.id)" class="p-1.5 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool===tool.id ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-sm">{{ tool.icon }}</span><span class="text-[9px] font-semibold">{{ tool.label }}</span><span class="text-[9px] font-mono text-sky-400">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- CERCAS -->
            <template v-else-if="selected==='cercas'">
              <div class="grid grid-cols-3 gap-1.5">
                <button v-for="tool in [
                  { id: 'fence', label: 'Valla', icon: '🪵', cost: BUILDINGS.fence.cost },
                  { id: 'wall', label: 'Muro', icon: '🧱', cost: BUILDINGS.wall.cost },
                  { id: 'hedge', label: 'Seto', icon: '🌿', cost: BUILDINGS.hedge.cost },
                  { id: 'brick_wall', label: 'Ladrillo', icon: '🧱', cost: BUILDINGS.brick_wall.cost },
                  { id: 'metal_fence', label: 'Malla', icon: '⛓️', cost: BUILDINGS.metal_fence.cost },
                  { id: 'gate', label: 'Reja', icon: '🚪', cost: BUILDINGS.gate.cost },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool===tool.id ? 'bg-stone-500/20 border-stone-400 text-stone-200 ring-1 ring-stone-400' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[9px] font-mono">${{ tool.cost }}</span>
                </button>
              </div>
              <div v-if="['fence','wall','hedge','brick_wall','metal_fence','gate'].includes(city.selectedTool)" class="mt-2">
                <div class="text-[10px] text-stone-400 font-bold mb-1">Variante muro</div>
                <div class="grid grid-cols-4 gap-1">
                  <button v-for="v in wallVariants" :key="v.id" @click="city.selectedWallVariant=v.id" class="p-1.5 rounded border text-xs" :class="city.selectedWallVariant===v.id ? 'bg-stone-600 border-white text-white' : 'bg-slate-800 border-slate-700 text-white/60'"><div class="text-sm leading-none">{{ v.icon }}</div><div class="text-[8px] leading-tight mt-0.5">{{ v.label }}</div></button>
                </div>
              </div>
            </template>

            <!-- COSTA -->
            <template v-else-if="selected==='costa'">
              <div class="grid grid-cols-3 gap-1.5">
                <button v-for="tool in [
                  { id: 'dock', label: 'Muelle', icon: '⚓', cost: BUILDINGS.dock.cost, sub: '2×1' },
                  { id: 'pier', label: 'Muelle L', icon: '🛥️', cost: BUILDINGS.pier.cost, sub: '3×1' },
                  { id: 'fishing_hut', label: 'Cabaña', icon: '🎣', cost: BUILDINGS.fishing_hut.cost, sub: '1×1' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-2 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool===tool.id ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-base">{{ tool.icon }}</span><span class="text-[10px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-blue-400">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- NATURALEZA -->
            <template v-else-if="selected==='naturaleza'">
              <div class="grid grid-cols-4 gap-1">
                <button v-for="tool in [
                  { id: 'tree', label: 'Árbol', icon: '🌳', cost: BUILDINGS.tree.cost, sub: '+6 O₂' },
                  { id: 'oak', label: 'Roble', icon: '🌲', cost: BUILDINGS.oak.cost, sub: '+9 O₂' },
                  { id: 'pine', label: 'Pino', icon: '🌲', cost: BUILDINGS.pine.cost, sub: '+12 O₂' },
                  { id: 'palm', label: 'Palma', icon: '🌴', cost: BUILDINGS.palm.cost, sub: '+5 O₂' },
                  { id: 'ceiba', label: 'Ceiba', icon: '🌳', cost: BUILDINGS.ceiba.cost, sub: '+22 O₂ 2×2' },
                  { id: 'bush', label: 'Arbusto', icon: '🌿', cost: BUILDINGS.bush.cost, sub: '+2 O₂' },
                  { id: 'flower', label: 'Flores', icon: '🌸', cost: BUILDINGS.flower.cost, sub: '+1 O₂' },
                  { id: 'rock', label: 'Roca', icon: '🪨', cost: BUILDINGS.rock.cost, sub: '—' },
                ]" :key="tool.id" @click="pick(tool.id)" class="p-1.5 rounded border flex flex-col items-center gap-0.5" :class="city.selectedTool===tool.id ? 'bg-green-500/20 border-green-500 text-green-300 ring-1 ring-green-500' : 'bg-slate-800 border-slate-700 text-white/70'">
                  <span class="text-sm">{{ tool.icon }}</span><span class="text-[9px] font-semibold">{{ tool.label }}</span><span class="text-[8px] opacity-60">{{ tool.sub }}</span><span class="text-[9px] font-mono text-green-400">${{ tool.cost }}</span>
                </button>
              </div>
            </template>

            <!-- UTILS -->
            <template v-else-if="selected==='utils'">
              <div class="grid grid-cols-2 gap-1.5">
                <button @click="pick('demolish')" class="p-2.5 rounded border flex items-center justify-between" :class="city.selectedTool==='demolish' ? 'bg-red-600 border-red-400 text-white ring-1 ring-red-400' : 'bg-slate-800 border-slate-700 text-white/70'"><span class="flex items-center gap-1.5 text-xs font-semibold">🚜 Demoler</span><span class="text-[9px] opacity-60">50% reembolso</span></button>
                <button @click="pick('fill')" class="p-2.5 rounded border flex items-center justify-between" :class="city.selectedTool==='fill' ? 'bg-amber-600 border-amber-400 text-white ring-1 ring-amber-400' : 'bg-slate-800 border-slate-700 text-white/70'"><span class="flex items-center gap-1.5 text-xs font-semibold">⛏️ Rellenar</span><span class="text-xs font-mono">$25</span></button>
              </div>
            </template>
          </div>

          <!-- X inferior para cerrar -->
          <div class="shrink-0 p-3 border-t border-white/10 bg-slate-800/60">
            <button @click="close" class="w-full py-2.5 rounded-full bg-white text-slate-900 font-black text-sm hover:bg-slate-100 active:scale-[0.98]">✕ Cerrar</button>
            <p class="text-center text-[10px] text-white/40 mt-1.5">Selecciona y toca el mapa para construir • arrastra para pintar</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
