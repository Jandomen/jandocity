<template>
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 110" class="w-[110px] h-[100px] overflow-visible">
        <ellipse cx="60" cy="100" rx="42" ry="8" fill="black" opacity="0.22"/>
        <rect x="14" y="24" width="92" height="68" rx="12" fill="#86efac" stroke="#4ade80" stroke-width="1"/>
        <rect x="18" y="28" width="84" height="60" rx="10" fill="#bbf7d0" opacity="0.9"/>
        <!-- árboles parque -->
        <circle cx="34" cy="42" r="12" fill="#22c55e" stroke="#15803d" stroke-width="0.8"/>
        <circle cx="34" cy="42" r="7" fill="#4ade80" opacity="0.7"/>
        <circle cx="84" cy="48" r="10" fill="#22c55e" stroke="#15803d" stroke-width="0.8"/>
        <!-- camino -->
        <path d="M18 72 Q60 68 102 72" stroke="#d6b48a" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
        <path d="M18 72 Q60 68 102 72" stroke="white" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
        <!-- bancos -->
        <rect x="42" y="78" width="14" height="4" rx="1" fill="#92400e"/>
        <rect x="64" y="78" width="14" height="4" rx="1" fill="#92400e"/>
        <!-- fuente centro -->
        <circle cx="60" cy="56" r="10" fill="#7dd3fc" stroke="#0369a1" stroke-width="0.8"/>
        <circle cx="60" cy="56" r="5" fill="white" opacity="0.7"/>
      </svg>
      <span class="text-xs font-semibold text-white">Parque pequeño</span>
      <span class="text-[10px] text-white/45">1 celda • fuente</span>
    </div>
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 110" class="w-[110px] h-[100px] overflow-visible">
        <ellipse cx="60" cy="100" rx="44" ry="9" fill="black" opacity="0.22"/>
        <rect x="12" y="22" width="96" height="72" rx="14" fill="#4ade80" stroke="#22c55e" stroke-width="1"/>
        <rect x="28" y="34" width="64" height="40" rx="8" fill="#dcfce7"/>
        <circle cx="32" cy="36" r="9" fill="#16a34a"/>
        <circle cx="88" cy="38" r="8" fill="#16a34a"/>
        <circle cx="36" cy="78" r="7" fill="#16a34a"/>
        <path d="M12 62 L108 62" stroke="#d6b48a" stroke-width="8" opacity="0.9"/>
        <rect x="52" y="62" width="16" height="16" rx="8" fill="#7dd3fc" stroke="#0284c7" stroke-width="0.8"/>
      </svg>
      <span class="text-xs font-semibold text-white">Parque mediano</span>
      <span class="text-[10px] text-white/45">2 celdas • caminos</span>
    </div>
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 110" class="w-[110px] h-[100px] overflow-visible">
        <ellipse cx="60" cy="100" rx="40" ry="8" fill="black" opacity="0.22"/>
        <rect x="20" y="30" width="80" height="60" rx="4" fill="#e7d6b8" stroke="#a8906a" stroke-width="1"/>
        <rect x="24" y="34" width="72" height="52" rx="3" fill="#f5f5f4"/>
        <line x1="60" y1="34" x2="60" y2="86" stroke="#d6b48a" stroke-width="5"/>
        <line x1="24" y1="60" x2="96" y2="60" stroke="#d6b48a" stroke-width="5"/>
        <!-- bancos plaza -->
        <rect x="30" y="38" width="12" height="3" rx="1" fill="#78350f"/>
        <rect x="78" y="70" width="12" height="3" rx="1" fill="#78350f"/>
        <circle cx="60" cy="60" r="6" fill="#38bdf8"/>
      </svg>
      <span class="text-xs font-semibold text-white">Plaza</span>
      <span class="text-[10px] text-white/45">1-2 celdas • peatonal</span>
    </div>
  </div>
</template>
