<script setup>
// KIT 14 piezas — más ángulos y todas pintadas
const pieces = [
  { id:'straight-h', label:'Recta H', rot:0, type:'straight' },
  { id:'straight-v', label:'Recta V', rot:90, type:'straight' },
  { id:'diagonal', label:'Diagonal 45°', rot:45, type:'diagonal' },
  { id:'curve-90', label:'Curva 90°', rot:0, type:'curve' },
  { id:'curve-90-r', label:'Curva 90° R', rot:90, type:'curve' },
  { id:'curve-45', label:'Curva 45°', rot:0, type:'curve45' },
  { id:'curve-soft', label:'Curva suave', rot:0, type:'curveSoft' },
  { id:'curve-soft-r', label:'Curva suave R', rot:90, type:'curveSoft' },
  { id:'t', label:'T', rot:0, type:'t' },
  { id:'cross', label:'Cruce 4', rot:0, type:'cross' },
  { id:'end', label:'Final', rot:0, type:'end' },
  { id:'entry', label:'Entrada', rot:0, type:'entry' },
  { id:'crosswalk', label:'Paso peatonal', rot:0, type:'crosswalk' },
  { id:'roundabout', label:'Glorieta', rot:0, type:'roundabout' },
]
</script>

<template>
  <div class="grid grid-cols-5 gap-3">
    <div v-for="p in pieces" :key="p.id" class="bg-[#1a221a]/60 rounded-lg p-3 flex flex-col items-center gap-2 border border-white/5">
      <div class="w-[88px] h-[88px] bg-[#0f150f] rounded-md flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 100" class="w-full h-full" :style="{ transform: `rotate(${p.rot}deg)` }">
          <!-- Sombra sutil -->
          <rect x="6" y="6" width="88" height="88" rx="6" fill="black" opacity="0.18"/>
          <!-- Asfalto base -->
          <g v-if="p.type==='straight'">
            <rect x="0" y="30" width="100" height="40" rx="4" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.5"/>
            <rect x="0" y="30" width="100" height="40" rx="4" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <!-- líneas centrales -->
            <line x1="8" y1="50" x2="92" y2="50" stroke="#fde68a" stroke-width="2" stroke-dasharray="8 6" opacity="0.9"/>
            <!-- bordes -->
            <line x1="0" y1="31" x2="100" y2="31" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
            <line x1="0" y1="69" x2="100" y2="69" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
          </g>
          <g v-else-if="p.type==='curve'">
            <path d="M0 30 H48 A22 22 0 0 1 70 52 V100 H100 V0 H0 Z" fill="#2a2f3a" opacity="0.0"/>
            <path d="M0 30 H42 A28 28 0 0 1 70 58 V100 H30 V58 A28 28 0 0 0 42 30 Z" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <path d="M14 50 A34 34 0 0 1 50 14" fill="none" stroke="#fde68a" stroke-width="2" stroke-dasharray="6 5" opacity="0.85"/>
          </g>
          <g v-else-if="p.type==='curve45'">
            <path d="M0 36 L36 36 A18 18 0 0 1 54 54 L54 90 L90 54 A52 52 0 0 0 36 0 L0 0 Z" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <path d="M18 50 A28 28 0 0 1 50 18" fill="none" stroke="#fde68a" stroke-width="1.6" opacity="0.85"/>
          </g>
          <g v-else-if="p.type==='curveSoft'">
            <path d="M0 32 H38 C52 32 68 42 68 58 V100 H32 V58 C32 52 28 32 0 32 Z" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <path d="M12 48 C32 48 48 48 52 68" fill="none" stroke="#fde68a" stroke-width="2" stroke-dasharray="7 6" opacity="0.85"/>
          </g>
          <g v-else-if="p.type==='t'">
            <rect x="0" y="30" width="100" height="40" rx="4" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <rect x="30" y="0" width="40" height="70" rx="4" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <rect x="0" y="30" width="100" height="40" rx="4" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <line x1="8" y1="50" x2="92" y2="50" stroke="#fde68a" stroke-width="2" stroke-dasharray="8 6" opacity="0.9"/>
            <line x1="50" y1="8" x2="50" y2="70" stroke="#fde68a" stroke-width="2" stroke-dasharray="8 6" opacity="0.9"/>
          </g>
          <g v-else-if="p.type==='cross'">
            <rect x="0" y="30" width="100" height="40" rx="4" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <rect x="30" y="0" width="40" height="100" rx="4" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <line x1="8" y1="50" x2="92" y2="50" stroke="#fde68a" stroke-width="2" stroke-dasharray="7 5" opacity="0.9"/>
            <line x1="50" y1="8" x2="50" y2="92" stroke="#fde68a" stroke-width="2" stroke-dasharray="7 5" opacity="0.9"/>
            <rect x="42" y="42" width="16" height="16" rx="2" fill="#1e222b" opacity="0.9"/>
          </g>
          <g v-else-if="p.type==='end'">
            <rect x="0" y="30" width="78" height="40" rx="6" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <rect x="72" y="34" width="4" height="32" rx="2" fill="white" opacity="0.85"/>
            <line x1="8" y1="50" x2="68" y2="50" stroke="#fde68a" stroke-width="2" stroke-dasharray="8 6" opacity="0.9"/>
          </g>
          <g v-else-if="p.type==='entry'">
            <rect x="0" y="30" width="100" height="40" rx="4" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <rect x="82" y="28" width="14" height="44" rx="2" fill="#4a3a1a" opacity="0.9"/>
            <rect x="84" y="32" width="10" height="36" rx="1" fill="#8b7355"/>
            <line x1="8" y1="50" x2="82" y2="50" stroke="#fde68a" stroke-width="2" stroke-dasharray="8 6" opacity="0.9"/>
          </g>
          <g v-else-if="p.type==='diagonal'">
            <rect x="14" y="14" width="72" height="72" rx="6" transform="rotate(45 50 50)" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <line x1="50" y1="18" x2="50" y2="82" stroke="#fde68a" stroke-width="2" stroke-dasharray="7 5" opacity="0.9" transform="rotate(45 50 50)"/>
            <line x1="38" y1="14" x2="38" y2="86" stroke="white" stroke-width="1" opacity="0.7" transform="rotate(45 50 50)"/>
            <line x1="62" y1="14" x2="62" y2="86" stroke="white" stroke-width="1" opacity="0.7" transform="rotate(45 50 50)"/>
          </g>
          <g v-else-if="p.type==='roundabout'">
            <circle cx="50" cy="50" r="32" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.5"/>
            <circle cx="50" cy="50" r="18" fill="#1a221a" stroke="#4a3721" stroke-width="1"/>
            <circle cx="50" cy="50" r="32" fill="none" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.8"/>
            <circle cx="50" cy="50" r="18" fill="none" stroke="white" stroke-width="1" opacity="0.6"/>
          </g>
          <g v-else-if="p.type==='crosswalk'">
            <rect x="0" y="30" width="100" height="40" rx="4" fill="#2a2f3a" stroke="#1e222b" stroke-width="1.2"/>
            <g fill="white" opacity="0.92">
              <rect x="38" y="32" width="6" height="36" rx="1"/>
              <rect x="48" y="32" width="6" height="36" rx="1"/>
              <rect x="58" y="32" width="6" height="36" rx="1"/>
            </g>
            <line x1="8" y1="50" x2="32" y2="50" stroke="#fde68a" stroke-width="2" stroke-dasharray="8 6" opacity="0.9"/>
            <line x1="70" y1="50" x2="92" y2="50" stroke="#fde68a" stroke-width="2" stroke-dasharray="8 6" opacity="0.9"/>
          </g>
        </svg>
      </div>
      <span class="text-[10px] leading-tight text-white/80 font-medium text-center">{{ p.label }}</span>
      <span class="text-[8px] text-white/40 font-mono">{{ p.id }}</span>
    </div>
  </div>
</template>
