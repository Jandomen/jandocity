<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="f in [
      {name:'Fábrica pequeña', w:72, h:42, chim:1},
      {name:'Fábrica mediana', w:84, h:52, chim:2},
      {name:'Fábrica grande', w:96, h:60, chim:3},
      {name:'Almacén', w:80, h:36, chim:0},
      {name:'Central eléctrica', w:88, h:48, chim:2},
    ]" :key="f.name" class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 110" class="w-[110px] h-[100px] overflow-visible">
        <ellipse cx="60" cy="100" rx="44" ry="9" fill="black" opacity="0.30"/>
        <rect x="14" y="74" width="92" height="18" rx="3" fill="#57534e"/>
        <!-- nave -->
        <rect :x="60 - f.w/2" :y="68 - f.h/2" :width="f.w" :height="f.h" rx="3" fill="#a8a29e" stroke="#57534e" stroke-width="1.2"/>
        <rect :x="60 - f.w/2" :y="68 - f.h/2" :width="f.w" height="8" rx="2" fill="#44403c"/>
        <!-- ventanas industriales -->
        <g v-for="i in 3" :key="i">
          <rect :x="28 + i*16" :y="68 - f.h/2 + 12" width="10" height="10" rx="1" fill="#1e3a5f" stroke="#334155" stroke-width="0.6"/>
        </g>
        <!-- chimeneas -->
        <g v-for="c in f.chim" :key="c">
          <rect :x="26 + c*18" :y="28" width="10" height="28" rx="2" fill="#292524" stroke="#1c1917" stroke-width="0.8"/>
          <ellipse :cx="31 + c*18" cy="26" rx="8" ry="4" fill="#78716c" opacity="0.9"/>
          <g v-if="f.chim>0" opacity="0.45">
            <ellipse :cx="31 + c*18" :cy="18 - c*2" rx="10" ry="6" fill="white" />
            <ellipse :cx="34 + c*18" :cy="12 - c*2" rx="7" ry="4" fill="white" opacity="0.6"/>
          </g>
        </g>
        <!-- zona carga -->
        <rect x="42" y="86" width="36" height="6" rx="1" fill="#facc15" opacity="0.9"/>
        <rect x="48" y="92" width="14" height="4" rx="1" fill="#e7cc00"/>
      </svg>
      <span class="text-xs font-semibold text-white">{{ f.name }}</span>
      <span class="text-[10px] text-white/45">{{ f.w }}×{{ f.h }}px</span>
    </div>
  </div>
</template>
