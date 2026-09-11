<!-- src/components/BuildingSprites.vue -->
<template>
  <div class="w-full h-full flex items-center justify-center select-none relative p-0.5">
    
    <!-- 1a. RESIDENCIAL PEQUEÑA — cabaña acogedora 1×1 -->
    <svg v-if="type === 'residential_small'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="smallRoof" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a16207" />
          <stop offset="100%" stop-color="#92400e" />
        </linearGradient>
        <linearGradient id="smallWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fefce8" />
          <stop offset="100%" stop-color="#fde68a" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="82" rx="32" ry="7" fill="#000" opacity="0.22" />
      <rect x="5" y="72" width="90" height="18" rx="3" fill="#15803d" />
      <rect x="22" y="42" width="56" height="32" rx="2" fill="url(#smallWall)" stroke="#a16207" stroke-width="1.4" />
      <path d="M16 44 L50 18 L84 44 Z" fill="url(#smallRoof)" stroke="#78350f" stroke-width="1.6" />
      <rect x="28" y="50" width="12" height="12" rx="1.5" fill="#fef9c3" stroke="#854d0e" stroke-width="1" />
      <line x1="34" y1="50" x2="34" y2="62" stroke="#854d0e" stroke-width="0.8" /><line x1="28" y1="56" x2="40" y2="56" stroke="#854d0e" stroke-width="0.8" />
      <rect x="60" y="52" width="12" height="22" rx="1" fill="#78350f" stroke="#451a03" stroke-width="1.2" />
      <circle cx="69" cy="63" r="1.2" fill="#facc15" />
      <circle cx="18" cy="76" r="4" fill="#166534" /><circle cx="82" cy="76" r="4" fill="#166534" />
      <text x="50" y="88" font-size="3.5" fill="#fefce8" text-anchor="middle" font-weight="700">PEQUEÑA</text>
    </svg>

    <!-- 1b. RESIDENCIAL NORMAL — casa urbana moderna 1×1 -->
    <svg v-else-if="type === 'residential'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="resRoof" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444" />
          <stop offset="100%" stop-color="#991b1b" />
        </linearGradient>
        <linearGradient id="resWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
        <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
      </defs>
      <rect x="5" y="70" width="90" height="25" rx="4" fill="#15803d" />
      <rect x="8" y="73" width="84" height="6" rx="2" fill="#22c55e" opacity="0.6" />
      <ellipse cx="50" cy="76" rx="38" ry="8" fill="#000" opacity="0.25" />
      <rect x="18" y="38" width="64" height="38" rx="2" fill="url(#resWall)" stroke="#475569" stroke-width="1.5" />
      <path d="M10 40 L50 12 L90 40 Z" fill="url(#resRoof)" stroke="#7f1d1d" stroke-width="2" />
      <path d="M18 37 L50 15 L82 37" stroke="#fca5a5" stroke-width="1.5" fill="none" opacity="0.6" />
      <rect x="66" y="18" width="8" height="16" fill="#78350f" rx="1" />
      <circle cx="70" cy="12" r="3" fill="#e2e8f0" opacity="0.5" /><circle cx="73" cy="7" r="4.5" fill="#e2e8f0" opacity="0.3" />
      <g stroke="#1e293b" stroke-width="1.2">
        <rect x="26" y="46" width="14" height="14" rx="2" fill="url(#glass)" />
        <line x1="33" y1="46" x2="33" y2="60" stroke="#fff" stroke-width="1" opacity="0.8" /><line x1="26" y1="53" x2="40" y2="53" stroke="#fff" stroke-width="1" opacity="0.8" />
        <rect x="60" y="46" width="14" height="14" rx="2" fill="url(#glass)" />
        <line x1="67" y1="46" x2="67" y2="60" stroke="#fff" stroke-width="1" opacity="0.8" /><line x1="60" y1="53" x2="74" y2="53" stroke="#fff" stroke-width="1" opacity="0.8" />
      </g>
      <rect x="44" y="52" width="12" height="24" rx="1" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
      <circle cx="53" cy="65" r="1.5" fill="#facc15" />
      <rect x="42" y="50" width="16" height="3" rx="1" fill="#475569" />
      <circle cx="21" cy="72" r="5" fill="#166534" /><circle cx="21" cy="70" r="3.5" fill="#22c55e" /><circle cx="79" cy="72" r="5" fill="#166534" /><circle cx="79" cy="70" r="3.5" fill="#22c55e" />
    </svg>

    <!-- 1c. RESIDENCIAL MEDIANA — 1×1 con balcón y buhardilla -->
    <svg v-else-if="type === 'residential_medium'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="medRoof" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#1e3a8a" />
        </linearGradient>
        <linearGradient id="medWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f1f5f9" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="84" rx="34" ry="7" fill="#000" opacity="0.22" />
      <rect x="12" y="36" width="76" height="42" rx="2" fill="url(#medWall)" stroke="#334155" stroke-width="1.4" />
      <path d="M8 38 L50 14 L92 38 Z" fill="url(#medRoof)" stroke="#1e3a8a" stroke-width="1.6" />
      <rect x="42" y="20" width="16" height="12" rx="1" fill="#dbeafe" stroke="#1e3a8a" stroke-width="1" /><line x1="50" y1="20" x2="50" y2="32" stroke="#1e3a8a" stroke-width="0.8" />
      <g fill="#bfdbfe" stroke="#1e3a8a" stroke-width="0.9">
        <rect x="20" y="46" width="12" height="12" rx="1" /><rect x="36" y="46" width="12" height="10" rx="1" /><rect x="52" y="46" width="12" height="10" rx="1" /><rect x="68" y="46" width="12" height="12" rx="1" />
        <rect x="20" y="62" width="12" height="12" rx="1" /><rect x="68" y="62" width="12" height="12" rx="1" />
      </g>
      <rect x="32" y="62" width="36" height="4" rx="1" fill="#475569" />
      <rect x="44" y="58" width="12" height="16" rx="1" fill="#78350f" stroke="#451a03" stroke-width="1.2" />
      <circle cx="74" cy="76" r="3" fill="#22c55e" /><circle cx="26" cy="76" r="3" fill="#22c55e" />
    </svg>

    <!-- 1d. RESIDENCIAL GRANDE — villa 2×2 con jardín y piscina -->
    <svg v-else-if="type === 'residential_large'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="largeRoof" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7c3aed" />
          <stop offset="100%" stop-color="#4c1d95" />
        </linearGradient>
        <linearGradient id="largeWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fefce8" />
          <stop offset="100%" stop-color="#fde68a" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="86" rx="38" ry="8" fill="#000" opacity="0.22" />
      <!-- Jardín 2×2 -->
      <rect x="4" y="62" width="92" height="30" rx="4" fill="#22c55e" stroke="#15803d" stroke-width="1" />
      <rect x="8" y="68" width="30" height="14" rx="2" fill="#60a5fa" stroke="#0284c7" stroke-width="0.8" opacity="0.9" />
      <text x="23" y="77" font-size="4" fill="#fff" text-anchor="middle">piscina</text>
      <circle cx="78" cy="74" r="5" fill="#166534" /><circle cx="86" cy="80" r="4" fill="#16a34a" />
      <!-- Casa grande 2 plantas -->
      <rect x="18" y="22" width="64" height="44" rx="2" fill="url(#largeWall)" stroke="#92400e" stroke-width="1.4" />
      <path d="M12 24 L50 6 L88 24 Z" fill="url(#largeRoof)" stroke="#4c1d95" stroke-width="1.6" />
      <g fill="#fef3c7" stroke="#92400e" stroke-width="0.8">
        <rect x="24" y="30" width="12" height="10" rx="1" /><rect x="40" y="30" width="12" height="10" rx="1" /><rect x="56" y="30" width="12" height="10" rx="1" />
        <rect x="24" y="44" width="12" height="12" rx="1" /><rect x="40" y="44" width="12" height="12" rx="1" /><rect x="56" y="44" width="12" height="12" rx="1" />
      </g>
      <rect x="66" y="44" width="12" height="22" rx="1" fill="#78350f" stroke="#451a03" stroke-width="1.2" />
      <rect x="30" y="52" width="24" height="3" rx="1" fill="#475569" />
      <text x="50" y="20" font-size="3.5" fill="#fff" text-anchor="middle" font-weight="800">VILLA</text>
    </svg>

    <!-- 1e. PARQUE / JARDÍN HD 2×2 — mejorado con senderos y bancas -->
    <svg v-else-if="type === 'park'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="parkGrass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#86efac" />
          <stop offset="100%" stop-color="#16a34a" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="6" fill="url(#parkGrass)" stroke="#15803d" stroke-width="1.5" />
      <!-- Sendero cruz -->
      <rect x="46" y="4" width="8" height="92" rx="2" fill="#fef3c7" stroke="#a16207" stroke-width="0.6" opacity="0.95" />
      <rect x="4" y="46" width="92" height="8" rx="2" fill="#fef3c7" stroke="#a16207" stroke-width="0.6" opacity="0.95" />
      <circle cx="50" cy="50" r="5" fill="#fef3c7" stroke="#a16207" stroke-width="0.8" />
      <!-- Árboles -->
      <g opacity="0.95">
        <circle cx="22" cy="22" r="12" fill="#166534" /><circle cx="22" cy="22" r="8" fill="#22c55e" /><circle cx="22" cy="20" r="4" fill="#4ade80" />
        <circle cx="78" cy="22" r="12" fill="#166534" /><circle cx="78" cy="22" r="8" fill="#22c55e" />
        <circle cx="22" cy="78" r="12" fill="#166534" /><circle cx="22" cy="78" r="8" fill="#15803d" />
        <circle cx="78" cy="78" r="12" fill="#14532d" /><circle cx="78" cy="78" r="8" fill="#22c55e" />
      </g>
      <!-- Bancas -->
      <rect x="58" y="14" width="14" height="4" rx="1" fill="#92400e" stroke="#451a03" stroke-width="0.6" />
      <rect x="58" y="80" width="14" height="4" rx="1" fill="#92400e" stroke="#451a03" stroke-width="0.6" />
      <rect x="14" y="58" width="4" height="14" rx="1" fill="#92400e" stroke="#451a03" stroke-width="0.6" />
      <!-- Fuente central -->
      <circle cx="50" cy="50" r="3" fill="#38bdf8" stroke="#0284c7" stroke-width="0.8" />
      <text x="50" y="92" font-size="4" fill="#14532d" text-anchor="middle" font-weight="800">PARQUE</text>
    </svg>

    <!-- 2. COMERCIAL HD (Tienda / Centro Comercial con Letrero Neón) -->
    <svg v-else-if="type === 'commercial'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="commBuilding" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#1d4ed8" />
        </linearGradient>
        <linearGradient id="neonSign" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f43f5e" />
          <stop offset="100%" stop-color="#fb7185" />
        </linearGradient>
      </defs>

      <!-- Sombra Base -->
      <rect x="10" y="82" width="80" height="10" rx="3" fill="#000" opacity="0.3" />

      <!-- Bloque Principal -->
      <rect x="14" y="22" width="72" height="64" rx="4" fill="url(#commBuilding)" stroke="#1e3a8a" stroke-width="2" />

      <!-- Cartelera / Anuncio Neón en Techo -->
      <rect x="25" y="8" width="50" height="18" rx="3" fill="#1e1b4b" stroke="#f43f5e" stroke-width="2" />
      <rect x="28" y="11" width="44" height="12" rx="2" fill="url(#neonSign)" />
      <text x="50" y="20" font-family="sans-serif" font-weight="900" font-size="8" fill="#fff" text-anchor="middle">MALL</text>

      <!-- Toldo Rayado Comercial -->
      <path d="M 10 42 L 90 42 L 84 54 L 16 54 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
      <path d="M 22 42 L 28 42 L 25 54 L 19 54 Z" fill="#ef4444" />
      <path d="M 36 42 L 42 42 L 39 54 L 33 54 Z" fill="#ef4444" />
      <path d="M 50 42 L 56 42 L 53 54 L 47 54 Z" fill="#ef4444" />
      <path d="M 64 42 L 70 42 L 67 54 L 61 54 Z" fill="#ef4444" opacity="0.9" />
      <path d="M 78 42 L 84 42 L 81 54 L 75 54 Z" fill="#ef4444" opacity="0.9" />

      <!-- Vitrina / Cristalera de Exposición -->
      <rect x="20" y="58" width="26" height="26" rx="2" fill="#93c5fd" stroke="#1e40af" stroke-width="1.5" opacity="0.9" />
      <line x1="20" y1="68" x2="46" y2="68" stroke="#fff" stroke-width="1.5" opacity="0.7" />
      
      <rect x="54" y="58" width="26" height="26" rx="2" fill="#93c5fd" stroke="#1e40af" stroke-width="1.5" opacity="0.9" />
      <line x1="54" y1="68" x2="80" y2="68" stroke="#fff" stroke-width="1.5" opacity="0.7" />

      <!-- Puerta Automática de Cristal -->
      <rect x="42" y="60" width="16" height="26" fill="#1e293b" stroke="#475569" stroke-width="1" />
      <rect x="44" y="62" width="5.5" height="22" fill="#38bdf8" opacity="0.7" />
      <rect x="50.5" y="62" width="5.5" height="22" fill="#38bdf8" opacity="0.7" />
    </svg>

    <!-- 2b. TIENDA HD (Pequeña) -->
    <svg v-else-if="type === 'shop'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="34" width="72" height="42" rx="3" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
      <path d="M10 38 L90 38 L84 48 L16 48 Z" fill="#f59e0b" stroke="#92400e" stroke-width="1" />
      <text x="50" y="46" font-size="6" font-weight="800" fill="#fff" text-anchor="middle">SHOP</text>
      <rect x="20" y="52" width="22" height="18" rx="1" fill="#fff" stroke="#0284c7" stroke-width="1" />
      <rect x="58" y="52" width="22" height="18" rx="1" fill="#fff" stroke="#0284c7" stroke-width="1" />
      <rect x="42" y="64" width="16" height="12" rx="1" fill="#1e293b" /><circle cx="74" cy="70" r="2" fill="#facc15" />
    </svg>

    <!-- 2c. SUPERMERCADO 2×2 -->
    <svg v-else-if="type === 'supermarket'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="8" y="24" width="84" height="52" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
      <rect x="6" y="18" width="88" height="10" rx="1" fill="#0284c7" />
      <text x="50" y="26" font-size="6" font-weight="900" fill="#fff" text-anchor="middle">SUPERMARKET</text>
      <rect x="14" y="34" width="72" height="6" rx="1" fill="#f59e0b" />
      <rect x="18" y="44" width="18" height="22" rx="1" fill="#fff" stroke="#0284c7" stroke-width="1" /><rect x="40" y="44" width="18" height="22" rx="1" fill="#fff" stroke="#0284c7" stroke-width="1" /><rect x="62" y="44" width="18" height="22" rx="1" fill="#fff" stroke="#0284c7" stroke-width="1" />
      <text x="50" y="56" font-size="8" text-anchor="middle">🛒</text>
    </svg>

    <!-- 2d. MALL 3×2 -->
    <svg v-else-if="type === 'mall'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="6" y="22" width="88" height="52" rx="4" fill="#a5b4fc" stroke="#3730a3" stroke-width="1.5" />
      <rect x="4" y="16" width="92" height="10" rx="1" fill="#3730a3" />
      <text x="50" y="23" font-size="6" font-weight="900" fill="#fff" text-anchor="middle">MALL</text>
      <rect x="12" y="30" width="22" height="18" rx="1" fill="#fff" stroke="#3730a3" stroke-width="1" /><rect x="38" y="30" width="24" height="18" rx="1" fill="#fff" stroke="#3730a3" stroke-width="1" /><rect x="66" y="30" width="22" height="18" rx="1" fill="#fff" stroke="#3730a3" stroke-width="1" />
      <rect x="12" y="52" width="22" height="14" rx="1" fill="#1e293b" /><rect x="42" y="52" width="16" height="14" rx="1" fill="#1e293b" /><rect x="66" y="52" width="22" height="14" rx="1" fill="#1e293b" />
      <text x="50" y="62" font-size="5" fill="#fff" text-anchor="middle">🏬</text>
    </svg>

    <!-- 2e. BANCO 2×1 -->
    <svg v-else-if="type === 'bank'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="30" width="72" height="38" rx="2" fill="#fef3c7" stroke="#92400e" stroke-width="1.4" />
      <path d="M10 32 L50 16 L90 32 Z" fill="#e7e5e4" stroke="#57534e" stroke-width="1.2" />
      <rect x="22" y="40" width="6" height="22" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="40" y="40" width="6" height="22" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="54" y="40" width="6" height="22" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="72" y="40" width="6" height="22" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <text x="50" y="26" font-size="5" text-anchor="middle">🏦</text>
      <text x="50" y="58" font-size="8" font-weight="900" fill="#92400e" text-anchor="middle">$</text>
    </svg>

    <!-- 3. ENERGÍA HD (Planta Nuclear / Eléctrica con Humo y Antenas) -->
    <svg v-else-if="type === 'power'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="towerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#475569" />
          <stop offset="50%" stop-color="#94a3b8" />
          <stop offset="100%" stop-color="#334155" />
        </linearGradient>
      </defs>

      <!-- Humo Dinámico -->
      <circle cx="35" cy="10" r="7" fill="#cbd5e1" opacity="0.4" />
      <circle cx="30" cy="5" r="9" fill="#cbd5e1" opacity="0.25" />
      <circle cx="68" cy="14" r="6" fill="#cbd5e1" opacity="0.4" />

      <!-- Torre de Enfriamiento Izq -->
      <path d="M 22 78 L 28 30 L 44 30 L 50 78 Z" fill="url(#towerGrad)" stroke="#1e293b" stroke-width="2" />
      <ellipse cx="36" cy="30" rx="8" ry="2.5" fill="#1e293b" />
      <path d="M 24 65 Q 36 68 48 65" stroke="#ef4444" stroke-width="3" fill="none" /> <!-- Franja seguridad -->

      <!-- Torre de Enfriamiento Der -->
      <path d="M 52 78 L 57 36 L 73 36 L 78 78 Z" fill="url(#towerGrad)" stroke="#1e293b" stroke-width="2" />
      <ellipse cx="65" cy="36" rx="8" ry="2.5" fill="#1e293b" />
      <path d="M 54 65 Q 65 68 76 65" stroke="#ef4444" stroke-width="3" fill="none" />

      <!-- Edificio de Control Subestación -->
      <rect x="10" y="58" width="28" height="22" rx="2" fill="#334155" stroke="#0f172a" stroke-width="1.5" />
      <rect x="14" y="64" width="8" height="8" fill="#facc15" opacity="0.9" /> <!-- Ventana control -->

      <!-- Símbolo Peligro Eléctrico / Rayo -->
      <circle cx="24" cy="46" r="10" fill="#facc15" stroke="#000" stroke-width="1.5" />
      <path d="M 25 39 L 20 47 L 24 47 L 22 53 L 28 44 L 24 44 Z" fill="#000" />
    </svg>

    <!-- 4. AGUA HD — Planta industrial (tanques + tuberías + nave) -->
    <svg v-else-if="type === 'water' || type === 'waterPlant'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="84" rx="34" ry="7" fill="#000" opacity="0.22" />
      <!-- Nave industrial -->
      <rect x="10" y="36" width="52" height="34" rx="2" fill="#475569" stroke="#1e293b" stroke-width="1.4" />
      <rect x="10" y="30" width="52" height="8" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1" />
      <rect x="18" y="42" width="10" height="10" rx="1" fill="#38bdf8" stroke="#0f172a" stroke-width="0.8" opacity="0.9" />
      <rect x="32" y="42" width="10" height="10" rx="1" fill="#38bdf8" stroke="#0f172a" stroke-width="0.8" opacity="0.9" />
      <rect x="18" y="56" width="10" height="8" rx="1" fill="#94a3b8" stroke="#0f172a" stroke-width="0.7" />
      <rect x="32" y="56" width="10" height="8" rx="1" fill="#94a3b8" stroke="#0f172a" stroke-width="0.7" />
      <!-- Tanques cilíndricos -->
      <ellipse cx="74" cy="42" rx="12" ry="8" fill="#cbd5e1" stroke="#334155" stroke-width="1.2" />
      <rect x="62" y="42" width="24" height="22" rx="1" fill="#e2e8f0" stroke="#334155" stroke-width="1.2" />
      <ellipse cx="74" cy="64" rx="12" ry="4" fill="#94a3b8" />
      <ellipse cx="74" cy="42" rx="12" ry="4" fill="#f1f5f9" stroke="#334155" stroke-width="1" />
      <!-- Tubería gruesa -->
      <rect x="58" y="52" width="10" height="6" rx="1" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
      <rect x="52" y="54" width="12" height="3" rx="1" fill="#38bdf8" />
      <!-- Chimenea vapor -->
      <rect x="48" y="18" width="6" height="16" rx="1" fill="#1e293b" stroke="#0f172a" stroke-width="1" />
      <circle cx="51" cy="14" r="4" fill="#e2e8f0" opacity="0.5" /><circle cx="54" cy="9" r="5" fill="#e2e8f0" opacity="0.3" />
      <text x="36" y="78" font-size="4" fill="#38bdf8" text-anchor="middle" font-weight="800">PLANTA AGUA 🏭</text>
    </svg>

    <!-- 5. CARRETERA HD (Asfalto Realista con Marcado Amarillo y Pasos Peatonales) -->
    <svg v-else-if="type === 'road'" viewBox="0 0 100 100" class="w-full h-full">
      <!-- Base Asfalto -->
      <rect x="0" y="0" width="100" height="100" fill="#334155" />
      <!-- Textura de arcén / Bordillo -->
      <rect x="0" y="0" width="100" height="6" fill="#cbd5e1" />
      <rect x="0" y="94" width="100" height="6" fill="#cbd5e1" />

      <!-- Pasos peatonales / Líneas divisoras -->
      <g stroke="#facc15" stroke-width="4" stroke-dasharray="12,10">
        <line x1="50" y1="8" x2="50" y2="92" />
      </g>
      
      <!-- Línea lateral continua -->
      <line x1="10" y1="0" x2="10" y2="100" stroke="#fff" stroke-width="2" opacity="0.6" />
      <line x1="90" y1="0" x2="90" y2="100" stroke="#fff" stroke-width="2" opacity="0.6" />
    </svg>

    <!-- 7. ESTADIO HD (Ovalado con campo y gradas iluminadas) -->
    <svg v-else-if="type === 'stadium'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="stadiumGrass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
        <linearGradient id="stadiumStand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e0e7ff" />
          <stop offset="100%" stop-color="#a5b4fc" />
        </linearGradient>
      </defs>
      <!-- Sombra base -->
      <ellipse cx="50" cy="84" rx="38" ry="10" fill="#000" opacity="0.28" />
      <!-- Gradas elípticas -->
      <ellipse cx="50" cy="52" rx="44" ry="28" fill="url(#stadiumStand)" stroke="#3730a3" stroke-width="1.8" />
      <ellipse cx="50" cy="52" rx="36" ry="20" fill="#1e293b" />
      <!-- Campo -->
      <ellipse cx="50" cy="52" rx="30" ry="15" fill="url(#stadiumGrass)" stroke="#fff" stroke-width="0.8" />
      <ellipse cx="50" cy="52" rx="30" ry="15" fill="none" stroke="#fff" stroke-width="0.6" opacity="0.6" />
      <line x1="50" y1="37" x2="50" y2="67" stroke="#fff" stroke-width="0.7" opacity="0.85" />
      <circle cx="50" cy="52" r="5" fill="none" stroke="#fff" stroke-width="0.7" />
      <circle cx="50" cy="52" r="1" fill="#fff" />
      <!-- Porterías -->
      <rect x="19" y="48" width="4" height="8" fill="#fff" opacity="0.9" />
      <rect x="77" y="48" width="4" height="8" fill="#fff" opacity="0.9" />
      <!-- Luces / torres -->
      <g fill="#facc15" opacity="0.95">
        <rect x="14" y="22" width="3" height="10" rx="1" /><circle cx="15.5" cy="21" r="3" fill="#fef08a" />
        <rect x="83" y="22" width="3" height="10" rx="1" /><circle cx="84.5" cy="21" r="3" fill="#fef08a" />
        <rect x="14" y="66" width="3" height="10" rx="1" /><circle cx="15.5" cy="78" r="3" fill="#fef08a" />
        <rect x="83" y="66" width="3" height="10" rx="1" /><circle cx="84.5" cy="78" r="3" fill="#fef08a" />
      </g>
      <!-- Cartel -->
      <rect x="36" y="8" width="28" height="8" rx="1.5" fill="#1e1b4b" stroke="#a5b4fc" stroke-width="0.8" />
      <text x="50" y="13.5" font-size="5" font-weight="900" fill="#fff" text-anchor="middle">STADIUM</text>
    </svg>

    <!-- 8. AEROPUERTO HD (Pista + torre + avión) -->
    <svg v-else-if="type === 'airport'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="runway" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="50%" stop-color="#475569" />
          <stop offset="100%" stop-color="#334155" />
        </linearGradient>
        <linearGradient id="towerAir" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e0f2fe" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
      </defs>
      <!-- Sombra -->
      <ellipse cx="50" cy="78" rx="42" ry="7" fill="#000" opacity="0.22" />
      <!-- Pista -->
      <rect x="4" y="44" width="92" height="18" rx="2" fill="url(#runway)" stroke="#0f172a" stroke-width="1" />
      <g stroke="#fff" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.95">
        <line x1="10" y1="53" x2="90" y2="53" />
      </g>
      <g fill="#facc15">
        <rect x="10" y="47" width="2" height="12" rx="0.5" />
        <rect x="88" y="47" width="2" height="12" rx="0.5" />
      </g>
      <!-- Torre control -->
      <rect x="68" y="18" width="14" height="28" rx="2" fill="url(#towerAir)" stroke="#0369a1" stroke-width="1.2" />
      <rect x="66" y="14" width="18" height="8" rx="1.5" fill="#0f172a" stroke="#38bdf8" stroke-width="0.8" />
      <rect x="68" y="16" width="14" height="4" rx="0.5" fill="#38bdf8" opacity="0.85" />
      <circle cx="75" cy="36" r="1.8" fill="#facc15" opacity="0.9" />
      <!-- Avión top-down -->
      <g transform="translate(22,26) rotate(-10)">
        <ellipse cx="16" cy="22" rx="5" ry="14" fill="#f8fafc" stroke="#0f172a" stroke-width="1" />
        <polygon points="16,2 10,10 22,10" fill="#e2e8f0" stroke="#0f172a" stroke-width="0.7" />
        <polygon points="8,14 24,14 22,20 10,20" fill="#38bdf8" stroke="#0284c7" stroke-width="0.6" />
        <polygon points="8,28 24,28 20,34 12,34" fill="#38bdf8" stroke="#0284c7" stroke-width="0.6" />
        <circle cx="16" cy="8" r="1.2" fill="#38bdf8" />
      </g>
      <!-- Hangar -->
      <rect x="8" y="64" width="28" height="10" rx="1.5" fill="#1e293b" stroke="#334155" stroke-width="1" />
      <text x="22" y="71" font-size="4" fill="#fff" text-anchor="middle" font-weight="bold">HANGAR</text>
    </svg>

    <!-- 9. HOTEL HD (Fachada con balcones iluminados) -->
    <svg v-else-if="type === 'hotel' || type === 'hotel_large'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="hotelFac" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e0e7ff" />
          <stop offset="100%" stop-color="#6366f1" />
        </linearGradient>
        <linearGradient id="hotelGlass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fde68a" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="84" rx="34" ry="6" fill="#000" opacity="0.22" />
      <rect x="12" y="22" width="76" height="56" rx="3" fill="url(#hotelFac)" stroke="#3730a3" stroke-width="1.6" />
      <rect x="10" y="16" width="80" height="10" rx="1.5" fill="#3730a3" />
      <text x="50" y="23" font-size="5" font-weight="900" fill="#fff" text-anchor="middle">HOTEL</text>
      <g fill="url(#hotelGlass)" stroke="#92400e" stroke-width="0.8">
        <rect x="18" y="30" width="12" height="10" rx="1" /><rect x="34" y="30" width="12" height="10" rx="1" /><rect x="54" y="30" width="12" height="10" rx="1" /><rect x="70" y="30" width="12" height="10" rx="1" />
        <rect x="18" y="44" width="12" height="10" rx="1" /><rect x="34" y="44" width="12" height="10" rx="1" /><rect x="54" y="44" width="12" height="10" rx="1" /><rect x="70" y="44" width="12" height="10" rx="1" />
        <rect x="18" y="58" width="12" height="10" rx="1" /><rect x="34" y="58" width="12" height="10" rx="1" /><rect x="54" y="58" width="12" height="10" rx="1" /><rect x="70" y="58" width="12" height="10" rx="1" />
      </g>
      <rect x="42" y="66" width="16" height="12" rx="1" fill="#1e293b" stroke="#000" stroke-width="1" />
      <rect x="44" y="68" width="12" height="8" fill="#334155" />
      <circle cx="74" cy="76" r="2" fill="#facc15" opacity="0.9" />
      <text v-if="type==='hotel_large'" x="50" y="78" font-size="4" fill="#3730a3" text-anchor="middle" font-weight="bold">★★★</text>
    </svg>

    <!-- 10. RESTAURANTE HD (Toldo rojo + mesas) -->
    <svg v-else-if="type === 'restaurant' || type === 'restaurant_small'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="restWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="82" rx="30" ry="6" fill="#000" opacity="0.2" />
      <rect x="14" y="28" width="72" height="48" rx="3" fill="url(#restWall)" stroke="#92400e" stroke-width="1.4" />
      <path d="M10 32 L90 32 L86 44 L14 44 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1" />
      <path d="M22 32 L28 44 M36 32 L42 44 M50 32 L56 44 M64 32 L70 44 M78 32 L84 44" stroke="#fff" stroke-width="1" opacity="0.9" />
      <text x="50" y="40" font-size="6" font-weight="800" fill="#fff" text-anchor="middle">{{ type==='restaurant_small' ? 'CAFÉ' : 'RESTAURANTE' }}</text>
      <rect x="20" y="52" width="22" height="14" rx="1.5" fill="#fff" stroke="#92400e" stroke-width="0.8" opacity="0.9" />
      <rect x="58" y="52" width="22" height="14" rx="1.5" fill="#fff" stroke="#92400e" stroke-width="0.8" opacity="0.9" />
      <circle cx="31" cy="59" r="2" fill="#ef4444" /><circle cx="69" cy="59" r="2" fill="#f59e0b" />
      <rect x="44" y="66" width="12" height="10" rx="1" fill="#1e293b" /><rect x="46" y="68" width="8" height="6" fill="#fde68a" />
    </svg>

    <!-- 11. UNIVERSIDAD / ESCUELA HD (Campus con reloj) -->
    <svg v-else-if="type === 'university' || type === 'school'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="uniWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ccfbf1" />
          <stop offset="100%" stop-color="#0f766e" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="84" rx="36" ry="7" fill="#000" opacity="0.2" />
      <!-- Cuerpo principal -->
      <rect x="18" y="36" width="64" height="38" rx="2" fill="url(#uniWall)" stroke="#134e4a" stroke-width="1.4" />
      <!-- Torre reloj central -->
      <rect x="42" y="14" width="16" height="26" rx="1.5" fill="#134e4a" stroke="#042f2e" stroke-width="1" />
      <circle cx="50" cy="24" r="6" fill="#fef3c7" stroke="#0f172a" stroke-width="1" />
      <line x1="50" y1="24" x2="50" y2="20" stroke="#000" stroke-width="1" /><line x1="50" y1="24" x2="53" y2="24" stroke="#000" stroke-width="1" />
      <polygon points="50,8 46,14 54,14" fill="#042f2e" />
      <!-- Ventanas -->
      <g fill="#fef3c7" stroke="#134e4a" stroke-width="0.7">
        <rect x="24" y="44" width="10" height="10" rx="1" /><rect x="38" y="44" width="10" height="10" rx="1" /><rect x="52" y="44" width="10" height="10" rx="1" /><rect x="66" y="44" width="10" height="10" rx="1" />
        <rect x="24" y="58" width="10" height="10" rx="1" /><rect x="38" y="58" width="10" height="10" rx="1" /><rect x="52" y="58" width="10" height="10" rx="1" /><rect x="66" y="58" width="10" height="10" rx="1" />
      </g>
      <rect x="42" y="62" width="16" height="12" rx="1" fill="#1e293b" stroke="#000" stroke-width="1" />
      <text x="50" y="12" font-size="3.5" fill="#134e4a" text-anchor="middle" font-weight="900">{{ type==='school' ? 'ESCUELA' : 'UNIVERSIDAD' }}</text>
    </svg>

    <!-- 12. TORRES VERTICALES 1×2 / 2×2 (2 cuadros altura) -->
    <svg v-else-if="type === 'tower_residential'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="towerRes" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="50%" stop-color="#e2e8f0" />
          <stop offset="100%" stop-color="#64748b" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="88" rx="30" ry="6" fill="#000" opacity="0.25" />
      <rect x="22" y="12" width="56" height="72" rx="2" fill="url(#towerRes)" stroke="#475569" stroke-width="1.5" />
      <g fill="#38bdf8" stroke="#1e293b" stroke-width="0.6" opacity="0.9">
        <rect x="28" y="18" width="10" height="8" rx="1" /><rect x="44" y="18" width="10" height="8" rx="1" /><rect x="62" y="18" width="10" height="8" rx="1" />
        <rect x="28" y="30" width="10" height="8" rx="1" /><rect x="44" y="30" width="10" height="8" rx="1" /><rect x="62" y="30" width="10" height="8" rx="1" />
        <rect x="28" y="42" width="10" height="8" rx="1" /><rect x="44" y="42" width="10" height="8" rx="1" /><rect x="62" y="42" width="10" height="8" rx="1" />
        <rect x="28" y="54" width="10" height="8" rx="1" /><rect x="44" y="54" width="10" height="8" rx="1" /><rect x="62" y="54" width="10" height="8" rx="1" />
      </g>
      <rect x="40" y="70" width="20" height="14" rx="1" fill="#1e293b" /><circle cx="56" cy="77" r="1.5" fill="#facc15" />
      <text x="50" y="10" font-size="4" fill="#334155" text-anchor="middle" font-weight="800">TORRE VIV</text>
    </svg>

    <svg v-else-if="type === 'tower_commercial'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="towerComm" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0ea5e9" />
          <stop offset="100%" stop-color="#1e3a8a" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="88" rx="30" ry="6" fill="#000" opacity="0.25" />
      <rect x="24" y="10" width="52" height="74" rx="2" fill="url(#towerComm)" stroke="#1e3a8a" stroke-width="1.5" />
      <g fill="none" stroke="#7dd3fc" stroke-width="0.6" opacity="0.5">
        <line x1="24" y1="26" x2="76" y2="26" /><line x1="24" y1="40" x2="76" y2="40" /><line x1="24" y1="54" x2="76" y2="54" /><line x1="24" y1="68" x2="76" y2="68" />
      </g>
      <g fill="#bae6fd" stroke="#0369a1" stroke-width="0.5">
        <rect x="30" y="18" width="8" height="6" rx="0.5" /><rect x="42" y="18" width="8" height="6" rx="0.5" /><rect x="54" y="18" width="8" height="6" rx="0.5" />
        <rect x="30" y="32" width="8" height="6" rx="0.5" /><rect x="42" y="32" width="8" height="6" rx="0.5" /><rect x="54" y="32" width="8" height="6" rx="0.5" />
        <rect x="30" y="46" width="8" height="6" rx="0.5" /><rect x="42" y="46" width="8" height="6" rx="0.5" /><rect x="54" y="46" width="8" height="6" rx="0.5" />
        <rect x="30" y="60" width="8" height="6" rx="0.5" /><rect x="42" y="60" width="8" height="6" rx="0.5" /><rect x="54" y="60" width="8" height="6" rx="0.5" />
      </g>
      <text x="50" y="81" font-size="5" fill="#fff" text-anchor="middle" font-weight="800">OFICINAS</text>
    </svg>

    <svg v-else-if="type === 'apartment_block'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="86" rx="32" ry="7" fill="#000" opacity="0.22" />
      <rect x="14" y="16" width="72" height="64" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="1.4" />
      <g fill="#38bdf8" stroke="#475569" stroke-width="0.5">
        <rect x="20" y="22" width="10" height="8" rx="1" /><rect x="34" y="22" width="10" height="8" rx="1" /><rect x="56" y="22" width="10" height="8" rx="1" /><rect x="70" y="22" width="10" height="8" rx="1" />
        <rect x="20" y="34" width="10" height="8" rx="1" /><rect x="34" y="34" width="10" height="8" rx="1" /><rect x="56" y="34" width="10" height="8" rx="1" /><rect x="70" y="34" width="10" height="8" rx="1" />
        <rect x="20" y="46" width="10" height="8" rx="1" /><rect x="34" y="46" width="10" height="8" rx="1" /><rect x="56" y="46" width="10" height="8" rx="1" /><rect x="70" y="46" width="10" height="8" rx="1" />
        <rect x="20" y="58" width="10" height="8" rx="1" /><rect x="34" y="58" width="10" height="8" rx="1" /><rect x="56" y="58" width="10" height="8" rx="1" /><rect x="70" y="58" width="10" height="8" rx="1" />
      </g>
      <rect x="44" y="70" width="12" height="10" rx="1" fill="#334155" />
    </svg>

    <svg v-else-if="type === 'skyscraper'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="50%" stop-color="#475569" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="86" rx="32" ry="7" fill="#000" opacity="0.3" />
      <rect x="18" y="8" width="64" height="72" rx="1" fill="url(#skyGrad)" stroke="#020617" stroke-width="1.2" />
      <g fill="#7dd3fc" opacity="0.85">
        <rect x="24" y="14" width="6" height="8" rx="0.5" /><rect x="34" y="14" width="6" height="8" rx="0.5" /><rect x="44" y="14" width="6" height="8" rx="0.5" /><rect x="54" y="14" width="6" height="8" rx="0.5" /><rect x="64" y="14" width="6" height="8" rx="0.5" />
        <rect x="24" y="26" width="6" height="8" rx="0.5" /><rect x="34" y="26" width="6" height="8" rx="0.5" /><rect x="44" y="26" width="6" height="8" rx="0.5" /><rect x="54" y="26" width="6" height="8" rx="0.5" /><rect x="64" y="26" width="6" height="8" rx="0.5" />
        <rect x="24" y="38" width="6" height="8" rx="0.5" /><rect x="34" y="38" width="6" height="8" rx="0.5" /><rect x="44" y="38" width="6" height="8" rx="0.5" /><rect x="54" y="38" width="6" height="8" rx="0.5" /><rect x="64" y="38" width="6" height="8" rx="0.5" />
        <rect x="24" y="50" width="6" height="8" rx="0.5" /><rect x="34" y="50" width="6" height="8" rx="0.5" /><rect x="44" y="50" width="6" height="8" rx="0.5" /><rect x="54" y="50" width="6" height="8" rx="0.5" /><rect x="64" y="50" width="6" height="8" rx="0.5" />
      </g>
      <polygon points="18,8 50,2 82,8" fill="#38bdf8" stroke="#020617" stroke-width="0.8" />
      <circle cx="50" cy="4" r="1.5" fill="#ef4444" opacity="0.9" />
      <text x="50" y="70" font-size="4" fill="#7dd3fc" text-anchor="middle" opacity="0.9">RASCACIELOS</text>
    </svg>

    <!-- 13. SERVICIOS PÚBLICOS — comisaría, bomberos, hospital, gym, juzgado, cárcel -->
    <svg v-else-if="type === 'police_station'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="10" y="28" width="80" height="52" rx="3" fill="#1e3a8a" stroke="#172554" stroke-width="1.5" />
      <rect x="8" y="22" width="84" height="10" rx="1" fill="#172554" />
      <text x="50" y="30" font-size="5" font-weight="900" fill="#fff" text-anchor="middle">POLICÍA</text>
      <rect x="18" y="38" width="14" height="14" rx="1" fill="#dbeafe" stroke="#1e40af" stroke-width="1" />
      <rect x="36" y="38" width="14" height="14" rx="1" fill="#dbeafe" stroke="#1e40af" stroke-width="1" />
      <rect x="54" y="38" width="14" height="14" rx="1" fill="#dbeafe" stroke="#1e40af" stroke-width="1" />
      <circle cx="50" cy="58" r="10" fill="#f8fafc" stroke="#1e40af" stroke-width="1.2" />
      <text x="50" y="62" font-size="10" text-anchor="middle">⭐</text>
      <rect x="42" y="68" width="16" height="12" rx="1" fill="#0f172a" />
      <text x="50" y="80" font-size="8" text-anchor="middle">🚔</text>
    </svg>

    <svg v-else-if="type === 'fire_station'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="10" y="28" width="80" height="52" rx="3" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5" />
      <rect x="8" y="22" width="84" height="10" rx="1" fill="#7f1d1d" />
      <text x="50" y="30" font-size="5" font-weight="900" fill="#fff" text-anchor="middle">BOMBEROS</text>
      <rect x="14" y="40" width="28" height="28" rx="1" fill="#991b1b" stroke="#450a0a" stroke-width="1" />
      <text x="28" y="58" font-size="16" text-anchor="middle">🚒</text>
      <rect x="50" y="40" width="12" height="12" rx="1" fill="#fef2f2" stroke="#7f1d1d" stroke-width="0.8" />
      <rect x="66" y="40" width="12" height="12" rx="1" fill="#fef2f2" stroke="#7f1d1d" stroke-width="0.8" />
      <rect x="42" y="68" width="16" height="12" rx="1" fill="#450a0a" />
    </svg>

    <svg v-else-if="type === 'hospital'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="24" width="72" height="52" rx="3" fill="#fff" stroke="#be123c" stroke-width="1.6" />
      <rect x="10" y="18" width="80" height="10" rx="1" fill="#be123c" />
      <text x="50" y="25.5" font-size="6" font-weight="900" fill="#fff" text-anchor="middle">HOSPITAL</text>
      <g fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.6">
        <rect x="20" y="32" width="10" height="10" rx="1" /><rect x="34" y="32" width="10" height="10" rx="1" /><rect x="56" y="32" width="10" height="10" rx="1" /><rect x="70" y="32" width="10" height="10" rx="1" />
        <rect x="20" y="46" width="10" height="10" rx="1" /><rect x="34" y="46" width="10" height="10" rx="1" /><rect x="56" y="46" width="10" height="10" rx="1" /><rect x="70" y="46" width="10" height="10" rx="1" />
      </g>
      <circle cx="50" cy="46" r="9" fill="#dc2626" />
      <rect x="47" y="38" width="6" height="16" rx="1" fill="#fff" /><rect x="42" y="43" width="16" height="6" rx="1" fill="#fff" />
      <rect x="42" y="64" width="16" height="12" rx="1" fill="#be123c" />
    </svg>

    <svg v-else-if="type === 'gym'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="12" y="28" width="76" height="48" rx="3" fill="#57534e" stroke="#1c1917" stroke-width="1.4" />
      <rect x="10" y="22" width="80" height="10" rx="1" fill="#1c1917" />
      <text x="50" y="30" font-size="6" font-weight="900" fill="#facc15" text-anchor="middle">GYM</text>
      <text x="50" y="54" font-size="18" text-anchor="middle">🏋️</text>
      <rect x="20" y="62" width="12" height="6" rx="2" fill="#facc15" stroke="#92400e" stroke-width="0.7" />
      <rect x="68" y="62" width="12" height="6" rx="2" fill="#facc15" stroke="#92400e" stroke-width="0.7" />
      <circle cx="28" cy="65" r="3" fill="#1c1917" /><circle cx="72" cy="65" r="3" fill="#1c1917" />
    </svg>

    <svg v-else-if="type === 'courthouse'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="34" width="72" height="40" rx="2" fill="#e7e5e4" stroke="#57534e" stroke-width="1.4" />
      <path d="M10 36 L50 18 L90 36 Z" fill="#e7e5e4" stroke="#57534e" stroke-width="1.5" />
      <rect x="22" y="44" width="6" height="28" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="38" y="44" width="6" height="28" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="56" y="44" width="6" height="28" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="72" y="44" width="6" height="28" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <text x="50" y="30" font-size="7" text-anchor="middle">⚖️</text>
      <rect x="42" y="60" width="16" height="14" rx="1" fill="#1c1917" />
    </svg>

    <svg v-else-if="type === 'prison'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="8" y="20" width="84" height="60" rx="2" fill="#44403c" stroke="#1c1917" stroke-width="1.6" />
      <rect x="6" y="16" width="88" height="6" rx="1" fill="#1c1917" />
      <text x="50" y="21" font-size="3.5" fill="#a8a29e" text-anchor="middle" font-weight="800">CÁRCEL</text>
      <g stroke="#1c1917" stroke-width="1.2">
        <line x1="20" y1="28" x2="20" y2="72" /><line x1="28" y1="28" x2="28" y2="72" /><line x1="36" y1="28" x2="36" y2="72" />
        <line x1="64" y1="28" x2="64" y2="72" /><line x1="72" y1="28" x2="72" y2="72" /><line x1="80" y1="28" x2="80" y2="72" />
      </g>
      <rect x="42" y="40" width="16" height="20" rx="1" fill="#1c1917" />
      <rect x="44" y="44" width="3" height="12" rx="0.5" fill="#57534e" /><rect x="52" y="44" width="3" height="12" rx="0.5" fill="#57534e" />
      <circle cx="50" cy="74" r="2" fill="#292524" stroke="#1c1917" stroke-width="0.8" />
    </svg>

    <!-- 13b. MEGA — Ayuntamiento, Museo, Puerto, Solar, Financiero, Ópera -->
    <svg v-else-if="type === 'city_hall'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="12" y="32" width="76" height="42" rx="2" fill="#fefce8" stroke="#57534e" stroke-width="1.4" />
      <path d="M8 34 L50 16 L92 34 Z" fill="#e7e5e4" stroke="#57534e" stroke-width="1.4" />
      <rect x="22" y="42" width="6" height="24" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="38" y="42" width="6" height="24" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="56" y="42" width="6" height="24" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="72" y="42" width="6" height="24" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="0.8" />
      <rect x="42" y="56" width="16" height="18" rx="1" fill="#1e3a8a" stroke="#1e293b" stroke-width="1" />
      <circle cx="50" cy="24" r="4" fill="#facc15" stroke="#92400e" stroke-width="0.8" />
      <text x="50" y="14" font-size="4" fill="#57534e" text-anchor="middle" font-weight="800">AYUNTAMIENTO</text>
    </svg>

    <svg v-else-if="type === 'museum'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="10" y="30" width="80" height="44" rx="2" fill="#fef3c7" stroke="#92400e" stroke-width="1.4" />
      <path d="M6 32 L50 14 L94 32 Z" fill="#e7e5e4" stroke="#57534e" stroke-width="1.4" />
      <rect x="18" y="40" width="14" height="18" rx="1" fill="#fff" stroke="#57534e" stroke-width="0.8" />
      <rect x="38" y="40" width="10" height="18" rx="1" fill="#fff" stroke="#57534e" stroke-width="0.8" />
      <rect x="52" y="40" width="10" height="18" rx="1" fill="#fff" stroke="#57534e" stroke-width="0.8" />
      <rect x="68" y="40" width="14" height="18" rx="1" fill="#fff" stroke="#57534e" stroke-width="0.8" />
      <text x="50" y="52" font-size="7" text-anchor="middle">🖼️</text>
      <text x="50" y="68" font-size="4" fill="#92400e" text-anchor="middle" font-weight="800">MUSEO</text>
    </svg>

    <svg v-else-if="type === 'port'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="0" y="56" width="100" height="20" rx="1" fill="#0ea5e9" opacity="0.9" />
      <rect x="6" y="36" width="88" height="24" rx="1" fill="#78716c" stroke="#44403c" stroke-width="1.2" />
      <rect x="14" y="22" width="10" height="20" rx="1" fill="#facc15" stroke="#92400e" stroke-width="1" />
      <rect x="28" y="28" width="4" height="14" rx="1" fill="#57534e" />
      <rect x="64" y="22" width="10" height="20" rx="1" fill="#facc15" stroke="#92400e" stroke-width="1" />
      <text x="50" y="54" font-size="8" text-anchor="middle">⚓🚢</text>
      <text x="50" y="72" font-size="3" fill="#fff" text-anchor="middle" font-weight="700">PUERTO 5×2</text>
    </svg>

    <svg v-else-if="type === 'solar_farm'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="4" y="24" width="92" height="52" rx="2" fill="#fef9c3" stroke="#a16207" stroke-width="1.2" />
      <g fill="#1e293b" stroke="#0f172a" stroke-width="0.6">
        <rect x="12" y="32" width="22" height="12" rx="1" fill="#1e3a8a" /><rect x="38" y="32" width="22" height="12" rx="1" fill="#1e3a8a" /><rect x="64" y="32" width="22" height="12" rx="1" fill="#1e3a8a" />
        <rect x="12" y="48" width="22" height="12" rx="1" fill="#1e3a8a" /><rect x="38" y="48" width="22" height="12" rx="1" fill="#1e3a8a" /><rect x="64" y="48" width="22" height="12" rx="1" fill="#1e3a8a" />
      </g>
      <g fill="#38bdf8" opacity="0.3"><rect x="14" y="34" width="18" height="2" rx="0.5" /><rect x="40" y="34" width="18" height="2" rx="0.5" /></g>
      <text x="50" y="20" font-size="4" fill="#a16207" text-anchor="middle" font-weight="800">SOLAR ☀️ 32⚡</text>
    </svg>

    <svg v-else-if="type === 'financial_district'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="4" y="14" width="92" height="70" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
      <rect x="10" y="22" width="18" height="48" rx="1" fill="#334155" stroke="#e2e8f0" stroke-width="0.8" />
      <rect x="30" y="14" width="20" height="56" rx="1" fill="#475569" stroke="#e2e8f0" stroke-width="0.8" />
      <rect x="52" y="18" width="18" height="52" rx="1" fill="#1e293b" stroke="#e2e8f0" stroke-width="0.8" />
      <rect x="72" y="26" width="16" height="44" rx="1" fill="#0f172a" stroke="#38bdf8" stroke-width="0.8" />
      <g fill="#7dd3fc" opacity="0.7"><rect x="12" y="28" width="14" height="2" /><rect x="32" y="22" width="16" height="2" /><rect x="54" y="24" width="14" height="2" /></g>
      <text x="50" y="80" font-size="4" fill="#7dd3fc" text-anchor="middle" font-weight="800">FINANCIERO 4×4</text>
    </svg>

    <svg v-else-if="type === 'opera'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="62" rx="36" ry="16" fill="#f8fafc" stroke="#a8a29e" stroke-width="1.2" />
      <path d="M14 62 A36 16 0 0 1 86 62" fill="#e7e5e4" stroke="#57534e" stroke-width="1" />
      <rect x="38" y="42" width="24" height="20" rx="8" fill="#1c1917" />
      <text x="50" y="56" font-size="8" text-anchor="middle">🎭</text>
      <circle cx="30" cy="52" r="3" fill="#facc15" /><circle cx="70" cy="52" r="3" fill="#facc15" />
      <text x="50" y="78" font-size="4" fill="#57534e" text-anchor="middle" font-weight="800">ÓPERA</text>
    </svg>

    <svg v-else-if="type === 'olympic_stadium'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="54" rx="44" ry="30" fill="#e0f2fe" stroke="#1e40af" stroke-width="1.6" />
      <ellipse cx="50" cy="54" rx="32" ry="18" fill="#22c55e" stroke="#fff" stroke-width="1" />
      <ellipse cx="50" cy="54" rx="32" ry="18" fill="none" stroke="#fff" stroke-width="0.6" stroke-dasharray="3 3" />
      <circle cx="50" cy="54" r="2" fill="#fff" />
      <g fill="none" stroke="#1e40af" stroke-width="1"><circle cx="38" cy="72" r="6" /><circle cx="46" cy="72" r="6" /><circle cx="54" cy="72" r="6" /><circle cx="62" cy="72" r="6" /><circle cx="42" cy="78" r="6" /><circle cx="50" cy="78" r="6" /><circle cx="58" cy="78" r="6" /></g>
      <g fill="#facc15"><circle cx="41" cy="72" r="1.5" /><circle cx="49" cy="72" r="1.5" /><circle cx="57" cy="72" r="1.5" /></g>
      <text x="50" y="16" font-size="4" fill="#1e40af" text-anchor="middle" font-weight="900">OLÍMPICO 5×5</text>
    </svg>

    <svg v-else-if="type === 'nuclear_plant'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="6" y="18" width="88" height="60" rx="2" fill="#1f2937" stroke="#facc15" stroke-width="1.4" />
      <path d="M16 76 L24 24 L40 24 L48 76 Z" fill="#9ca3af" stroke="#facc15" stroke-width="1.2" />
      <path d="M52 76 L60 24 L76 24 L84 76 Z" fill="#9ca3af" stroke="#facc15" stroke-width="1.2" />
      <circle cx="32" cy="30" r="6" fill="#facc15" opacity="0.9" /><text x="32" y="32" font-size="6" text-anchor="middle">☢️</text>
      <text x="50" y="88" font-size="4" fill="#facc15" text-anchor="middle" font-weight="800">NUCLEAR 4×4 +55⚡</text>
    </svg>

    <svg v-else-if="type === 'intl_airport'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="4" y="38" width="92" height="22" rx="2" fill="#334155" stroke="#e2e8f0" stroke-width="1.2" />
      <g stroke="#fff" stroke-width="1" stroke-dasharray="8 4"><line x1="8" y1="49" x2="96" y2="49" /></g>
      <rect x="12" y="18" width="32" height="16" rx="1" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" />
      <rect x="56" y="18" width="32" height="16" rx="1" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" />
      <text x="28" y="28" font-size="4" fill="#0284c7" text-anchor="middle" font-weight="800">TERMINAL A</text>
      <text x="72" y="28" font-size="4" fill="#0284c7" text-anchor="middle" font-weight="800">TERMINAL B</text>
      <g transform="translate(18,42)"><ellipse cx="8" cy="6" rx="4" ry="2" fill="#fff" /><rect x="4" y="4" width="8" height="4" fill="#ef4444" /></g>
      <g transform="translate(72,42)"><ellipse cx="8" cy="6" rx="4" ry="2" fill="#fff" /><rect x="4" y="4" width="8" height="4" fill="#22c55e" /></g>
      <text x="50" y="72" font-size="3.5" fill="#e2e8f0" text-anchor="middle" font-weight="700">INTL 5×3 ✈️</text>
    </svg>

    <!-- 13b. MONUMENTOS MUNDIALES CON BANDERAS REALES -->
    <svg v-else-if="type === 'eiffel'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="4" y="70" width="92" height="10" rx="2" fill="#78716c" />
      <path d="M50 12 L42 28 L30 78 L70 78 L58 28 Z" fill="none" stroke="#44403c" stroke-width="2.5" />
      <path d="M46 28 L54 28 L52 40 L48 40 Z" fill="#a8a29e" />
      <rect x="36" y="48" width="28" height="4" rx="1" fill="#57534e" /><rect x="28" y="64" width="44" height="4" rx="1" fill="#57534e" />
      <!-- bandera Francia -->
      <g transform="translate(68,8)"><rect x="0" y="0" width="6" height="10" fill="#002395" /><rect x="6" y="0" width="6" height="10" fill="#fff" /><rect x="12" y="0" width="6" height="10" fill="#ed2939" /></g>
      <text x="50" y="88" font-size="4" fill="#002395" text-anchor="middle" font-weight="800">EIFFEL 🇫🇷</text>
    </svg>

    <svg v-else-if="type === 'liberty'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="36" y="62" width="28" height="14" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="1" />
      <rect x="44" y="48" width="12" height="18" rx="1" fill="#2dd4bf" stroke="#0f766e" stroke-width="1" />
      <circle cx="50" cy="38" r="8" fill="#fde68a" stroke="#a16207" stroke-width="1" />
      <path d="M50 30 L48 22 L52 22 Z" fill="#a16207" />
      <text x="50" y="76" font-size="8" text-anchor="middle">🗽</text>
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="10" fill="#b22234" /><g fill="#fff"><rect x="0" y="1" width="18" height="1" /><rect x="0" y="3" width="18" height="1" /><rect x="0" y="5" width="18" height="1" /><rect x="0" y="7" width="18" height="1" /></g><rect x="0" y="0" width="8" height="5" fill="#3c3b6e" /></g>
      <text x="50" y="92" font-size="3.5" fill="#0f766e" text-anchor="middle" font-weight="800">LIBERTY 🇺🇸</text>
    </svg>

    <svg v-else-if="type === 'big_ben'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="38" y="18" width="24" height="60" rx="1" fill="#a16207" stroke="#78350f" stroke-width="1.4" />
      <rect x="36" y="14" width="28" height="6" rx="1" fill="#78350f" />
      <circle cx="50" cy="34" r="8" fill="#fefce8" stroke="#1c1917" stroke-width="1" />
      <line x1="50" y1="34" x2="50" y2="28" stroke="#000" stroke-width="1" /><line x1="50" y1="34" x2="54" y2="34" stroke="#000" stroke-width="1" />
      <rect x="34" y="78" width="32" height="6" rx="1" fill="#57534e" />
      <g transform="translate(72,8)"><rect x="0" y="0" width="6" height="14" fill="#012169" /><path d="M0 0 L6 7 L0 14 Z" fill="#c8102e" /><rect x="0" y="6" width="18" height="2" fill="#fff" /><rect x="8" y="0" width="2" height="14" fill="#fff" /></g>
      <text x="50" y="92" font-size="3.5" fill="#78350f" text-anchor="middle" font-weight="800">BIG BEN 🇬🇧</text>
    </svg>

    <svg v-else-if="type === 'christ_rio'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="72" rx="24" ry="6" fill="#78716c" />
      <rect x="46" y="44" width="8" height="28" rx="1" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" />
      <rect x="28" y="50" width="44" height="8" rx="1" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" />
      <circle cx="50" cy="38" r="6" fill="#ffdbac" stroke="#a16207" stroke-width="0.8" />
      <g transform="translate(68,6)"><rect x="0" y="0" width="18" height="12" fill="#009739" /><path d="M0 6 L9 12 L18 6 L18 12 L0 12 Z" fill="#ffdf00" /><circle cx="9" cy="6" r="3" fill="#002776" /></g>
      <text x="50" y="88" font-size="3.5" fill="#57534e" text-anchor="middle" font-weight="700">CRISTO 🇧🇷</text>
    </svg>

    <svg v-else-if="type === 'colosseum'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="68" rx="36" ry="12" fill="#a16207" stroke="#78350f" stroke-width="1.2" />
      <ellipse cx="50" cy="62" rx="30" ry="8" fill="#57534e" />
      <ellipse cx="50" cy="62" rx="30" ry="8" fill="none" stroke="#d6d3d1" stroke-width="0.8" stroke-dasharray="3 3" />
      <rect x="18" y="40" width="64" height="18" rx="8" fill="#d6d3d1" stroke="#a8a29e" stroke-width="1" />
      <g fill="#1c1917" opacity="0.9"><rect x="26" y="46" width="4" height="8" rx="1" /><rect x="36" y="46" width="4" height="8" rx="1" /><rect x="48" y="46" width="4" height="8" rx="1" /><rect x="60" y="46" width="4" height="8" rx="1" /><rect x="70" y="46" width="4" height="8" rx="1" /></g>
      <g transform="translate(70,6)"><rect x="0" y="0" width="6" height="12" fill="#009246" /><rect x="6" y="0" width="6" height="12" fill="#fff" /><rect x="12" y="0" width="6" height="12" fill="#ce2b37" /></g>
      <text x="50" y="84" font-size="4" fill="#78350f" text-anchor="middle" font-weight="800">COLISEO 🇮🇹</text>
    </svg>

    <svg v-else-if="type === 'taj_mahal'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="52" width="72" height="22" rx="1" fill="#f5f5f4" stroke="#a8a29e" stroke-width="1.2" />
      <circle cx="50" cy="38" r="14" fill="#fefce8" stroke="#d6d3d1" stroke-width="1" />
      <rect x="22" y="36" width="8" height="16" rx="4" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <rect x="70" y="36" width="8" height="16" rx="4" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <rect x="46" y="24" width="8" height="10" rx="1" fill="#fefce8" stroke="#a8a29e" stroke-width="0.8" />
      <rect x="48" y="18" width="4" height="8" fill="#a16207" />
      <g transform="translate(68,6)"><rect x="0" y="0" width="18" height="4" fill="#ff9933" /><rect x="0" y="4" width="18" height="4" fill="#fff" /><rect x="0" y="8" width="18" height="4" fill="#138808" /><circle cx="9" cy="6" r="1.5" fill="#000080" /></g>
      <text x="50" y="88" font-size="3.5" fill="#a8a29e" text-anchor="middle" font-weight="700">TAJ MAHAL 🇮🇳</text>
    </svg>

    <svg v-else-if="type === 'great_wall'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="4" y="52" width="92" height="12" rx="1" fill="#a16207" stroke="#78350f" stroke-width="1.2" />
      <g fill="#78350f"><rect x="12" y="46" width="8" height="8" rx="1" /><rect x="28" y="46" width="8" height="8" rx="1" /><rect x="44" y="46" width="8" height="8" rx="1" /><rect x="60" y="46" width="8" height="8" rx="1" /><rect x="76" y="46" width="8" height="8" rx="1" /></g>
      <rect x="46" y="38" width="8" height="14" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="1" />
      <g transform="translate(68,6)"><rect x="0" y="0" width="18" height="12" fill="#de2910" /><g fill="#ffde00"><circle cx="4" cy="3" r="1.2" /><circle cx="7" cy="1.5" r="0.6" /><circle cx="8.5" cy="3" r="0.6" /><circle cx="8" cy="5" r="0.6" /></g></g>
      <text x="50" y="76" font-size="4" fill="#78350f" text-anchor="middle" font-weight="800">MURALLA 🇨🇳</text>
    </svg>

    <svg v-else-if="type === 'pyramid'" viewBox="0 0 100 100" class="w-full h-full">
      <path d="M10 72 L50 18 L90 72 Z" fill="#eab308" stroke="#a16207" stroke-width="1.4" />
      <path d="M50 18 L50 72" stroke="#a16207" stroke-width="0.8" opacity="0.6" />
      <g stroke="#a16207" stroke-width="0.6" opacity="0.5"><line x1="22" y1="48" x2="78" y2="48" /><line x1="30" y1="60" x2="70" y2="60" /></g>
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="6" fill="#ce1126" /><rect x="0" y="6" width="18" height="6" fill="#fff" /><rect x="0" y="12" width="18" height="6" fill="#000" /><circle cx="9" cy="9" r="2" fill="#c09300" /></g>
      <text x="50" y="84" font-size="4" fill="#92400e" text-anchor="middle" font-weight="800">PIRÁMIDE 🇪🇬</text>
    </svg>

    <svg v-else-if="type === 'chichen'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="12" y="62" width="76" height="10" rx="1" fill="#a16207" />
      <rect x="18" y="52" width="64" height="12" rx="1" fill="#d6a76a" stroke="#78350f" stroke-width="1" />
      <rect x="24" y="42" width="52" height="12" rx="1" fill="#e7b78a" stroke="#78350f" stroke-width="1" />
      <rect x="32" y="32" width="36" height="12" rx="1" fill="#f0d0a0" stroke="#78350f" stroke-width="1" />
      <rect x="40" y="24" width="20" height="10" rx="1" fill="#a16207" />
      <text x="50" y="28" font-size="4" fill="#fff" text-anchor="middle">◼</text>
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="6" fill="#006847" /><rect x="0" y="6" width="18" height="6" fill="#fff" /><rect x="0" y="12" width="18" height="6" fill="#ce1126" /><circle cx="9" cy="9" r="2" fill="#6a2c1e" /></g>
      <text x="50" y="84" font-size="3.5" fill="#78350f" text-anchor="middle" font-weight="800">CHICHÉN 🇲🇽</text>
    </svg>

    <svg v-else-if="type === 'monserrate'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="68" rx="28" ry="6" fill="#78716c" />
      <rect x="38" y="32" width="24" height="18" rx="1" fill="#fefce8" stroke="#a8a29e" stroke-width="1.2" />
      <path d="M36 34 L50 22 L64 34 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1" />
      <rect x="46" y="42" width="8" height="10" rx="1" fill="#1c1917" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="4" fill="#ffcd00" /><rect x="0" y="4" width="18" height="4" fill="#003893" /><rect x="0" y="8" width="18" height="4" fill="#ce1126" /></g>
      <text x="50" y="82" font-size="3.5" fill="#57534e" text-anchor="middle" font-weight="700">MONSERRATE 🇨🇴</text>
    </svg>

    <svg v-else-if="type === 'machu'" viewBox="0 0 100 100" class="w-full h-full">
      <path d="M10 66 L30 36 L50 48 L70 32 L90 66 Z" fill="#a8a29e" stroke="#57534e" stroke-width="1.2" />
      <rect x="22" y="48" width="12" height="8" rx="1" fill="#d6a76a" stroke="#78350f" stroke-width="0.8" />
      <rect x="38" y="44" width="10" height="6" rx="1" fill="#d6a76a" stroke="#78350f" stroke-width="0.8" />
      <rect x="60" y="42" width="12" height="8" rx="1" fill="#d6a76a" stroke="#78350f" stroke-width="0.8" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="6" fill="#d91023" /><rect x="0" y="6" width="18" height="6" fill="#fff" /></g>
      <text x="50" y="84" font-size="3.5" fill="#57534e" text-anchor="middle" font-weight="700">MACHU 🇵🇪</text>
    </svg>

    <svg v-else-if="type === 'obelisco_ar'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="42" y="64" width="16" height="4" rx="1" fill="#57534e" />
      <path d="M46 64 L50 14 L54 64 Z" fill="#e7e5e4" stroke="#57534e" stroke-width="1.2" />
      <circle cx="50" cy="12" r="2" fill="#facc15" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="4" fill="#74acdf" /><rect x="0" y="4" width="18" height="4" fill="#fff" /><rect x="0" y="8" width="18" height="4" fill="#74acdf" /><circle cx="9" cy="6" r="2" fill="#f6b40a" /></g>
      <text x="50" y="80" font-size="3.5" fill="#57534e" text-anchor="middle" font-weight="800">OBELISCO 🇦🇷</text>
    </svg>

    <svg v-else-if="type === 'torii'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="18" y="28" width="64" height="6" rx="1" fill="#dc2626" stroke="#7f1d1d" stroke-width="1" />
      <rect x="22" y="36" width="56" height="4" rx="1" fill="#dc2626" />
      <rect x="24" y="36" width="6" height="36" rx="1" fill="#991b1b" />
      <rect x="70" y="36" width="6" height="36" rx="1" fill="#991b1b" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="12" fill="#fff" /><circle cx="9" cy="6" r="3.5" fill="#bc002d" /></g>
      <text x="50" y="84" font-size="4" fill="#7f1d1d" text-anchor="middle" font-weight="800">TORII 🇯🇵</text>
    </svg>

    <svg v-else-if="type === 'palace_kr'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="48" width="72" height="20" rx="1" fill="#0f766e" stroke="#134e4a" stroke-width="1.2" />
      <path d="M10 50 L50 30 L90 50 Z" fill="#1e3a5a" stroke="#0f172a" stroke-width="1.2" />
      <path d="M14 34 L50 18 L86 34 Z" fill="#1e3a5a" stroke="#0f172a" stroke-width="1" />
      <rect x="42" y="58" width="16" height="10" rx="1" fill="#7f1d1d" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="12" fill="#fff" /><circle cx="9" cy="6" r="3" fill="#0047a0" /><circle cx="9" cy="6" r="3" fill="none" stroke="#cd2e3a" stroke-width="0.8" /></g>
      <text x="50" y="80" font-size="3" fill="#0f766e" text-anchor="middle" font-weight="700">GYEONGBOK 🇰🇷</text>
    </svg>

    <svg v-else-if="type === 'wat_thai'" viewBox="0 0 100 100" class="w-full h-full">
      <path d="M50 16 L62 36 L58 36 L58 68 L42 68 L42 36 L38 36 Z" fill="#f59e0b" stroke="#92400e" stroke-width="1.2" />
      <path d="M50 16 L50 36" stroke="#92400e" stroke-width="0.8" />
      <circle cx="50" cy="14" r="2" fill="#facc15" />
      <rect x="20" y="58" width="14" height="10" rx="1" fill="#fde68a" stroke="#92400e" stroke-width="0.8" />
      <rect x="66" y="58" width="14" height="10" rx="1" fill="#fde68a" stroke="#92400e" stroke-width="0.8" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="2" fill="#ed1c24" /><rect x="0" y="2" width="18" height="2" fill="#fff" /><rect x="0" y="4" width="18" height="2" fill="#241d4f" /><rect x="0" y="6" width="18" height="2" fill="#fff" /><rect x="0" y="8" width="18" height="2" fill="#ed1c24" /></g>
      <text x="50" y="82" font-size="3.5" fill="#92400e" text-anchor="middle" font-weight="700">WAT 🇹🇭</text>
    </svg>

    <svg v-else-if="type === 'table_za'" viewBox="0 0 100 100" class="w-full h-full">
      <path d="M12 48 L28 28 L72 28 L88 48 Z" fill="#a8a29e" stroke="#57534e" stroke-width="1.2" />
      <rect x="12" y="48" width="76" height="14" rx="1" fill="#78716c" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="3" height="12" fill="#000" /><rect x="3" y="0" width="3" height="12" fill="#007a4d" /><rect x="6" y="0" width="3" height="12" fill="#ffb612" /><rect x="9" y="0" width="3" height="12" fill="#fff" /><rect x="12" y="0" width="3" height="12" fill="#de3831" /><rect x="15" y="0" width="3" height="12" fill="#007a4d" /></g>
      <text x="50" y="76" font-size="3.5" fill="#57534e" text-anchor="middle" font-weight="700">TABLE 🇿🇦</text>
    </svg>

    <svg v-else-if="type === 'hassan_ma'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="40" y="18" width="20" height="52" rx="1" fill="#c19a6b" stroke="#78350f" stroke-width="1.2" />
      <rect x="44" y="26" width="4" height="6" rx="0.5" fill="#1c1917" /><rect x="52" y="26" width="4" height="6" rx="0.5" fill="#1c1917" />
      <rect x="44" y="38" width="4" height="6" rx="0.5" fill="#1c1917" /><rect x="52" y="38" width="4" height="6" rx="0.5" fill="#1c1917" />
      <rect x="38" y="70" width="24" height="6" rx="1" fill="#78716c" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="6" fill="#c1272d" /><rect x="0" y="6" width="18" height="6" fill="#006233" /><circle cx="9" cy="6" r="2" fill="none" stroke="#fff" stroke-width="0.8" /></g>
      <text x="50" y="88" font-size="3.5" fill="#78350f" text-anchor="middle" font-weight="700">HASSAN 🇲🇦</text>
    </svg>

    <svg v-else-if="type === 'gate_de'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="10" y="36" width="80" height="28" rx="1" fill="#d6d3d1" stroke="#57534e" stroke-width="1.2" />
      <rect x="18" y="40" width="6" height="20" rx="1" fill="#57534e" /><rect x="34" y="40" width="6" height="20" rx="1" fill="#57534e" /><rect x="60" y="40" width="6" height="20" rx="1" fill="#57534e" /><rect x="76" y="40" width="6" height="20" rx="1" fill="#57534e" />
      <rect x="42" y="44" width="16" height="16" rx="1" fill="#1c1917" />
      <text x="50" y="32" font-size="6" text-anchor="middle">🏛️</text>
      <g transform="translate(70,6)"><rect x="0" y="0" width="6" height="12" fill="#000" /><rect x="6" y="0" width="6" height="12" fill="#dd0000" /><rect x="12" y="0" width="6" height="12" fill="#ffce00" /></g>
      <text x="50" y="78" font-size="3.5" fill="#57534e" text-anchor="middle" font-weight="700">BRANDENBURGO 🇩🇪</text>
    </svg>

    <svg v-else-if="type === 'sagrada_es'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="20" y="36" width="60" height="32" rx="2" fill="#fefce8" stroke="#a16207" stroke-width="1.2" />
      <rect x="28" y="18" width="6" height="20" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="0.8" />
      <rect x="40" y="14" width="6" height="24" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="0.8" />
      <rect x="54" y="14" width="6" height="24" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="0.8" />
      <rect x="66" y="18" width="6" height="20" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="0.8" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="18" height="3" fill="#aa151b" /><rect x="0" y="3" width="18" height="6" fill="#f1bf00" /><rect x="0" y="9" width="18" height="3" fill="#aa151b" /></g>
      <text x="50" y="62" font-size="4" fill="#a16207" text-anchor="middle">SAGRADA</text>
    </svg>

    <svg v-else-if="type === 'parthenon_gr'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="12" y="58" width="76" height="6" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="1" />
      <rect x="16" y="36" width="6" height="24" rx="1" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <rect x="28" y="36" width="6" height="24" rx="1" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <rect x="40" y="36" width="6" height="24" rx="1" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <rect x="54" y="36" width="6" height="24" rx="1" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <rect x="66" y="36" width="6" height="24" rx="1" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <rect x="78" y="36" width="6" height="24" rx="1" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <path d="M10 36 L50 20 L90 36 Z" fill="#e7e5e4" stroke="#57534e" stroke-width="1.2" />
      <g transform="translate(70,6)"><rect x="0" y="0" width="2" height="12" fill="#0d5eaf" /><rect x="2" y="0" width="2" height="12" fill="#fff" /><rect x="4" y="0" width="2" height="12" fill="#0d5eaf" /><rect x="6" y="0" width="2" height="12" fill="#fff" /><rect x="8" y="0" width="2" height="12" fill="#0d5eaf" /><rect x="10" y="0" width="2" height="12" fill="#fff" /><rect x="12" y="0" width="2" height="12" fill="#0d5eaf" /><rect x="14" y="0" width="2" height="12" fill="#fff" /><rect x="16" y="0" width="2" height="12" fill="#0d5eaf" /></g>
      <text x="50" y="78" font-size="3.5" fill="#57534e" text-anchor="middle" font-weight="700">PARTENÓN 🇬🇷</text>
    </svg>

    <!-- 14. IGLESIAS / CASTILLOS / MONUMENTOS / INFRA -->
    <svg v-else-if="type === 'church'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="18" y="36" width="64" height="38" rx="2" fill="#fefce8" stroke="#a16207" stroke-width="1.4" />
      <path d="M14 38 L50 18 L86 38 Z" fill="#e7e5e4" stroke="#57534e" stroke-width="1.4" />
      <rect x="46" y="10" width="8" height="16" rx="1" fill="#57534e" />
      <rect x="48" y="6" width="4" height="8" rx="0.5" fill="#57534e" /><rect x="45" y="8" width="10" height="3" rx="0.5" fill="#57534e" />
      <rect x="28" y="46" width="10" height="12" rx="1" fill="#dbeafe" stroke="#57534e" stroke-width="0.8" />
      <rect x="62" y="46" width="10" height="12" rx="1" fill="#dbeafe" stroke="#57534e" stroke-width="0.8" />
      <rect x="42" y="58" width="16" height="16" rx="1" fill="#1c1917" />
      <text x="50" y="14" font-size="5" text-anchor="middle">✝️</text>
    </svg>

    <svg v-else-if="type === 'cathedral'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="12" y="34" width="76" height="44" rx="3" fill="#fefce8" stroke="#57534e" stroke-width="1.4" />
      <rect x="16" y="18" width="14" height="24" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="1" />
      <rect x="70" y="18" width="14" height="24" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="1" />
      <rect x="19" y="12" width="8" height="8" rx="1" fill="#57534e" /><rect x="73" y="12" width="8" height="8" rx="1" fill="#57534e" />
      <rect x="22" y="8" width="2" height="6" rx="0.5" fill="#57534e" /><rect x="76" y="8" width="2" height="6" rx="0.5" fill="#57534e" />
      <path d="M10 36 L50 16 L90 36 Z" fill="#d6d3d1" stroke="#57534e" stroke-width="1.2" />
      <circle cx="50" cy="28" r="5" fill="#dbeafe" stroke="#57534e" stroke-width="1" />
      <rect x="42" y="56" width="16" height="22" rx="1" fill="#1c1917" />
    </svg>

    <svg v-else-if="type === 'castle'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="8" y="36" width="84" height="48" rx="2" fill="#d6d3d1" stroke="#57534e" stroke-width="1.4" />
      <rect x="8" y="20" width="14" height="20" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="1" />
      <rect x="78" y="20" width="14" height="20" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="1" />
      <rect x="38" y="14" width="24" height="26" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="1.2" />
      <rect x="12" y="14" width="6" height="4" rx="0.5" fill="#57534e" /><rect x="82" y="14" width="6" height="4" rx="0.5" fill="#57534e" />
      <rect x="42" y="8" width="6" height="4" rx="0.5" fill="#57534e" /><rect x="52" y="8" width="6" height="4" rx="0.5" fill="#57534e" />
      <rect x="42" y="54" width="16" height="22" rx="1" fill="#1c1917" />
      <text x="50" y="32" font-size="8" text-anchor="middle">🏰</text>
    </svg>

    <svg v-else-if="type === 'monument'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="78" rx="18" ry="4" fill="#000" opacity="0.2" />
      <rect x="38" y="64" width="24" height="6" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="1" />
      <rect x="42" y="58" width="16" height="8" rx="1" fill="#d6d3d1" stroke="#57534e" stroke-width="1" />
      <path d="M44 58 L50 20 L56 58 Z" fill="#e7e5e4" stroke="#57534e" stroke-width="1" />
      <circle cx="50" cy="16" r="4" fill="#facc15" stroke="#92400e" stroke-width="1" />
      <text x="50" y="54" font-size="6" text-anchor="middle">★</text>
    </svg>

    <svg v-else-if="type === 'obelisk'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="80" rx="14" ry="3" fill="#000" opacity="0.2" />
      <rect x="42" y="64" width="16" height="4" rx="1" fill="#57534e" />
      <path d="M46 64 L50 18 L54 64 Z" fill="#d6d3d1" stroke="#57534e" stroke-width="1" />
      <circle cx="50" cy="14" r="2" fill="#facc15" />
    </svg>

    <svg v-else-if="type === 'arch'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="12" y="48" width="16" height="28" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="1.2" />
      <rect x="72" y="48" width="16" height="28" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="1.2" />
      <path d="M12 48 A38 38 0 0 1 88 48" fill="none" stroke="#d6d3d1" stroke-width="10" />
      <path d="M12 48 A38 38 0 0 1 88 48" fill="none" stroke="#57534e" stroke-width="1.5" />
      <text x="50" y="42" font-size="6" text-anchor="middle">⛩️</text>
    </svg>

    <svg v-else-if="type === 'memorial'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="8" y="62" width="84" height="16" rx="2" fill="#57534e" stroke="#1c1917" stroke-width="1" />
      <rect x="36" y="32" width="28" height="32" rx="1" fill="#e7e5e4" stroke="#57534e" stroke-width="1.2" />
      <text x="50" y="52" font-size="10" text-anchor="middle">🪦</text>
      <circle cx="30" cy="72" r="3" fill="#22c55e" /><circle cx="70" cy="72" r="3" fill="#22c55e" />
    </svg>

    <svg v-else-if="type === 'fountain'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="74" rx="30" ry="10" fill="#60a5fa" stroke="#0284c7" stroke-width="1" />
      <ellipse cx="50" cy="74" rx="22" ry="6" fill="#38bdf8" />
      <rect x="48" y="40" width="4" height="34" rx="1" fill="#a8a29e" />
      <circle cx="50" cy="36" r="4" fill="#fefce8" stroke="#a8a29e" stroke-width="1" />
      <path d="M46 36 Q50 28 54 36" fill="none" stroke="#38bdf8" stroke-width="1.2" />
      <text x="50" cy="50" font-size="6" text-anchor="middle">⛲</text>
    </svg>

    <svg v-else-if="type === 'lighthouse'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="84" rx="14" ry="4" fill="#000" opacity="0.2" />
      <rect x="42" y="22" width="16" height="56" rx="8" fill="#fefce8" stroke="#a16207" stroke-width="1.2" />
      <rect x="42" y="38" width="16" height="6" rx="1" fill="#dc2626" />
      <rect x="42" y="52" width="16" height="6" rx="1" fill="#dc2626" />
      <rect x="38" y="14" width="24" height="12" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="1.2" />
      <rect x="40" y="16" width="20" height="6" rx="1" fill="#fde68a" opacity="0.9" />
      <circle cx="50" cy="10" r="2" fill="#facc15" opacity="0.9" />
    </svg>

    <svg v-else-if="type === 'dam'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="0" y="56" width="100" height="24" rx="2" fill="#60a5fa" opacity="0.9" />
      <rect x="6" y="36" width="88" height="28" rx="2" fill="#78716c" stroke="#44403c" stroke-width="1.4" />
      <rect x="12" y="30" width="76" height="8" rx="1" fill="#a8a29e" />
      <text x="50" y="54" font-size="8" font-weight="800" fill="#fff" text-anchor="middle">PRESA</text>
      <rect x="46" y="48" width="8" height="16" rx="1" fill="#1c1917" />
    </svg>

    <svg v-else-if="type === 'wind_turbine'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="48" y="32" width="4" height="48" rx="2" fill="#e7e5e4" stroke="#57534e" stroke-width="1" />
      <circle cx="50" cy="30" r="4" fill="#1c1917" />
      <g stroke="#1c1917" stroke-width="1.5" stroke-linecap="round">
        <line x1="50" y1="30" x2="50" y2="12" /><line x1="50" y1="30" x2="36" y2="40" /><line x1="50" y1="30" x2="64" y2="40" />
      </g>
      <circle cx="50" cy="30" r="1.5" fill="#f8fafc" />
      <text x="50" y="88" font-size="4" fill="#0ea5e9" text-anchor="middle" font-weight="700">EÓLICA</text>
    </svg>

    <svg v-else-if="type === 'factory'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="8" y="36" width="84" height="36" rx="1" fill="#78716c" stroke="#44403c" stroke-width="1.2" />
      <rect x="14" y="24" width="12" height="16" rx="1" fill="#57534e" /><rect x="30" y="20" width="10" height="20" rx="1" fill="#57534e" /><rect x="44" y="26" width="8" height="14" rx="1" fill="#57534e" />
      <circle cx="20" cy="18" r="3" fill="#57534e" opacity="0.5" /><circle cx="35" cy="14" r="4" fill="#57534e" opacity="0.4" />
      <rect x="18" y="48" width="10" height="10" rx="1" fill="#1c1917" /><rect x="32" y="48" width="10" height="10" rx="1" fill="#1c1917" />
      <text x="50" y="66" font-size="6" text-anchor="middle">🏭</text>
    </svg>

    <svg v-else-if="type === 'warehouse'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="32" width="72" height="38" rx="2" fill="#a8a29e" stroke="#57534e" stroke-width="1.2" />
      <path d="M10 34 L50 18 L90 34 Z" fill="#78716c" stroke="#44403c" stroke-width="1" />
      <rect x="28" y="44" width="14" height="18" rx="1" fill="#57534e" /><rect x="58" y="44" width="14" height="18" rx="1" fill="#57534e" />
      <text x="50" y="56" font-size="8" text-anchor="middle">📦</text>
    </svg>

    <svg v-else-if="type === 'telecom_tower'" viewBox="0 0 100 100" class="w-full h-full">
      <path d="M50 16 L38 80 L62 80 Z" fill="none" stroke="#57534e" stroke-width="2" />
      <line x1="42" y1="32" x2="58" y2="32" stroke="#57534e" stroke-width="1.5" /><line x1="40" y1="48" x2="60" y2="48" stroke="#57534e" stroke-width="1.5" /><line x1="38" y1="64" x2="62" y2="64" stroke="#57534e" stroke-width="1.5" />
      <circle cx="50" cy="14" r="3" fill="#ef4444" opacity="0.9" />
      <path d="M50 14 L46 8 L54 8 Z" fill="#facc15" />
    </svg>

    <svg v-else-if="type === 'data_center'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="12" y="28" width="76" height="44" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
      <g fill="#1e293b" stroke="#475569" stroke-width="0.6"><rect x="18" y="36" width="12" height="18" rx="1" /><rect x="34" y="36" width="12" height="18" rx="1" /><rect x="52" y="36" width="12" height="18" rx="1" /><rect x="68" y="36" width="12" height="18" rx="1" /></g>
      <g fill="#22d3ee" opacity="0.8"><circle cx="24" cy="42" r="1" /><circle cx="40" cy="42" r="1" /><circle cx="58" cy="42" r="1" /></g>
      <text x="50" y="66" font-size="5" fill="#22d3ee" text-anchor="middle">💾 DATA</text>
    </svg>

    <svg v-else-if="type === 'sewage_plant'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="34" cy="52" rx="18" ry="14" fill="#78716c" stroke="#44403c" stroke-width="1.2" />
      <ellipse cx="66" cy="52" rx="18" ry="14" fill="#78716c" stroke="#44403c" stroke-width="1.2" />
      <ellipse cx="34" cy="42" rx="18" ry="6" fill="#a8a29e" /><ellipse cx="66" cy="42" rx="18" ry="6" fill="#a8a29e" />
      <rect x="30" y="28" width="40" height="8" rx="1" fill="#57534e" />
      <text x="50" y="66" font-size="6" text-anchor="middle">🚿</text>
    </svg>

    <svg v-else-if="type === 'recycling_plant'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="32" width="72" height="36" rx="2" fill="#16a34a" stroke="#14532d" stroke-width="1.2" />
      <text x="50" y="52" font-size="16" text-anchor="middle">♻️</text>
      <rect x="20" y="62" width="60" height="6" rx="1" fill="#14532d" />
      <circle cx="30" cy="40" r="2" fill="#fff" opacity="0.6" />
    </svg>

    <svg v-else-if="type === 'library'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="14" y="34" width="72" height="34" rx="2" fill="#fef3c7" stroke="#92400e" stroke-width="1.2" />
      <rect x="18" y="40" width="10" height="16" rx="1" fill="#92400e" /><rect x="32" y="40" width="10" height="16" rx="1" fill="#b45309" /><rect x="46" y="40" width="10" height="16" rx="1" fill="#92400e" /><rect x="60" y="40" width="10" height="16" rx="1" fill="#b45309" /><rect x="74" y="40" width="8" height="16" rx="1" fill="#92400e" />
      <path d="M10 34 L50 18 L90 34 Z" fill="#92400e" stroke="#78350f" stroke-width="1" />
      <text x="50" y="62" font-size="6" text-anchor="middle">📚</text>
    </svg>

    <svg v-else-if="type === 'convention_center'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="6" y="28" width="88" height="44" rx="3" fill="#ddd6fe" stroke="#7c3aed" stroke-width="1.4" />
      <rect x="10" y="22" width="80" height="8" rx="1" fill="#7c3aed" />
      <text x="50" y="28" font-size="4" font-weight="800" fill="#fff" text-anchor="middle">CONVENCIONES</text>
      <rect x="14" y="36" width="24" height="28" rx="1" fill="#fff" stroke="#7c3aed" stroke-width="1" /><rect x="42" y="36" width="16" height="28" rx="1" fill="#fff" stroke="#7c3aed" stroke-width="1" /><rect x="62" y="36" width="24" height="28" rx="1" fill="#fff" stroke="#7c3aed" stroke-width="1" />
      <text x="50" y="54" font-size="8" text-anchor="middle">🏢</text>
    </svg>

    <!-- 15b. VALLAS / MUROS / SETOS -->
    <svg v-else-if="type === 'fence'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="10" y="38" width="80" height="6" rx="1" fill="#92400e" stroke="#78350f" stroke-width="1" />
      <rect x="10" y="52" width="80" height="6" rx="1" fill="#92400e" stroke="#78350f" stroke-width="1" />
      <g fill="#a16207" stroke="#78350f" stroke-width="0.8">
        <rect x="18" y="28" width="6" height="32" rx="1" /><rect x="36" y="28" width="6" height="32" rx="1" /><rect x="58" y="28" width="6" height="32" rx="1" /><rect x="76" y="28" width="6" height="32" rx="1" />
      </g>
    </svg>

    <svg v-else-if="type === 'wall'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="8" y="32" width="84" height="28" rx="1" fill="#a8a29e" stroke="#57534e" stroke-width="1.2" />
      <g fill="#78716c"><rect x="12" y="36" width="16" height="6" rx="0.5" /><rect x="32" y="36" width="16" height="6" rx="0.5" /><rect x="52" y="36" width="16" height="6" rx="0.5" /><rect x="72" y="36" width="16" height="6" rx="0.5" /><rect x="22" y="44" width="16" height="6" rx="0.5" /><rect x="42" y="44" width="16" height="6" rx="0.5" /><rect x="62" y="44" width="16" height="6" rx="0.5" /></g>
      <rect x="8" y="28" width="84" height="6" rx="1" fill="#57534e" />
    </svg>

    <svg v-else-if="type === 'hedge'" viewBox="0 0 100 100" class="w-full h-full">
      <ellipse cx="50" cy="52" rx="36" ry="16" fill="#15803d" stroke="#14532d" stroke-width="1.2" />
      <ellipse cx="50" cy="52" rx="30" ry="10" fill="#16a34a" />
      <ellipse cx="32" cy="48" rx="12" ry="8" fill="#22c55e" /><ellipse cx="68" cy="48" rx="12" ry="8" fill="#22c55e" />
      <circle cx="50" cy="44" r="3" fill="#4ade80" opacity="0.7" />
    </svg>

    <svg v-else-if="type === 'brick_wall'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="8" y="32" width="84" height="28" rx="1" fill="#b45309" stroke="#7c2d12" stroke-width="1.2" />
      <g fill="#7c2d12"><rect x="12" y="36" width="18" height="6" rx="0.5" /><rect x="34" y="36" width="18" height="6" rx="0.5" /><rect x="56" y="36" width="18" height="6" rx="0.5" /><rect x="78" y="36" width="10" height="6" rx="0.5" /><rect x="22" y="44" width="18" height="6" rx="0.5" /><rect x="44" y="44" width="18" height="6" rx="0.5" /><rect x="66" y="44" width="18" height="6" rx="0.5" /></g>
      <rect x="8" y="28" width="84" height="6" rx="1" fill="#57534e" />
    </svg>

    <svg v-else-if="type === 'metal_fence'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="10" y="36" width="80" height="2" rx="1" fill="#57534e" />
      <rect x="10" y="52" width="80" height="2" rx="1" fill="#57534e" />
      <g stroke="#9ca3af" stroke-width="0.8">
        <line x1="18" y1="28" x2="18" y2="64" /><line x1="36" y1="28" x2="36" y2="64" /><line x1="54" y1="28" x2="54" y2="64" /><line x1="72" y1="28" x2="72" y2="64" /><line x1="86" y1="28" x2="86" y2="64" />
      </g>
      <g stroke="#52525b" stroke-width="0.6" opacity="0.6"><line x1="18" y1="40" x2="86" y2="40" /><line x1="18" y1="48" x2="86" y2="48" /></g>
    </svg>

    <svg v-else-if="type === 'gate'" viewBox="0 0 100 100" class="w-full h-full">
      <rect x="10" y="32" width="6" height="32" rx="1" fill="#57534e" stroke="#1c1917" stroke-width="1" />
      <rect x="84" y="32" width="6" height="32" rx="1" fill="#57534e" stroke="#1c1917" stroke-width="1" />
      <g fill="none" stroke="#1c1917" stroke-width="1.2">
        <line x1="16" y1="38" x2="38" y2="38" /><line x1="16" y1="46" x2="38" y2="46" /><line x1="16" y1="54" x2="38" y2="54" />
        <line x1="62" y1="38" x2="84" y2="38" /><line x1="62" y1="46" x2="84" y2="46" /><line x1="62" y="54" x2="84" y2="54" />
      </g>
      <rect x="38" y="36" width="4" height="28" rx="1" fill="#27272a" /><rect x="58" y="36" width="4" height="28" rx="1" fill="#27272a" />
      <circle cx="40" cy="48" r="1" fill="#a1a1aa" /><circle cx="60" cy="48" r="1" fill="#a1a1aa" />
    </svg>

    <!-- 15. BANDERAS ONDEANDO 1×1 -->
    <svg v-else-if="type.startsWith('flag_')" viewBox="0 0 100 100" class="w-full h-full">
      <!-- asta -->
      <rect x="18" y="16" width="3" height="68" rx="1.5" fill="#e7e5e4" stroke="#a8a29e" stroke-width="0.8" />
      <circle cx="19.5" cy="14" r="2" fill="#facc15" />
      <!-- bandera ondeando -->
      <g class="flag-wave" style="transform-origin: 21px 24px;">
        <rect v-if="type==='flag_mx'" x="21" y="16" width="52" height="32" rx="1" fill="#006847" />
        <rect v-if="type==='flag_mx'" x="21" y="16" width="52" height="32" rx="1" fill="none" stroke="#000" stroke-width="0.3" opacity="0.2" />
        <g v-if="type==='flag_mx'"><rect x="38" y="16" width="18" height="32" fill="#fff" /><circle cx="47" cy="32" r="5" fill="#ce1126" opacity="0.9" /></g>
        <rect v-if="type==='flag_mx'" x="21" y="16" width="52" height="32" rx="1" fill="none" stroke="#000" stroke-width="0.6" opacity="0.15" />
        <g v-if="type==='flag_co'"><rect x="21" y="16" width="52" height="16" fill="#ffcd00" /><rect x="21" y="32" width="52" height="8" fill="#003893" /><rect x="21" y="40" width="52" height="8" fill="#ce1126" /></g>
        <g v-if="type==='flag_br'"><rect x="21" y="16" width="52" height="32" fill="#009739" /><polygon points="47,20 68,32 47,44 26,32" fill="#ffdf00" /><circle cx="47" cy="32" r="6" fill="#002776" /></g>
        <g v-if="type==='flag_us'"><rect x="21" y="16" width="52" height="32" fill="#b22234" /><g fill="#fff"><rect x="21" y="20" width="52" height="2" /><rect x="21" y="26" width="52" height="2" /><rect x="21" y="32" width="52" height="2" /><rect x="21" y="38" width="52" height="2" /><rect x="21" y="44" width="52" height="2" /></g><rect x="21" y="16" width="22" height="16" fill="#3c3b6e" /></g>
        <g v-if="type==='flag_fr'"><rect x="21" y="16" width="17" height="32" fill="#002395" /><rect x="38" y="16" width="17" height="32" fill="#fff" /><rect x="55" y="16" width="18" height="32" fill="#ed2939" /></g>
        <g v-if="type==='flag_de'"><rect x="21" y="16" width="52" height="10.6" fill="#000" /><rect x="21" y="26.6" width="52" height="10.6" fill="#dd0000" /><rect x="21" y="37.3" width="52" height="10.7" fill="#ffce00" /></g>
        <g v-if="type==='flag_es'"><rect x="21" y="16" width="52" height="8" fill="#aa151b" /><rect x="21" y="24" width="52" height="16" fill="#f1bf00" /><rect x="21" y="40" width="52" height="8" fill="#aa151b" /></g>
        <g v-if="type==='flag_it'"><rect x="21" y="16" width="17" height="32" fill="#009246" /><rect x="38" y="16" width="18" height="32" fill="#fff" /><rect x="56" y="16" width="17" height="32" fill="#ce2b37" /></g>
        <g v-if="type==='flag_jp'"><rect x="21" y="16" width="52" height="32" fill="#fff" stroke="#e5e7eb" stroke-width="0.5" /><circle cx="47" cy="32" r="9" fill="#bc002d" /></g>
        <g v-if="type==='flag_kr'"><rect x="21" y="16" width="52" height="32" fill="#fff" /><circle cx="47" cy="32" r="6" fill="#0047a0" /><path d="M47 26 A6 6 0 0 1 47 38 A3 3 0 0 0 47 26" fill="#cd2e3a" /></g>
        <g v-if="type==='flag_gb'"><rect x="21" y="16" width="52" height="32" fill="#012169" /><path d="M21 16 L73 48 M73 16 L21 48" stroke="#fff" stroke-width="4" /><path d="M21 16 L73 48 M73 16 L21 48" stroke="#c8102e" stroke-width="2" /><rect x="45" y="16" width="4" height="32" fill="#fff" /><rect x="21" y="30" width="52" height="4" fill="#fff" /><rect x="46" y="16" width="2" height="32" fill="#c8102e" /><rect x="21" y="31" width="52" height="2" fill="#c8102e" /></g>
        <g v-if="type==='flag_peru'"><rect x="21" y="16" width="17" height="32" fill="#d91023" /><rect x="38" y="16" width="18" height="32" fill="#fff" /><rect x="56" y="16" width="17" height="32" fill="#d91023" /></g>
        <g v-if="type==='flag_ar'"><rect x="21" y="16" width="52" height="10.6" fill="#74acdf" /><rect x="21" y="26.6" width="52" height="10.6" fill="#fff" /><rect x="21" y="37.3" width="52" height="10.7" fill="#74acdf" /><circle cx="47" cy="32" r="4" fill="#f6b40a" stroke="#853d14" stroke-width="0.6" /></g>
        <g v-if="type==='flag_cl'"><rect x="21" y="16" width="52" height="16" fill="#fff" /><rect x="21" y="32" width="52" height="16" fill="#d72d2d" /><rect x="21" y="16" width="22" height="16" fill="#0039a6" /><circle cx="32" cy="24" r="3" fill="#fff" /></g>
        <g v-if="type==='flag_ve'"><rect x="21" y="16" width="52" height="10.6" fill="#ffcd00" /><rect x="21" y="26.6" width="52" height="10.6" fill="#003893" /><rect x="21" y="37.3" width="52" height="10.7" fill="#ce1126" /><g fill="#fff" opacity="0.9"><circle cx="42" cy="32" r="1" /><circle cx="47" cy="32" r="1" /><circle cx="52" cy="32" r="1" /></g></g>
        <!-- onda -->
        <path d="M21 16 Q34 20 47 16 T73 16" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="0.8" />
        <path d="M21 48 Q34 44 47 48 T73 48" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="0.8" />
      </g>
      <ellipse cx="50" cy="84" rx="10" ry="2" fill="#000" opacity="0.18" />
    </svg>

    <!-- 6. MUELLE / PIER HD (Madera sobre agua) -->
    <svg v-else-if="type === 'dock' || type === 'pier'" viewBox="0 0 100 100" class="w-full h-full">
      <defs>
        <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#92400e" />
          <stop offset="50%" stop-color="#b45309" />
          <stop offset="100%" stop-color="#78350f" />
        </linearGradient>
        <linearGradient id="waterLine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#60a5fa" />
          <stop offset="100%" stop-color="#1e3a8a" />
        </linearGradient>
      </defs>
      <!-- Agua base -->
      <rect x="0" y="58" width="100" height="42" rx="4" fill="url(#waterLine)" opacity="0.9" />
      <ellipse cx="50" cy="64" rx="42" ry="4" fill="#fff" opacity="0.18" />
      <!-- Pilotes -->
      <rect x="18" y="44" width="6" height="36" rx="2" fill="#451a03" />
      <rect x="76" y="44" width="6" height="36" rx="2" fill="#451a03" />
      <rect v-if="type==='pier'" x="47" y="44" width="6" height="36" rx="2" fill="#451a03" />
      <!-- Plataforma madera -->
      <rect x="8" y="38" width="84" height="22" rx="3" fill="url(#wood)" stroke="#451a03" stroke-width="1.8" />
      <g stroke="#451a03" stroke-width="1" opacity="0.9">
        <line x1="24" y1="38" x2="24" y2="60" />
        <line x1="40" y1="38" x2="40" y2="60" />
        <line x1="56" y1="38" x2="56" y2="60" />
        <line x1="72" y1="38" x2="72" y2="60" />
      </g>
      <!-- Detalles: ancla / caja -->
      <text x="50" y="52" text-anchor="middle" font-size="14">⚓</text>
      <!-- Barandilla -->
      <rect x="10" y="32" width="80" height="6" rx="2" fill="#1f2937" opacity="0.85" />
      <g fill="#e5e7eb" opacity="0.9">
        <rect x="14" y="28" width="2" height="12" rx="1" />
        <rect x="30" y="28" width="2" height="12" rx="1" />
        <rect x="46" y="28" width="2" height="12" rx="1" />
        <rect x="62" y="28" width="2" height="12" rx="1" />
        <rect x="78" y="28" width="2" height="12" rx="1" />
      </g>
    </svg>

    <svg v-else-if="type === 'fishing_hut'" viewBox="0 0 100 100" class="w-full h-full">
      <!-- Agua -->
      <rect x="0" y="62" width="100" height="38" rx="4" fill="#60a5fa" opacity="0.9" />
      <!-- Cabaña -->
      <rect x="22" y="34" width="56" height="36" rx="3" fill="#92400e" stroke="#451a03" stroke-width="1.5" />
      <path d="M18 36 L50 12 L82 36 Z" fill="#7c2d12" stroke="#451a03" stroke-width="1.5" />
      <rect x="38" y="50" width="14" height="20" rx="1" fill="#1e293b" stroke="#000" stroke-width="1" />
      <circle cx="74" cy="48" r="3" fill="#facc15" />
      <!-- Muellecito -->
      <rect x="32" y="70" width="36" height="10" rx="2" fill="#b45309" stroke="#451a03" stroke-width="1" />
      <text x="50" y="78" text-anchor="middle" font-size="7" fill="#fff">🎣</text>
      <!-- Poste -->
      <line x1="48" y1="70" x2="48" y2="20" stroke="#451a03" stroke-width="1.5" />
    </svg>

    <!-- 6. ÁRBOLES OXÍGENO — 5 variantes HD -->
    <svg v-else-if="['tree','oak','pine','palm','ceiba'].includes(type)" viewBox="0 0 100 100" class="w-full h-full">
      <!-- Sombra -->
      <ellipse cx="50" cy="85" rx="28" ry="8" fill="#000" opacity="0.22" />
      <!-- Tronco según especie -->
      <path v-if="type==='oak'" d="M44 85 L46 48 L54 48 L56 85 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
      <path v-else-if="type==='pine'" d="M46 85 L48 40 L52 40 L54 85 Z" fill="#5c3a0a" stroke="#3a2400" stroke-width="1.5" />
      <path v-else-if="type==='palm'" d="M48 85 Q48 60 50 45 L52 45 Q52 60 52 85 Z" fill="#92400e" stroke="#78350f" stroke-width="1.2" />
      <path v-else-if="type==='ceiba'" d="M38 85 L42 42 L58 42 L62 85 Z" fill="#7c4a18" stroke="#451a03" stroke-width="1.6" />
      <path v-else d="M44 85 L47 50 L53 50 L56 85 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
      <!-- Copa -->
      <g v-if="type==='pine'">
        <polygon points="50,16 28,46 36,46 24,68 76,68 64,46 72,46" fill="#166534" stroke="#0f3a1a" stroke-width="1.2" />
        <polygon points="50,16 32,40 40,40 30,58 70,58 60,40 68,40" fill="#16a34a" />
        <text x="50" y="52" text-anchor="middle" font-size="7" fill="white" opacity="0.9">+12 O₂</text>
      </g>
      <g v-else-if="type==='palm'">
        <ellipse cx="50" cy="32" rx="18" ry="10" fill="#16a34a" />
        <ellipse cx="36" cy="26" rx="14" ry="7" fill="#22c55e" transform="rotate(-22 36 26)" />
        <ellipse cx="64" cy="26" rx="14" ry="7" fill="#22c55e" transform="rotate(22 64 26)" />
        <ellipse cx="50" cy="22" rx="10" ry="7" fill="#4ade80" />
        <text x="50" y="36" text-anchor="middle" font-size="6" fill="white">+5 O₂</text>
      </g>
      <g v-else-if="type==='ceiba'">
        <circle cx="50" cy="34" r="28" fill="#15803d" />
        <circle cx="34" cy="26" r="18" fill="#16a34a" />
        <circle cx="66" cy="26" r="18" fill="#16a34a" />
        <circle cx="50" cy="18" r="16" fill="#22c55e" />
        <text x="50" y="34" text-anchor="middle" font-size="7" font-weight="bold" fill="white">+22 O₂</text>
      </g>
      <g v-else-if="type==='oak'">
        <circle cx="50" cy="38" r="22" fill="#2d5a18" />
        <circle cx="38" cy="30" r="16" fill="#3a7d24" />
        <circle cx="62" cy="30" r="16" fill="#3a7d24" />
        <circle cx="50" cy="22" r="14" fill="#4a9a2e" />
        <text x="50" y="40" text-anchor="middle" font-size="6" fill="white">+9 O₂</text>
      </g>
      <g v-else>
        <circle cx="50" cy="38" r="22" fill="#15803d" />
        <circle cx="36" cy="30" r="18" fill="#16a34a" />
        <circle cx="64" cy="30" r="18" fill="#16a34a" />
        <circle cx="50" cy="22" r="18" fill="#22c55e" />
        <circle cx="44" cy="18" r="7" fill="#4ade80" opacity="0.6" />
        <text x="50" y="40" text-anchor="middle" font-size="6" fill="white">+6 O₂</text>
      </g>
      <!-- particulas O2 -->
      <circle cx="72" cy="12" r="2" fill="#dcfce7" opacity="0.7" />
      <circle cx="28" cy="16" r="1.5" fill="#dcfce7" opacity="0.5" />
    </svg>

    <!-- 6b ÁRBOL genérico fallback -->
    <svg v-else-if="type === 'tree_fallback'" viewBox="0 0 100 100" class="w-full h-full">
      <!-- Sombra en suelo -->
      <ellipse cx="50" cy="85" rx="28" ry="8" fill="#000" opacity="0.25" />
      
      <!-- Tronco -->
      <path d="M 44 85 L 47 50 L 53 50 L 56 85 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5" />

      <!-- Copas de hojas superpuestas con volumen -->
      <circle cx="50" cy="58" r="22" fill="#15803d" />
      <circle cx="36" cy="46" r="18" fill="#16a34a" />
      <circle cx="64" cy="46" r="18" fill="#16a34a" />
      <circle cx="50" cy="32" r="20" fill="#22c55e" />
      <!-- Brillos de vegetación -->
      <circle cx="44" cy="26" r="8" fill="#4ade80" opacity="0.6" />
      <circle cx="60" cy="40" r="6" fill="#4ade80" opacity="0.5" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true
  }
})
</script>

<style>
.flag-wave { animation: wave 1.1s ease-in-out infinite; }
@keyframes wave { 0%,100%{ transform: skewY(0deg)} 50%{ transform: skewY(1.2deg)} }
</style>
