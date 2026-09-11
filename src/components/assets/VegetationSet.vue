<template>
  <div class="grid grid-cols-4 gap-3">
    <div v-for="v in [
      {name:'Árbol pequeño', size:36},
      {name:'Árbol mediano', size:44},
      {name:'Árbol grande', size:52},
      {name:'Arbusto', size:28},
      {name:'Flores', size:24},
      {name:'Roca', size:22},
      {name:'Grupo árboles', size:58},
      {name:'Pino', size:46},
    ]" :key="v.name" class="bg-[#1a221a]/50 rounded-xl p-2 flex flex-col items-center gap-1.5 border border-white/5">
      <svg :viewBox="`0 0 80 80`" class="w-[72px] h-[72px] overflow-visible">
        <ellipse cx="40" cy="70" rx="18" ry="5" fill="black" opacity="0.25"/>
        <!-- tronco -->
        <rect v-if="v.name.includes('Árbol') || v.name==='Pino' || v.name==='Grupo'" x="36" y="48" width="8" height="14" rx="2" fill="#5a3a1a" stroke="#3a240c" stroke-width="0.6"/>
        <rect v-else-if="v.name==='Arbusto'" x="32" y="54" width="16" height="6" rx="3" fill="#3d5f2a"/>
        <!-- copa -->
        <circle v-if="v.name==='Árbol pequeño'" cx="40" cy="38" r="16" fill="#22c55e" stroke="#15803d" stroke-width="0.8"/>
        <circle v-if="v.name==='Árbol pequeño'" cx="40" cy="38" r="9" fill="#4ade80" opacity="0.6"/>
        <circle v-if="v.name==='Árbol mediano'" cx="40" cy="34" r="20" fill="#16a34a" stroke="#14532d" stroke-width="0.8"/>
        <circle v-if="v.name==='Árbol mediano'" cx="40" cy="34" r="11" fill="#86efac" opacity="0.5"/>
        <circle v-if="v.name==='Árbol grande'" cx="40" cy="30" r="24" fill="#15803d" stroke="#0f3a1f" stroke-width="0.8"/>
        <circle v-if="v.name==='Árbol grande'" cx="40" cy="30" r="14" fill="#4ade80" opacity="0.45"/>
        <ellipse v-if="v.name==='Arbusto'" cx="40" cy="46" rx="20" ry="14" fill="#4ade80" stroke="#22c55e" stroke-width="0.7"/>
        <g v-if="v.name==='Flores'">
          <circle cx="28" cy="52" r="4" fill="#f472b6"/><circle cx="36" cy="48" r="4" fill="#facc15"/><circle cx="44" cy="52" r="4" fill="#f472b6"/><circle cx="52" cy="50" r="3" fill="#60a5fa"/>
          <ellipse cx="40" cy="60" rx="22" ry="8" fill="#4ade80" opacity="0.8"/>
        </g>
        <ellipse v-if="v.name==='Roca'" cx="40" cy="58" rx="16" ry="9" fill="#a8a29e" stroke="#78716c" stroke-width="0.7"/>
        <ellipse v-if="v.name==='Roca'" cx="40" cy="58" rx="9" ry="5" fill="#d6d3d1" opacity="0.5"/>
        <g v-if="v.name==='Grupo árboles'">
          <circle cx="28" cy="36" r="14" fill="#15803d"/><circle cx="52" cy="34" r="16" fill="#16a34a"/><circle cx="40" cy="44" r="12" fill="#22c55e"/>
        </g>
        <path v-if="v.name==='Pino'" d="M40 12 L18 48 L28 48 L22 62 L58 62 L52 48 L62 48 Z" fill="#14532d" stroke="#0f3a1f" stroke-width="0.8"/>
      </svg>
      <span class="text-[10px] font-medium text-white text-center leading-tight">{{ v.name }}</span>
    </div>
  </div>
</template>
