<template>
  <div class="grid grid-cols-3 gap-4">
    <!-- Casa pequeña — 1 celda, tejado 2 aguas -->
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 120" class="w-[110px] h-[110px] overflow-visible">
        <ellipse cx="60" cy="106" rx="44" ry="9" fill="black" opacity="0.32"/>
        <ellipse cx="60" cy="104" rx="32" ry="6" fill="black" opacity="0.18"/>
        <!-- césped base -->
        <rect x="12" y="72" width="96" height="28" rx="6" fill="#5a8a3a" stroke="#3d5f2a" stroke-width="0.8"/>
        <!-- paredes -->
        <rect x="28" y="52" width="64" height="30" rx="3" fill="#fef3c7" stroke="#b89a6a" stroke-width="1.2"/>
        <rect x="28" y="52" width="64" height="30" rx="3" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        <!-- puerta -->
        <rect x="54" y="66" width="12" height="16" rx="1.5" fill="#5a3a1a" stroke="#2a1a0a" stroke-width="0.8"/>
        <circle cx="63" cy="74" r="1.2" fill="#fde68a"/>
        <!-- ventanas -->
        <rect x="34" y="58" width="14" height="10" rx="1" fill="#dbeafe" stroke="#7aa0c8" stroke-width="0.8"/>
        <line x1="41" y1="58" x2="41" y2="68" stroke="#7aa0c8" stroke-width="0.6"/>
        <line x1="34" y1="63" x2="48" y2="63" stroke="#7aa0c8" stroke-width="0.6"/>
        <rect x="72" y="58" width="14" height="10" rx="1" fill="#dbeafe" stroke="#7aa0c8" stroke-width="0.8"/>
        <line x1="79" y1="58" x2="79" y2="68" stroke="#7aa0c8" stroke-width="0.6"/>
        <!-- tejado -->
        <path d="M22 52 L60 18 L98 52 Z" fill="#b45309" stroke="#78350f" stroke-width="1.3"/>
        <path d="M22 52 L60 18 L98 52 L94 52 L60 24 L26 52 Z" fill="#d97706"/>
        <path d="M60 18 L60 52" stroke="#78350f" stroke-width="0.9" opacity="0.5"/>
        <!-- chimenea -->
        <rect x="76" y="26" width="8" height="18" rx="1" fill="#57534e" stroke="#292524" stroke-width="0.7"/>
        <rect x="75" y="24" width="10" height="3" rx="1" fill="#44403c"/>
        <!-- luz tejado -->
        <path d="M36 42 L60 20 L72 30" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="text-xs font-semibold text-white">Casa pequeña</span>
      <span class="text-[10px] text-white/45">1 celda • 12 hab</span>
    </div>

    <!-- Casa mediana — L -->
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 120" class="w-[110px] h-[110px] overflow-visible">
        <ellipse cx="60" cy="108" rx="48" ry="10" fill="black" opacity="0.30"/>
        <rect x="10" y="70" width="100" height="30" rx="7" fill="#5a8a3a"/>
        <rect x="18" y="48" width="76" height="32" rx="3" fill="#fffbeb" stroke="#b89a6a" stroke-width="1.2"/>
        <rect x="18" y="48" width="36" height="32" rx="2" fill="#fef3c7"/>
        <rect x="54" y="58" width="26" height="14" rx="1" fill="#dbeafe" stroke="#7aa0c8" stroke-width="0.7"/>
        <rect x="84" y="58" width="10" height="14" rx="1" fill="#5a3a1a"/>
        <!-- tejados en L -->
        <path d="M14 48 L38 16 L62 48 Z" fill="#92400e" stroke="#78350f" stroke-width="1.2"/>
        <path d="M46 48 L70 18 L94 48 Z" fill="#b45309" stroke="#78350f" stroke-width="1.2"/>
        <rect x="40" y="20" width="8" height="16" rx="1" fill="#44403c"/>
      </svg>
      <span class="text-xs font-semibold text-white">Casa mediana</span>
      <span class="text-[10px] text-white/45">1-2 celdas • 18 hab</span>
    </div>

    <!-- Casa grande moderna -->
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 120" class="w-[110px] h-[110px] overflow-visible">
        <ellipse cx="60" cy="108" rx="46" ry="10" fill="black" opacity="0.28"/>
        <rect x="14" y="72" width="92" height="26" rx="6" fill="#6b8a4a"/>
        <rect x="22" y="42" width="76" height="36" rx="3" fill="#f8fafc" stroke="#9ab0c4" stroke-width="1.1"/>
        <rect x="22" y="42" width="76" height="8" rx="2" fill="#0f172a"/>
        <rect x="28" y="56" width="18" height="14" rx="1" fill="#0ea5e9" opacity="0.9" stroke="#0369a1" stroke-width="0.6"/>
        <rect x="50" y="56" width="18" height="14" rx="1" fill="#0ea5e9" opacity="0.9"/>
        <rect x="72" y="56" width="14" height="14" rx="1" fill="#5a3a1a"/>
        <rect x="26" y="78" width="20" height="4" rx="2" fill="#a8a29e"/>
      </svg>
      <span class="text-xs font-semibold text-white">Casa moderna</span>
      <span class="text-[10px] text-white/45">2 celdas • 24 hab</span>
    </div>

    <!-- Casa tradicional -->
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 120" class="w-[110px] h-[110px] overflow-visible">
        <ellipse cx="60" cy="106" rx="42" ry="9" fill="black" opacity="0.30"/>
        <rect x="16" y="74" width="88" height="22" rx="6" fill="#5a7a3a"/>
        <rect x="30" y="50" width="60" height="28" rx="2" fill="#fef3c7" stroke="#a08050" stroke-width="1"/>
        <path d="M24 50 L60 14 L96 50 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="1.2"/>
        <path d="M60 14 L60 50" stroke="#7f1d1d" stroke-width="0.8" opacity="0.6"/>
        <rect x="52" y="62" width="10" height="16" rx="1" fill="#422006"/>
        <rect x="36" y="58" width="10" height="8" rx="1" fill="#bfdbfe" stroke="#60a5fa" stroke-width="0.6"/>
        <rect x="74" y="58" width="10" height="8" rx="1" fill="#bfdbfe" stroke="#60a5fa" stroke-width="0.6"/>
      </svg>
      <span class="text-xs font-semibold text-white">Casa tradicional</span>
      <span class="text-[10px] text-white/45">1 celda • tejado rojo</span>
    </div>

    <!-- Edificio residencial pequeño 3 plantas -->
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 120" class="w-[110px] h-[110px] overflow-visible">
        <ellipse cx="60" cy="110" rx="44" ry="8" fill="black" opacity="0.30"/>
        <rect x="24" y="28" width="72" height="72" rx="3" fill="#f5f5f4" stroke="#a8a29e" stroke-width="1.1"/>
        <rect x="24" y="28" width="72" height="10" rx="2" fill="#44403c"/>
        <g v-for="row in [46,64,82]" :key="row">
          <rect :x="32" :y="row" width="14" height="10" rx="1" fill="#e0f2fe" stroke="#7aa0c8" stroke-width="0.6"/>
          <rect :x="52" :y="row" width="14" height="10" rx="1" fill="#e0f2fe" stroke="#7aa0c8" stroke-width="0.6"/>
          <rect :x="72" :y="row" width="14" height="10" rx="1" fill="#e0f2fe" stroke="#7aa0c8" stroke-width="0.6"/>
        </g>
        <rect x="52" y="92" width="16" height="8" rx="1" fill="#292524"/>
      </svg>
      <span class="text-xs font-semibold text-white">Bloque 3 plantas</span>
      <span class="text-[10px] text-white/45">2 celdas • 42 hab</span>
    </div>

    <!-- Chalet grande -->
    <div class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 120" class="w-[110px] h-[110px] overflow-visible">
        <ellipse cx="60" cy="108" rx="50" ry="11" fill="black" opacity="0.28"/>
        <rect x="10" y="68" width="100" height="32" rx="8" fill="#6a8a4a"/>
        <rect x="20" y="44" width="80" height="36" rx="3" fill="#fff7ed" stroke="#c4a882" stroke-width="1.1"/>
        <path d="M16 44 L60 10 L104 44 Z" fill="#57534e" stroke="#292524" stroke-width="1.2"/>
        <rect x="48" y="58" width="24" height="22" rx="1" fill="#44403c" opacity="0.9"/>
        <rect x="52" y="62" width="16" height="12" rx="1" fill="#fde68a" stroke="#92400e" stroke-width="0.6"/>
      </svg>
      <span class="text-xs font-semibold text-white">Chalet grande</span>
      <span class="text-[10px] text-white/45">2 celdas • premium</span>
    </div>
  </div>
</template>
