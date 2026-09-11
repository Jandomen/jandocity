<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="shop in [
      {name:'Tienda pequeña', sub:'1 celda', color:'#fbbf24', accent:'#b45309'},
      {name:'Supermercado', sub:'2 celdas', color:'#60a5fa', accent:'#1e40af'},
      {name:'Restaurante', sub:'1 celda', color:'#f87171', accent:'#7f1d1d'},
      {name:'Cafetería', sub:'1 celda', color:'#a78bfa', accent:'#4c1d95'},
      {name:'Centro comercial', sub:'4 celdas', color:'#34d399', accent:'#064e3b'},
    ]" :key="shop.name" class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <svg viewBox="0 0 120 110" class="w-[110px] h-[100px] overflow-visible">
        <ellipse cx="60" cy="100" rx="42" ry="8" fill="black" opacity="0.28"/>
        <rect x="18" y="38" width="84" height="48" rx="4" :fill="shop.color" :stroke="shop.accent" stroke-width="1.2"/>
        <rect x="18" y="38" width="84" height="10" rx="2" :fill="shop.accent"/>
        <!-- toldo -->
        <path d="M18 48 L28 58 L38 48 L48 58 L58 48 L68 58 L78 48 L88 58 L98 48" fill="white" opacity="0.92" stroke="#e5e7eb" stroke-width="0.6"/>
        <rect x="32" y="58" width="20" height="16" rx="1" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.7"/>
        <rect x="60" y="58" width="28" height="16" rx="1" fill="#0f172a" opacity="0.85"/>
        <text x="60" y="68" text-anchor="middle" font-size="7" fill="white" font-weight="bold" opacity="0.9">{{ shop.name.slice(0,4).toUpperCase() }}</text>
        <!-- parking -->
        <rect x="26" y="90" width="68" height="6" rx="2" fill="#334155" opacity="0.9"/>
        <rect x="30" y="92" width="12" height="2" rx="1" fill="white" opacity="0.7"/>
        <rect x="46" y="92" width="12" height="2" rx="1" fill="white" opacity="0.7"/>
      </svg>
      <span class="text-xs font-semibold text-white">{{ shop.name }}</span>
      <span class="text-[10px] text-white/45">{{ shop.sub }}</span>
    </div>
  </div>
</template>
