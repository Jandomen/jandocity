<script setup>
import { computed } from 'vue'
import { BUILDINGS } from '@/constants/buildings.js'
import BuildingSprites from './BuildingSprites.vue'

const props = defineProps({
  grid: { type: Array, required: true },
  visibleRows: { type: Array, default: null }
})

const width = computed(() => props.grid[0]?.length || 0)
const height = computed(() => props.grid.length)

const hdTypes = new Set(['residential','residential_small','residential_medium','residential_large','commercial','shop','supermarket','mall','bank','power','waterPlant','water','road','tree','oak','pine','palm','ceiba','dock','pier','fishing_hut','stadium','airport','hotel','hotel_large','restaurant','restaurant_small','university','school','tower_residential','tower_commercial','apartment_block','skyscraper','park','police_station','fire_station','hospital','gym','courthouse','prison','church','cathedral','castle','monument','obelisk','arch','memorial','fountain','lighthouse','dam','wind_turbine','eiffel','liberty','big_ben','christ_rio','colosseum','taj_mahal','great_wall','pyramid','chichen','monserrate','machu','obelisco_ar','torii','palace_kr','wat_thai','table_za','hassan_ma','gate_de','sagrada_es','parthenon_gr','flag_mx','flag_co','flag_br','flag_us','flag_fr','flag_de','flag_es','flag_it','flag_jp','flag_kr','flag_gb','flag_peru','flag_ar','flag_cl','flag_ve','city_hall','museum','port','solar_farm','financial_district','opera','olympic_stadium','nuclear_plant','intl_airport','factory','warehouse','telecom_tower','data_center','sewage_plant','recycling_plant','library','convention_center'])
const buildingVisuals = {}

function isVegetation(id) { return ['bush','flower','rock'].includes(id) }
function isHD(id) { return hdTypes.has(id) }
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <template v-for="row in (visibleRows || grid)" :key="row[0]?.y ?? row[0]?.id">
      <template v-for="cell in row" :key="cell.id">
        <div
          v-if="cell.isOrigin && cell.buildingId && !['road','dirt_road','concrete_road','cobble_road','rail','fence','wall','hedge','brick_wall','metal_fence','gate'].includes(cell.buildingId) && BUILDINGS[cell.buildingId]"
          class="absolute flex items-end justify-center p-[1px] pointer-events-none select-none"
          :style="{
            left: (cell.x - (grid[0]?.[0]?.x ?? 0)) * 48 + 'px',
            top: (cell.y - (grid[0]?.[0]?.y ?? 0)) * 48 + 'px',
            width: (BUILDINGS[cell.buildingId].width || 1) * 48 + 'px',
            height: (BUILDINGS[cell.buildingId].height || 1) * 48 + 'px'
          }"
        >
          <!-- Cimiento de concreto gris para edificios grandes (2×2, 4×4) -->
          <div
            v-if="(BUILDINGS[cell.buildingId].width || 1) > 1 || (BUILDINGS[cell.buildingId].height || 1) > 1"
            class="absolute inset-0 rounded-sm"
            style="background: #9ca3af; background-image: radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px); background-size: 6px 6px; border: 1px solid #6b7280; box-shadow: inset 0 1px 2px rgba(255,255,255,0.25), inset 0 -1px 3px rgba(0,0,0,0.15);"
          ></div>
          <div class="relative w-full h-full flex flex-col items-center justify-end p-[2px]">
            <template v-if="isHD(cell.buildingId)">
              <BuildingSprites :type="cell.buildingId" />
            </template>
            <template v-else-if="isVegetation(cell.buildingId)">
              <div v-if="cell.buildingId==='bush'" class="w-8 h-6 rounded-full" style="background: radial-gradient(ellipse at 30% 30%, #86efac, #22c55e 70%);"></div>
              <div v-else-if="cell.buildingId==='flower'" class="relative w-8 h-6 flex items-end justify-center gap-0.5">
                <div class="w-3 h-3 rounded-full bg-pink-400 border border-pink-600"></div><div class="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600"></div><div class="w-2.5 h-2.5 rounded-full bg-white border border-gray-300"></div>
              </div>
              <div v-else-if="cell.buildingId==='rock'" class="w-6 h-4 rounded-full" style="background: radial-gradient(ellipse at 30% 30%, #a8a29e, #57534e);"></div>
            </template>
            <template v-else>
              <div class="relative w-full h-full rounded flex flex-col overflow-hidden items-center justify-center" :style="{ background: buildingVisuals[cell.buildingId]?.bg || '#22c55e' }">
                <span class="text-[10px] font-bold text-white">{{ BUILDINGS[cell.buildingId].label }}</span>
                <span class="text-[8px] text-white/70">{{ BUILDINGS[cell.buildingId].width }}×{{ BUILDINGS[cell.buildingId].height }}</span>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
