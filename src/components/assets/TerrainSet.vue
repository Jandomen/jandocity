<template>
  <div class="grid grid-cols-4 gap-3">
    <div v-for="t in [
      {id:'grass', label:'Pasto', bg:'#6bbf45'},
      {id:'dirt', label:'Tierra', bg:'#c2a878'},
      {id:'sand', label:'Arena', bg:'#e8dcc0'},
      {id:'forest', label:'Bosque', bg:'#2d5a32'},
      {id:'water', label:'Agua', bg:'#3b82f6'},
      {id:'water-grass', label:'Borde agua→pasto', bg:'#5aa5e0'},
      {id:'water-sand', label:'Borde agua→arena', bg:'#7ec8e8'},
      {id:'stones', label:'Piedras', bg:'#a8a29e'},
    ]" :key="t.id" class="bg-[#1a221a]/50 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
      <div class="w-[88px] h-[88px] rounded-lg overflow-hidden border border-white/10 relative flex items-center justify-center" :style="{background: t.bg}">
        <div v-if="t.id==='grass'" class="absolute inset-0 opacity-20" style="background: radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 8px 8px;"></div>
        <div v-if="t.id==='dirt'" class="absolute inset-0 opacity-30" style="background: radial-gradient(ellipse at 30% 30%, #8a6d4a 0%, transparent 60%);"></div>
        <div v-if="t.id==='water'" class="absolute inset-0 opacity-40" style="background: radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.35) 0%, transparent 50%);"></div>
        <div v-if="t.id.includes('water-')" class="absolute inset-0 flex">
          <div class="flex-1" style="background: #3b82f6;"></div>
          <div class="flex-1" :style="{background: t.id==='water-grass' ? '#6bbf45' : '#e8dcc0'}"></div>
        </div>
        <span class="relative text-[10px] font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded-full">{{ t.label }}</span>
      </div>
      <span class="text-[10px] font-mono text-white/50">{{ t.id }}</span>
    </div>
  </div>
</template>
