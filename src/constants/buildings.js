/**
 * src/constants/buildings.js
 * Definición única de tipos de edificios. Fuente de verdad para toda la economía.
 * Si balanceamos el juego, solo tocamos este archivo.
 */
export const BUILDING_TYPES = {
  residential: {
    id: 'residential',
    label: 'Residencial',
    icon: '🏠',
    width: 1, height: 1,
    cost: 100,
    effects: { population: 12, energy: -3, water: -3, oxygen: -4 },
    incomePerTick: 6,
    color: 'bg-emerald-600',
    description: '+12 hab · -4 O₂ • 1×1'
  },
  commercial: {
    id: 'commercial',
    label: 'Comercial',
    icon: '🏢',
    width: 1, height: 1,
    cost: 150,
    effects: { population: 0, energy: -5, water: -2, oxygen: -6 },
    incomePerTick: 18,
    color: 'bg-blue-600',
    description: '+18💰/tick · -6 O₂'
  },
  shop: {
    id: 'shop',
    label: 'Tienda',
    icon: '🛒',
    width: 1, height: 1,
    cost: 110,
    effects: { population: 0, energy: -3, water: -1, oxygen: -3 },
    incomePerTick: 12,
    color: 'bg-sky-600',
    description: '+12💰/tick · 1×1'
  },
  supermarket: {
    id: 'supermarket',
    label: 'Supermercado',
    icon: '🛍️',
    width: 2, height: 2,
    cost: 280,
    effects: { population: 0, energy: -6, water: -3, oxygen: -5 },
    incomePerTick: 24,
    color: 'bg-blue-500',
    description: '+24💰/tick · 2×2'
  },
  mall: {
    id: 'mall',
    label: 'Centro comercial',
    icon: '🏬',
    width: 3, height: 2,
    cost: 480,
    effects: { population: 0, energy: -9, water: -5, oxygen: -8 },
    incomePerTick: 36,
    color: 'bg-indigo-600',
    description: '+36💰/tick · 3×2'
  },
  bank: {
    id: 'bank',
    label: 'Banco',
    icon: '🏦',
    width: 2, height: 1,
    cost: 320,
    effects: { population: 0, energy: -4, water: -2, oxygen: -3 },
    incomePerTick: 28,
    color: 'bg-yellow-700',
    description: '+28💰/tick · 2×1'
  },
  power: {
    id: 'power',
    label: 'Energía',
    icon: '⚡',
    width: 2, height: 2,
    cost: 300,
    effects: { population: 0, energy: 25, water: 0, oxygen: -10 },
    incomePerTick: -4,
    color: 'bg-amber-500',
    description: '+25⚡ · -10 O₂ • 2×2'
  },
  waterPlant: {
    id: 'waterPlant',
    label: 'Planta Agua',
    icon: '🏭',
    width: 2, height: 2,
    cost: 250,
    effects: { population: 0, energy: -2, water: 25, oxygen: 0 },
    incomePerTick: -3,
    color: 'bg-cyan-700',
    description: '+25💧 • 2×2'
  },
  road: {
    id: 'road',
    label: 'Carretera',
    icon: '🛣️',
    width: 1, height: 1,
    cost: 15,
    effects: { population: 0, energy: 0, water: 0 },
    incomePerTick: 0,
    color: 'bg-zinc-600',
    description: 'Asfalto • 1×1'
  },
  dirt_road: {
    id: 'dirt_road',
    label: 'Terracería',
    icon: '🟫',
    width: 1, height: 1,
    cost: 8,
    effects: { population: 0, energy: 0, water: 0 },
    incomePerTick: 0,
    color: 'bg-amber-800',
    description: 'Terracería barata • 1×1'
  },
  concrete_road: {
    id: 'concrete_road',
    label: 'Concreto',
    icon: '⬜',
    width: 1, height: 1,
    cost: 22,
    effects: { population: 0, energy: 0, water: 0 },
    incomePerTick: 0,
    color: 'bg-stone-300',
    description: 'Concreto resistente • 1×1'
  },
  cobble_road: {
    id: 'cobble_road',
    label: 'Empedrado',
    icon: '🪨',
    width: 1, height: 1,
    cost: 18,
    effects: { population: 0, energy: 0, water: 0 },
    incomePerTick: 0,
    color: 'bg-stone-500',
    description: 'Empedrado colonial • 1×1'
  },
  tree: {
    id: 'tree',
    label: 'Árbol',
    icon: '🌳',
    width: 1, height: 1,
    cost: 12,
    effects: { population: 0, energy: 0, water: -1, oxygen: 6 },
    incomePerTick: 0,
    color: 'bg-green-700',
    description: '+6 O₂ • 1×1'
  },
  oak: {
    id: 'oak',
    label: 'Roble',
    icon: '🌲',
    width: 1, height: 1,
    cost: 18,
    effects: { population: 0, energy: 0, water: -1, oxygen: 9 },
    incomePerTick: 0,
    color: 'bg-green-800',
    description: '+9 O₂ — Roble'
  },
  pine: {
    id: 'pine',
    label: 'Pino',
    icon: '🌲',
    width: 1, height: 1,
    cost: 22,
    effects: { population: 0, energy: 0, water: -1, oxygen: 12 },
    incomePerTick: 1,
    color: 'bg-emerald-900',
    description: '+12 O₂ — Pino alto'
  },
  palm: {
    id: 'palm',
    label: 'Palma',
    icon: '🌴',
    width: 1, height: 1,
    cost: 14,
    effects: { population: 0, energy: 0, water: -1, oxygen: 5 },
    incomePerTick: 0,
    color: 'bg-lime-700',
    description: '+5 O₂ — Palma'
  },
  ceiba: {
    id: 'ceiba',
    label: 'Ceiba',
    icon: '🌳',
    width: 2, height: 2,
    cost: 48,
    effects: { population: 0, energy: 0, water: -2, oxygen: 22 },
    incomePerTick: 2,
    color: 'bg-green-800',
    description: '+22 O₂ — Ceiba 2×2'
  },
  bush: {
    id: 'bush',
    label: 'Arbusto',
    icon: '🌿',
    width: 1, height: 1,
    cost: 6,
    effects: { population: 0, energy: 0, water: 0, oxygen: 2 },
    incomePerTick: 0,
    color: 'bg-green-600',
    description: '+2 O₂ • 1×1'
  },
  flower: {
    id: 'flower',
    label: 'Flores',
    icon: '🌸',
    width: 1, height: 1,
    cost: 4,
    effects: { population: 0, energy: 0, water: 0, oxygen: 1 },
    incomePerTick: 0,
    color: 'bg-pink-500',
    description: '+1 O₂ • 1×1'
  },
  rock: {
    id: 'rock',
    label: 'Roca',
    icon: '🪨',
    width: 1, height: 1,
    cost: 3,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 0,
    color: 'bg-stone-500',
    description: '1×1'
  },
  park: {
    id: 'park',
    label: 'Parque',
    icon: '🌳',
    width: 2, height: 2,
    cost: 40,
    effects: { population: 2, energy: 0, water: -1, oxygen: 10 },
    incomePerTick: 2,
    color: 'bg-emerald-500',
    description: '+10 O₂ · +2 hab • 2×2'
  },
  residential_small: {
    id: 'residential_small',
    label: 'Casa pequeña',
    icon: '🏠',
    width: 1, height: 1,
    cost: 80,
    effects: { population: 8, energy: -2, water: -2, oxygen: -3 },
    incomePerTick: 4,
    color: 'bg-emerald-600',
    description: 'Pequeña 8 hab · -3 O₂'
  },
  residential_medium: {
    id: 'residential_medium',
    label: 'Casa mediana',
    icon: '🏡',
    width: 1, height: 1,
    cost: 120,
    effects: { population: 14, energy: -3, water: -3, oxygen: -5 },
    incomePerTick: 7,
    color: 'bg-emerald-600',
    description: 'Mediana 14 hab · -5 O₂'
  },
  residential_large: {
    id: 'residential_large',
    label: 'Casa grande',
    icon: '🏘️',
    width: 2, height: 2,
    cost: 220,
    effects: { population: 28, energy: -6, water: -6, oxygen: -9 },
    incomePerTick: 14,
    color: 'bg-emerald-700',
    description: 'Grande 28 hab · -9 O₂ • 2×2'
  },
  airport: {
    id: 'airport',
    label: 'Aeropuerto',
    icon: '✈️',
    width: 4, height: 3,
    cost: 800,
    effects: { population: 0, energy: -12, water: -5, oxygen: -18 },
    incomePerTick: 45,
    color: 'bg-sky-700',
    description: '+45💰 · -18 O₂ • 4×3'
  },
  stadium: {
    id: 'stadium',
    label: 'Estadio',
    icon: '🏟️',
    width: 3, height: 3,
    cost: 600,
    effects: { population: 8, energy: -8, water: -4, oxygen: -8 },
    incomePerTick: 28,
    color: 'bg-violet-600',
    description: '+8 hab · -8 O₂ • 3×3'
  },
  // === MEGA — 6 grandes ===
  city_hall: {
    id: 'city_hall',
    label: 'Ayuntamiento',
    icon: '🏛️',
    width: 3, height: 3,
    cost: 900,
    effects: { population: 6, energy: -6, water: -4, oxygen: -5 },
    incomePerTick: 20,
    color: 'bg-stone-300',
    description: '3×3 · +6 hab · cívico'
  },
  museum: {
    id: 'museum',
    label: 'Museo',
    icon: '🖼️',
    width: 3, height: 3,
    cost: 700,
    effects: { population: 0, energy: -5, water: -3, oxygen: 0 },
    incomePerTick: 16,
    color: 'bg-amber-100',
    description: '3×3 · +16💰'
  },
  port: {
    id: 'port',
    label: 'Puerto',
    icon: '⚓',
    width: 5, height: 2,
    cost: 850,
    effects: { population: 0, energy: -8, water: -6, oxygen: -4 },
    incomePerTick: 30,
    color: 'bg-slate-600',
    description: '5×2 · +30💰'
  },
  solar_farm: {
    id: 'solar_farm',
    label: 'Solar farm',
    icon: '☀️',
    width: 3, height: 3,
    cost: 620,
    effects: { population: 0, energy: 32, water: 0, oxygen: 6 },
    incomePerTick: -5,
    color: 'bg-yellow-200',
    description: '3×3 · +32⚡ +6 O₂'
  },
  financial_district: {
    id: 'financial_district',
    label: 'Distrito financiero',
    icon: '🏙️',
    width: 4, height: 4,
    cost: 1500,
    effects: { population: 60, energy: -16, water: -10, oxygen: -18 },
    incomePerTick: 52,
    color: 'bg-zinc-800',
    description: '4×4 · +60 hab'
  },
  opera: {
    id: 'opera',
    label: 'Ópera',
    icon: '🎭',
    width: 3, height: 3,
    cost: 800,
    effects: { population: 0, energy: -6, water: -3, oxygen: -2 },
    incomePerTick: 22,
    color: 'bg-rose-200',
    description: '3×3 · +22💰'
  },
  olympic_stadium: {
    id: 'olympic_stadium',
    label: 'Estadio olímpico',
    icon: '🏟️',
    width: 5, height: 5,
    cost: 2200,
    effects: { population: 20, energy: -16, water: -10, oxygen: -14 },
    incomePerTick: 55,
    color: 'bg-violet-700',
    description: '5×5 · +20 hab · olímpico'
  },
  nuclear_plant: {
    id: 'nuclear_plant',
    label: 'Central nuclear',
    icon: '☢️',
    width: 4, height: 4,
    cost: 1800,
    effects: { population: 0, energy: 55, water: -6, oxygen: -18 },
    incomePerTick: -12,
    color: 'bg-yellow-600',
    description: '4×4 · +55⚡'
  },
  intl_airport: {
    id: 'intl_airport',
    label: 'Aeropuerto intl.',
    icon: '✈️',
    width: 5, height: 3,
    cost: 1600,
    effects: { population: 0, energy: -18, water: -8, oxygen: -22 },
    incomePerTick: 62,
    color: 'bg-sky-800',
    description: '5×3 · +62💰'
  },
  // === Servicios — Hoteles / Restaurantes / Universidad ===
  hotel: {
    id: 'hotel',
    label: 'Hotel',
    icon: '🏨',
    width: 2, height: 2,
    cost: 320,
    effects: { population: 18, energy: -6, water: -4, oxygen: -7 },
    incomePerTick: 22,
    color: 'bg-indigo-600',
    description: '2×2 · +18 hab · -7 O₂'
  },
  hotel_large: {
    id: 'hotel_large',
    label: 'Hotel grande',
    icon: '🏨',
    width: 3, height: 2,
    cost: 520,
    effects: { population: 32, energy: -8, water: -6, oxygen: -11 },
    incomePerTick: 34,
    color: 'bg-indigo-700',
    description: '3×2 · +32 hab'
  },
  restaurant: {
    id: 'restaurant',
    label: 'Restaurante',
    icon: '🍽️',
    width: 2, height: 1,
    cost: 140,
    effects: { population: 0, energy: -4, water: -3, oxygen: -4 },
    incomePerTick: 16,
    color: 'bg-orange-600',
    description: '2×1 · +16💰/tick'
  },
  restaurant_small: {
    id: 'restaurant_small',
    label: 'Cafetería',
    icon: '☕',
    width: 1, height: 1,
    cost: 90,
    effects: { population: 0, energy: -2, water: -1, oxygen: -2 },
    incomePerTick: 9,
    color: 'bg-orange-500',
    description: '1×1 · +9💰'
  },
  university: {
    id: 'university',
    label: 'Universidad',
    icon: '🎓',
    width: 3, height: 3,
    cost: 750,
    effects: { population: 12, energy: -10, water: -6, oxygen: -10 },
    incomePerTick: -12,
    color: 'bg-teal-700',
    description: '3×3 · subsidio -12💰/t +12 hab'
  },
  school: {
    id: 'school',
    label: 'Escuela',
    icon: '🏫',
    width: 2, height: 2,
    cost: 380,
    effects: { population: 6, energy: -5, water: -3, oxygen: -5 },
    incomePerTick: -7,
    color: 'bg-teal-600',
    description: '2×2 · subsidio -7💰/t'
  },
  // === Altura — 2 cuadros de altura (1×2 / 2×2 vertical) ===
  tower_residential: {
    id: 'tower_residential',
    label: 'Torre viviendas',
    icon: '🏢',
    width: 1, height: 2,
    cost: 260,
    effects: { population: 26, energy: -7, water: -5, oxygen: -8 },
    incomePerTick: 16,
    color: 'bg-slate-600',
    description: '1×2 · +26 hab · 2 alt'
  },
  tower_commercial: {
    id: 'tower_commercial',
    label: 'Torre oficinas',
    icon: '🏢',
    width: 1, height: 2,
    cost: 340,
    effects: { population: 0, energy: -8, water: -4, oxygen: -9 },
    incomePerTick: 26,
    color: 'bg-blue-700',
    description: '1×2 · +26💰'
  },
  apartment_block: {
    id: 'apartment_block',
    label: 'Bloque 2×2',
    icon: '🏢',
    width: 2, height: 2,
    cost: 420,
    effects: { population: 36, energy: -9, water: -7, oxygen: -12 },
    incomePerTick: 24,
    color: 'bg-slate-700',
    description: '2×2 · +36 hab · 2 alt'
  },
  skyscraper: {
    id: 'skyscraper',
    label: 'Rascacielos',
    icon: '🌃',
    width: 2, height: 2,
    cost: 680,
    effects: { population: 48, energy: -14, water: -9, oxygen: -16 },
    incomePerTick: 38,
    color: 'bg-zinc-800',
    description: '2×2 · +48 hab · torre'
  },
  // === Seguridad / Salud / Justicia — subsidios (coste por tick) ===
  police_station: {
    id: 'police_station',
    label: 'Comisaría',
    icon: '🚔',
    width: 2, height: 2,
    cost: 380,
    effects: { population: 0, energy: -5, water: -3, oxygen: -4 },
    incomePerTick: -9,
    color: 'bg-blue-800',
    description: '2×2 · subsidio -9💰/t'
  },
  fire_station: {
    id: 'fire_station',
    label: 'Bomberos',
    icon: '🚒',
    width: 2, height: 2,
    cost: 340,
    effects: { population: 0, energy: -4, water: -6, oxygen: -3 },
    incomePerTick: -8,
    color: 'bg-red-700',
    description: '2×2 · subsidio -8💰/t'
  },
  hospital: {
    id: 'hospital',
    label: 'Hospital',
    icon: '🏥',
    width: 3, height: 2,
    cost: 620,
    effects: { population: 0, energy: -10, water: -7, oxygen: -8 },
    incomePerTick: -14,
    color: 'bg-rose-600',
    description: '3×2 · subsidio -14💰/t'
  },
  gym: {
    id: 'gym',
    label: 'Gimnasio',
    icon: '🏋️',
    width: 2, height: 2,
    cost: 260,
    effects: { population: 0, energy: -5, water: -4, oxygen: -3 },
    incomePerTick: 6,
    color: 'bg-orange-700',
    description: '2×2 · +6💰/t (privado)'
  },
  courthouse: {
    id: 'courthouse',
    label: 'Juzgado',
    icon: '⚖️',
    width: 2, height: 2,
    cost: 480,
    effects: { population: 0, energy: -6, water: -3, oxygen: -4 },
    incomePerTick: -10,
    color: 'bg-stone-700',
    description: '2×2 · subsidio -10💰/t'
  },
  prison: {
    id: 'prison',
    label: 'Cárcel',
    icon: '🔒',
    width: 3, height: 3,
    cost: 700,
    effects: { population: 0, energy: -9, water: -5, oxygen: -9 },
    incomePerTick: -12,
    color: 'bg-zinc-900',
    description: '3×3 · subsidio -12💰/t'
  },
  // === Monumentos mundiales con banderas reales ===
  eiffel: {
    id: 'eiffel',
    label: 'Torre Eiffel',
    icon: '🗼',
    width: 2, height: 2,
    cost: 900,
    effects: { population: 0, energy: -4, water: -2, oxygen: -2 },
    incomePerTick: 28,
    color: 'bg-slate-600',
    description: '2×2 · 🇫🇷 Francia'
  },
  liberty: {
    id: 'liberty',
    label: 'Estatua Libertad',
    icon: '🗽',
    width: 2, height: 2,
    cost: 950,
    effects: { population: 0, energy: -4, water: -2, oxygen: 0 },
    incomePerTick: 30,
    color: 'bg-teal-700',
    description: '2×2 · 🇺🇸 USA'
  },
  big_ben: {
    id: 'big_ben',
    label: 'Big Ben',
    icon: '🕰️',
    width: 1, height: 3,
    cost: 600,
    effects: { population: 0, energy: -3, water: -1, oxygen: -2 },
    incomePerTick: 18,
    color: 'bg-amber-800',
    description: '1×3 · 🇬🇧 UK'
  },
  christ_rio: {
    id: 'christ_rio',
    label: 'Cristo Redentor',
    icon: '⛪',
    width: 2, height: 2,
    cost: 700,
    effects: { population: 0, energy: -3, water: -2, oxygen: 2 },
    incomePerTick: 20,
    color: 'bg-stone-300',
    description: '2×2 · 🇧🇷 Brasil'
  },
  colosseum: {
    id: 'colosseum',
    label: 'Coliseo',
    icon: '🏟️',
    width: 3, height: 3,
    cost: 1100,
    effects: { population: 0, energy: -6, water: -4, oxygen: -4 },
    incomePerTick: 26,
    color: 'bg-amber-700',
    description: '3×3 · 🇮🇹 Italia'
  },
  taj_mahal: {
    id: 'taj_mahal',
    label: 'Taj Mahal',
    icon: '🕌',
    width: 3, height: 3,
    cost: 1200,
    effects: { population: 0, energy: -5, water: -3, oxygen: 0 },
    incomePerTick: 28,
    color: 'bg-stone-100',
    description: '3×3 · 🇮🇳 India'
  },
  great_wall: {
    id: 'great_wall',
    label: 'Muralla China',
    icon: '🧱',
    width: 4, height: 1,
    cost: 800,
    effects: { population: 0, energy: -4, water: -2, oxygen: 0 },
    incomePerTick: 22,
    color: 'bg-stone-600',
    description: '4×1 · 🇨🇳 China'
  },
  pyramid: {
    id: 'pyramid',
    label: 'Pirámide',
    icon: '🔺',
    width: 3, height: 3,
    cost: 1000,
    effects: { population: 0, energy: -4, water: -2, oxygen: -2 },
    incomePerTick: 24,
    color: 'bg-yellow-600',
    description: '3×3 · 🇪🇬 Egipto'
  },
  // LatAm
  chichen: {
    id: 'chichen',
    label: 'Chichén Itzá',
    icon: '🏛️',
    width: 3, height: 3,
    cost: 1100,
    effects: { population: 0, energy: -4, water: -2, oxygen: 0 },
    incomePerTick: 26,
    color: 'bg-amber-700',
    description: '3×3 · 🇲🇽 México'
  },
  monserrate: {
    id: 'monserrate',
    label: 'Monserrate',
    icon: '⛪',
    width: 2, height: 2,
    cost: 500,
    effects: { population: 0, energy: -3, water: -2, oxygen: 2 },
    incomePerTick: 14,
    color: 'bg-stone-300',
    description: '2×2 · 🇨🇴 Colombia'
  },
  machu: {
    id: 'machu',
    label: 'Machu Picchu',
    icon: '🏔️',
    width: 3, height: 2,
    cost: 900,
    effects: { population: 0, energy: -4, water: -3, oxygen: 4 },
    incomePerTick: 24,
    color: 'bg-stone-500',
    description: '3×2 · 🇵🇪 Perú'
  },
  obelisco_ar: {
    id: 'obelisco_ar',
    label: 'Obelisco BA',
    icon: '🗼',
    width: 1, height: 2,
    cost: 400,
    effects: { population: 0, energy: -2, water: 0, oxygen: 0 },
    incomePerTick: 12,
    color: 'bg-stone-200',
    description: '1×2 · 🇦🇷 Argentina'
  },
  // Asia
  torii: {
    id: 'torii',
    label: 'Torii',
    icon: '⛩️',
    width: 2, height: 1,
    cost: 320,
    effects: { population: 0, energy: -2, water: 0, oxygen: 2 },
    incomePerTick: 12,
    color: 'bg-red-700',
    description: '2×1 · 🇯🇵 Japón'
  },
  palace_kr: {
    id: 'palace_kr',
    label: 'Palacio Gyeongbok',
    icon: '🏯',
    width: 3, height: 2,
    cost: 750,
    effects: { population: 0, energy: -4, water: -2, oxygen: 0 },
    incomePerTick: 18,
    color: 'bg-teal-800',
    description: '3×2 · 🇰🇷 Corea'
  },
  wat_thai: {
    id: 'wat_thai',
    label: 'Wat Arun',
    icon: '🛕',
    width: 2, height: 2,
    cost: 600,
    effects: { population: 0, energy: -3, water: -2, oxygen: 2 },
    incomePerTick: 16,
    color: 'bg-amber-600',
    description: '2×2 · 🇹🇭 Tailandia'
  },
  // Africa
  table_za: {
    id: 'table_za',
    label: 'Table Mountain',
    icon: '⛰️',
    width: 3, height: 2,
    cost: 650,
    effects: { population: 0, energy: -3, water: -2, oxygen: 6 },
    incomePerTick: 15,
    color: 'bg-stone-600',
    description: '3×2 · 🇿🇦 Sudáfrica'
  },
  hassan_ma: {
    id: 'hassan_ma',
    label: 'Hassan Tower',
    icon: '🕌',
    width: 1, height: 3,
    cost: 500,
    effects: { population: 0, energy: -3, water: -1, oxygen: 0 },
    incomePerTick: 14,
    color: 'bg-amber-900',
    description: '1×3 · 🇲🇦 Marruecos'
  },
  // Europa extra
  gate_de: {
    id: 'gate_de',
    label: 'Puerta Brandenburgo',
    icon: '🏛️',
    width: 3, height: 2,
    cost: 750,
    effects: { population: 0, energy: -4, water: -2, oxygen: 0 },
    incomePerTick: 18,
    color: 'bg-stone-300',
    description: '3×2 · 🇩🇪 Alemania'
  },
  sagrada_es: {
    id: 'sagrada_es',
    label: 'Sagrada Familia',
    icon: '⛪',
    width: 3, height: 3,
    cost: 1000,
    effects: { population: 0, energy: -5, water: -3, oxygen: -2 },
    incomePerTick: 22,
    color: 'bg-stone-200',
    description: '3×3 · 🇪🇸 España'
  },
  parthenon_gr: {
    id: 'parthenon_gr',
    label: 'Partenón',
    icon: '🏛️',
    width: 3, height: 2,
    cost: 800,
    effects: { population: 0, energy: -4, water: -2, oxygen: 2 },
    incomePerTick: 20,
    color: 'bg-stone-100',
    description: '3×2 · 🇬🇷 Grecia'
  },
  // === Monumentos / Cultura / Castillos ===
  church: {
    id: 'church',
    label: 'Iglesia',
    icon: '⛪',
    width: 2, height: 2,
    cost: 280,
    effects: { population: 4, energy: -2, water: -2, oxygen: -2 },
    incomePerTick: 8,
    color: 'bg-stone-200',
    description: '2×2 · +4 hab'
  },
  cathedral: {
    id: 'cathedral',
    label: 'Catedral',
    icon: '⛪',
    width: 3, height: 2,
    cost: 650,
    effects: { population: 8, energy: -5, water: -4, oxygen: -5 },
    incomePerTick: 18,
    color: 'bg-stone-300',
    description: '3×2 · +8 hab'
  },
  castle: {
    id: 'castle',
    label: 'Castillo',
    icon: '🏰',
    width: 4, height: 4,
    cost: 1400,
    effects: { population: 12, energy: -12, water: -8, oxygen: -10 },
    incomePerTick: 32,
    color: 'bg-stone-500',
    description: '4×4 · +12 hab · fortaleza'
  },
  monument: {
    id: 'monument',
    label: 'Monumento',
    icon: '🗽',
    width: 1, height: 1,
    cost: 180,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 7,
    color: 'bg-yellow-700',
    description: '1×1 · +7💰 turismo'
  },
  obelisk: {
    id: 'obelisk',
    label: 'Obelisco',
    icon: '🗼',
    width: 1, height: 1,
    cost: 200,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 8,
    color: 'bg-stone-500',
    description: '1×1 · +8💰'
  },
  arch: {
    id: 'arch',
    label: 'Arco',
    icon: '⛩️',
    width: 2, height: 1,
    cost: 260,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 10,
    color: 'bg-stone-400',
    description: '2×1 · +10💰'
  },
  memorial: {
    id: 'memorial',
    label: 'Memorial',
    icon: '🪦',
    width: 2, height: 2,
    cost: 320,
    effects: { population: 0, energy: 0, water: 0, oxygen: 2 },
    incomePerTick: 9,
    color: 'bg-slate-600',
    description: '2×2 · +2 O₂'
  },
  fountain: {
    id: 'fountain',
    label: 'Fuente',
    icon: '⛲',
    width: 2, height: 2,
    cost: 240,
    effects: { population: 0, energy: 0, water: -2, oxygen: 4 },
    incomePerTick: 8,
    color: 'bg-sky-300',
    description: '2×2 · +4 O₂'
  },
  lighthouse: {
    id: 'lighthouse',
    label: 'Faro',
    icon: '🗼',
    width: 1, height: 2,
    cost: 220,
    effects: { population: 0, energy: -3, water: 0, oxygen: 0 },
    incomePerTick: 9,
    color: 'bg-slate-200',
    description: '1×2 · guía'
  },
  // === Banderas ondeando (1×1 asta) ===
  flag_mx: { id: 'flag_mx', label: 'Bandera MX', icon: '🇲🇽', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-green-600', description: '🇲🇽 ondeando' },
  flag_co: { id: 'flag_co', label: 'Bandera CO', icon: '🇨🇴', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-yellow-500', description: '🇨🇴 ondeando' },
  flag_br: { id: 'flag_br', label: 'Bandera BR', icon: '🇧🇷', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-green-500', description: '🇧🇷 ondeando' },
  flag_us: { id: 'flag_us', label: 'Bandera US', icon: '🇺🇸', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-blue-700', description: '🇺🇸 ondeando' },
  flag_fr: { id: 'flag_fr', label: 'Bandera FR', icon: '🇫🇷', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-blue-600', description: '🇫🇷 ondeando' },
  flag_de: { id: 'flag_de', label: 'Bandera DE', icon: '🇩🇪', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-zinc-800', description: '🇩🇪 ondeando' },
  flag_es: { id: 'flag_es', label: 'Bandera ES', icon: '🇪🇸', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-red-600', description: '🇪🇸 ondeando' },
  flag_it: { id: 'flag_it', label: 'Bandera IT', icon: '🇮🇹', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-green-600', description: '🇮🇹 ondeando' },
  flag_jp: { id: 'flag_jp', label: 'Bandera JP', icon: '🇯🇵', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-white', description: '🇯🇵 ondeando' },
  flag_kr: { id: 'flag_kr', label: 'Bandera KR', icon: '🇰🇷', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-slate-100', description: '🇰🇷 ondeando' },
  flag_gb: { id: 'flag_gb', label: 'Bandera GB', icon: '🇬🇧', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-blue-800', description: '🇬🇧 ondeando' },
  flag_peru: { id: 'flag_peru', label: 'Bandera PE', icon: '🇵🇪', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-red-600', description: '🇵🇪 ondeando' },
  flag_ar: { id: 'flag_ar', label: 'Bandera AR', icon: '🇦🇷', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-sky-400', description: '🇦🇷 ondeando' },
  flag_cl: { id: 'flag_cl', label: 'Bandera CL', icon: '🇨🇱', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-red-600', description: '🇨🇱 ondeando' },
  flag_ve: { id: 'flag_ve', label: 'Bandera VE', icon: '🇻🇪', width: 1, height: 1, cost: 12, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 1, color: 'bg-yellow-500', description: '🇻🇪 ondeando' },
  // === Vehículos 1×1 — al colocar sobre carretera empiezan a circular solos ===
  car: { id: 'car', label: 'Coche', icon: '🚗', width: 1, height: 1, cost: 25, effects: { population: 0, energy: 0, water: 0, oxygen: -1 }, incomePerTick: 0, color: 'bg-blue-600', description: '1×1 · circula solo' },
  pickup: { id: 'pickup', label: 'Camioneta', icon: '🛻', width: 1, height: 1, cost: 35, effects: { population: 0, energy: 0, water: 0, oxygen: -1 }, incomePerTick: 0, color: 'bg-red-700', description: '1×1 · pickup' },
  moto: { id: 'moto', label: 'Moto', icon: '🏍️', width: 1, height: 1, cost: 18, effects: { population: 0, energy: 0, water: 0, oxygen: -1 }, incomePerTick: 0, color: 'bg-zinc-700', description: '1×1 · moto' },
  trailer: { id: 'trailer', label: 'Trailer', icon: '🚛', width: 1, height: 1, cost: 45, effects: { population: 0, energy: 0, water: 0, oxygen: -2 }, incomePerTick: 0, color: 'bg-amber-800', description: '1×1 · trailer' },
  bus: { id: 'bus', label: 'Bus', icon: '🚌', width: 1, height: 1, cost: 40, effects: { population: 0, energy: 0, water: 0, oxygen: -1 }, incomePerTick: 0, color: 'bg-yellow-600', description: '1×1 · bus' },
  rail: { id: 'rail', label: 'Riel', icon: '🛤️', width: 1, height: 1, cost: 18, effects: { population: 0, energy: 0, water: 0, oxygen: 0 }, incomePerTick: 0, color: 'bg-stone-700', description: 'Vía férrea · con curvas' },
  train: { id: 'train', label: 'Tren', icon: '🚂', width: 1, height: 1, cost: 50, effects: { population: 0, energy: 0, water: 0, oxygen: -2 }, incomePerTick: 0, color: 'bg-zinc-800', description: '1×1 · sobre rieles' },
  // === Infra extra ===
  dam: {
    id: 'dam',
    label: 'Presa',
    icon: '🌊',
    width: 3, height: 1,
    cost: 500,
    effects: { population: 0, energy: 14, water: 12, oxygen: 0 },
    incomePerTick: -6,
    color: 'bg-slate-600',
    description: '3×1 · +14⚡ +12💧'
  },
  wind_turbine: {
    id: 'wind_turbine',
    label: 'Eólica',
    icon: '🌬️',
    width: 1, height: 1,
    cost: 180,
    effects: { population: 0, energy: 8, water: 0, oxygen: 2 },
    incomePerTick: -2,
    color: 'bg-sky-200',
    description: '1×1 · +8⚡ +2 O₂'
  },
  bus_terminal: {
    id: 'bus_terminal',
    label: 'Terminal buses',
    icon: '🚌',
    width: 3, height: 2,
    cost: 380,
    effects: { population: 0, energy: -4, water: -2, oxygen: -4 },
    incomePerTick: 14,
    color: 'bg-yellow-600',
    description: '3×2 · spawnea buses en pavimento'
  },
  car_dealership: {
    id: 'car_dealership',
    label: 'Concesionaria autos',
    icon: '🏎️',
    width: 2, height: 2,
    cost: 320,
    effects: { population: 0, energy: -3, water: -1, oxygen: -3 },
    incomePerTick: 18,
    color: 'bg-sky-700',
    description: '2×2 · spawnea autos'
  },
  moto_dealership: {
    id: 'moto_dealership',
    label: 'Concesionaria motos',
    icon: '🏍️',
    width: 2, height: 2,
    cost: 260,
    effects: { population: 0, energy: -2, water: -1, oxygen: -2 },
    incomePerTick: 12,
    color: 'bg-zinc-800',
    description: '2×2 · ciudadano en moto'
  },
  military_academy: {
    id: 'military_academy',
    label: 'Colegio Militar',
    icon: '🪖',
    width: 3, height: 3,
    cost: 680,
    effects: { population: 8, energy: -8, water: -5, oxygen: -6 },
    incomePerTick: -10,
    color: 'bg-green-900',
    description: '3×3 · spawnea soldados y vehículos ejército'
  },
  factory: {
    id: 'factory',
    label: 'Fábrica',
    icon: '🏭',
    width: 3, height: 2,
    cost: 420,
    effects: { population: 0, energy: -8, water: -4, oxygen: -10 },
    incomePerTick: 22,
    color: 'bg-zinc-700',
    description: '3×2 · +22💰 · -10 O₂'
  },
  warehouse: {
    id: 'warehouse',
    label: 'Almacén',
    icon: '🏚️',
    width: 2, height: 2,
    cost: 260,
    effects: { population: 0, energy: -4, water: -2, oxygen: -2 },
    incomePerTick: 12,
    color: 'bg-stone-600',
    description: '2×2 · logística'
  },
  telecom_tower: {
    id: 'telecom_tower',
    label: 'Antena telecom',
    icon: '📡',
    width: 1, height: 1,
    cost: 220,
    effects: { population: 0, energy: -3, water: 0, oxygen: 0 },
    incomePerTick: 8,
    color: 'bg-sky-800',
    description: '1×1 · conectividad'
  },
  data_center: {
    id: 'data_center',
    label: 'Data center',
    icon: '💾',
    width: 2, height: 2,
    cost: 520,
    effects: { population: 0, energy: -14, water: -4, oxygen: -6 },
    incomePerTick: 20,
    color: 'bg-slate-800',
    description: '2×2 · -14⚡'
  },
  sewage_plant: {
    id: 'sewage_plant',
    label: 'Depuradora',
    icon: '🚿',
    width: 2, height: 2,
    cost: 380,
    effects: { population: 0, energy: -5, water: 18, oxygen: -4 },
    incomePerTick: -6,
    color: 'bg-cyan-800',
    description: '2×2 · +18💧'
  },
  recycling_plant: {
    id: 'recycling_plant',
    label: 'Reciclaje',
    icon: '♻️',
    width: 2, height: 2,
    cost: 340,
    effects: { population: 0, energy: -4, water: -3, oxygen: 6 },
    incomePerTick: 6,
    color: 'bg-green-800',
    description: '2×2 · +6 O₂'
  },
  library: {
    id: 'library',
    label: 'Biblioteca',
    icon: '📚',
    width: 3, height: 2,
    cost: 480,
    effects: { population: 0, energy: -4, water: -2, oxygen: 0 },
    incomePerTick: 10,
    color: 'bg-amber-800',
    description: '3×2 · cultura'
  },
  convention_center: {
    id: 'convention_center',
    label: 'Centro convenciones',
    icon: '🏢',
    width: 4, height: 3,
    cost: 950,
    effects: { population: 0, energy: -10, water: -6, oxygen: -6 },
    incomePerTick: 32,
    color: 'bg-violet-800',
    description: '4×3 · +32💰'
  },
  fence: {
    id: 'fence',
    label: 'Valla',
    icon: '🪵',
    width: 1, height: 1,
    cost: 8,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 0,
    color: 'bg-amber-900',
    description: '1×1 · cerca'
  },
  wall: {
    id: 'wall',
    label: 'Muro',
    icon: '🧱',
    width: 1, height: 1,
    cost: 14,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 0,
    color: 'bg-stone-600',
    description: '1×1 · muro bloquea'
  },
  hedge: {
    id: 'hedge',
    label: 'Seto',
    icon: '🌿',
    width: 1, height: 1,
    cost: 10,
    effects: { population: 0, energy: 0, water: 0, oxygen: 2 },
    incomePerTick: 0,
    color: 'bg-green-700',
    description: '1×1 · +2 O₂'
  },
  brick_wall: {
    id: 'brick_wall',
    label: 'Muro ladrillo',
    icon: '🧱',
    width: 1, height: 1,
    cost: 16,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 0,
    color: 'bg-red-800',
    description: '1×1 · ladrillo'
  },
  metal_fence: {
    id: 'metal_fence',
    label: 'Malla metálica',
    icon: '⛓️',
    width: 1, height: 1,
    cost: 12,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 0,
    color: 'bg-zinc-500',
    description: '1×1 · malla'
  },
  gate: {
    id: 'gate',
    label: 'Reja / Puerta',
    icon: '🚪',
    width: 1, height: 1,
    cost: 18,
    effects: { population: 0, energy: 0, water: 0, oxygen: 0 },
    incomePerTick: 0,
    color: 'bg-zinc-700',
    description: '1×1 · con paso'
  },
  // === Agua / Muelles — requieren agua adyacente ===
  dock: {
    id: 'dock',
    label: 'Muelle',
    icon: '⚓',
    width: 2, height: 1,
    cost: 90,
    effects: { population: 0, energy: 0, water: 0 },
    incomePerTick: 10,
    color: 'bg-amber-800',
    description: '2×1 — requiere lago al lado'
  },
  pier: {
    id: 'pier',
    label: 'Muelle largo',
    icon: '🛥️',
    width: 3, height: 1,
    cost: 140,
    effects: { population: 0, energy: 0, water: 0 },
    incomePerTick: 16,
    color: 'bg-amber-900',
    description: '3×1 — requiere agua'
  },
  fishing_hut: {
    id: 'fishing_hut',
    label: 'Cabaña pesca',
    icon: '🎣',
    width: 1, height: 1,
    cost: 70,
    effects: { population: 2, energy: 0, water: 0 },
    incomePerTick: 6,
    color: 'bg-yellow-800',
    description: '1×1 — al lado del agua'
  }
}

export const TOOL_TYPES = {
  ...BUILDING_TYPES,
  demolish: {
    id: 'demolish',
    label: 'Demoler',
    icon: '🧨',
    cost: 0,
    refund: 0.5,
    color: 'bg-red-600',
    description: 'Demoler y recuperar 50%'
  },
  fill: {
    id: 'fill',
    label: 'Rellenar',
    icon: '⛏️',
    cost: 25,
    color: 'bg-amber-700',
    description: 'Rellena agua → pasto (25💰)'
  }
}

// Compatibilidad: agua colocada por ti vs agua de la naturaleza (terrain)
// Alias para saves antiguos con buildingId 'water'
BUILDING_TYPES.water = BUILDING_TYPES.waterPlant

// Alias requerido por Fase 2 (ResourceBar/ToolPalette/CellTile importan BUILDINGS)
export const BUILDINGS = BUILDING_TYPES

// Compatibilidad Fase 2: exponer campos planos que esperan los componentes
for (const key of Object.keys(BUILDING_TYPES)) {
  const b = BUILDING_TYPES[key]
  b.population = b.effects.population
  b.energyGenerated = Math.max(0, b.effects.energy)
  b.energyConsumed = Math.max(0, -b.effects.energy)
  b.waterGenerated = Math.max(0, b.effects.water)
  b.waterConsumed = Math.max(0, -b.effects.water)
  b.oxygenGenerated = Math.max(0, b.effects.oxygen || 0)
  b.oxygenConsumed = Math.max(0, -(b.effects.oxygen || 0))
}

export const GRID_SIZE = 150
export const TICK_INTERVAL_MS = 2000
export const INITIAL_RESOURCES = {
  money: 1500,
  population: 0,
  energy: 0,
  water: 0,
  oxygen: 20, // arranca con reserva, árboles la mantienen
}
