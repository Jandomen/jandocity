# 🏙️ JANDOCITY — Construye • Gestiona • Expande

> 🌍 Tu ciudad infinita en la web y en APK Android. ¡Pinta carreteras, expande el mapa y ve tu mundo cobrar vida!

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-6.x-119EFF?logo=capacitor)](https://capacitorjs.com/)
[![PWA](https://img.shields.io/badge/PWA-✓-5A0FC8)](https://web.dev/progressive-web-apps/)

---

## ✨ ¿Qué es Jandocity?

Jandocity es un **city-builder 2D** estilo GTA vista cenital donde **tú eres el protagonista** 👤. Camina con `WASD`, construye con un click y ve cómo **vehículos 🚗, peatones 🚶, policías 🚔, ambulancias 🚑, estudiantes 🎒 y hasta aviones 🛬** cobran vida automáticamente.

* **🗺️ Mundo infinito** — `150×150` base centrado en `0,0`, se expande `+10` al tocar bordes o con `I` hacia donde miras.
* **💾 Mundos locales** — crea / elimina mundos ilimitados en `localStorage` (offline ✓).
* **🎮 Jugable en todo** — web + **APK 4MB** con joystick / D-Pad y carrusel móvil.

---

## 🎯 Features Épicos

### 🏗️ Construcción
- **🏘️ Zonas** — 4 casas + comercial/tienda/super/mall/banco/parque
- **🏙️ Altura** — torres `1×2` / bloques `2×2` (¡2 cuadros de alto!)
- **🏟️ Grandes/Mega** — estadio, aeropuerto, ayuntamiento, museo, nuclear, ópera...
- **🌍 Mundial 20 países** — Eiffel 🇫🇷, Libertad 🇺🇸, Chichén 🇲🇽, Taj Mahal 🇮🇳...
- **🏳️ Banderas ondeando** — 15 países `1×1`
- **⚡ Infra** — energía/agua/fábricas + 🛤️ carreteras `4 pavimentos` con `20 variantes` (curvas, T, glorieta) + rieles
- **🌊 Terreno 10 pinceles** — cemento/azulejo/madera/mármol/piedra/lagos
- **🧱 Cercas 6 tipos + 9 variantes** — vallas, muros, setos `+2 O₂`
- **🌳 Naturaleza** — oxígeno real `🍃` (déficit baja ingresos ¡planta árboles!)

### 🚦 Vida Automática
- **🚗 Vehículos** circulan solos en carretera (coches, buses, motos...)
- **🚌 Terminal buses / 🏎️ Concesionaria autos / 🏍️ Motos** — spawnean solos si están junto a pavimento
- **✈️ Aeropuertos** — aviones `🛬 aterrizan` / `🛫 despegan` en diagonal
- **🚔 Policía / 🪖 Soldados** persiguen **🔫 fugitivos** de la **🔒 Cárcel** (a veces huyen ¡y atacan!)
- **🚑 Ambulancias + 🩺 Médicos** rescatan **⚠️ accidentes** y llevan al hospital
- **🎒 Estudiantes** (escuela/uni) + **⚖️ Abogados/Jueces** (juzgado) caminan lento y se dispersan (¡corren si ven criminal!)

### 📱 Móvil / APK
- **🕹️ Joystick thumb ◉** ↔ **✜ D-Pad cruz** (cambiable en pausa)
- **🎠 Carrusel inferior** — 1 línea extendida (donde estaba “Presiona H”), modal centrado con **✕ Cerrar** abajo
- **🎮 Botones flotantes izq** `⟲ ? − 🧨` + joystick der, header `py-1` 1 línea

### ⏸️ Pausa & Audio
- **Esc ⏸️** pausa con **Reanudar / 🔊 Audio / 🎮 Controles / Palanca / Salir al menú**
- **15 pistas** `🎵` con `N` para siguiente + ambiente y efectos

---

## 🧱 Stack

`Vue 3` + `Pinia` + `Vite 5` + `Tailwind` + `Capacitor 6` + `PWA (Workbox)` + `Supabase` (futuro online)

---

## 🚀 Instalación

```bash
# 1. Clona
git clone <tu-repo> && cd jandocity

# 2. Instala
npm install

# 3. Dev (web)
npm run dev
# → http://localhost:5173

# 4. Build web
npm run build
npm run preview
```

---

## 📦 APK Android

```bash
# Sincroniza web → Android
npx cap sync

# Build debug (4MB)
cd android && ./gradlew assembleDebug
# APK en: android/app/build/outputs/apk/debug/app-debug.apk

# Copia bonita
cp android/app/build/outputs/apk/debug/app-debug.apk ~/Desktop/Jandocity.apk
```

> 💡 Si tu cel y PC están en el mismo WiFi, levanta server rápido:
> ```bash
> cd ~/Desktop && python3 -m http.server 8000
> # En Android: http://TU_IP:8000/Jandocity.apk
> ```

---

## 🎮 Controles

| Tecla | Acción |
|-------|--------|
| `WASD / Flechas` | Mover protagonista |
| `Click izq` / `Arrastrar` | Pintar / construir |
| `Click der` / `Arrastrar` | Demoler (`🧨`) / Mantén para borrar |
| `Rueda / Pinch` | Zoom |
| `H` | Ocultar/mostrar UI |
| `N` | Siguiente pista 🎵 |
| `I` | Expandir +10 hacia donde miras |
| `M` | Ver cuadrantes `10×10` |
| `Esc` | ⏸️ Pausa |

Móvil: carrusel categorías abajo + modal + joystick/D-Pad.

---

## 🗂️ Estructura

```
src/
├── components/   # CityGrid, ToolPalette, MobileToolCarousel, PauseMenu, VehicleLayer...
├── stores/       # cityStore, trafficStore, playerStore
├── composables/  # useServiceSpawns, useAirportSpawns, useCamera...
├── constants/    # buildings.js, terrain.js
├── utils/        # worldPersistence, terrainGenerator
└── audio/        # music/ambient/effects
android/          # Proyecto Capacitor
public/           # favicon, pwa icons
```

---

## 🗺️ Roadmap

- [x] Modo libre local con mundos
- [x] Vida autónoma (policía, ambulancia, estudiantes, aviones...)
- [ ] **Un jugador** — cuenta Jandocity + Supabase (nubes)
- [ ] **Multijugador** — modo Age of Empires ⚔️ (elimina al rival)
- [ ] Más accidentes / incendios 🔥

---

## 📜 Licencia

MIT — Haz lo que quieras, ¡pero construye ciudades bonitas! 🏰

---

<p align="center">Hecho con 💛 por <b>Jando</b> • <code>Muse Spark 1.2</code></p>
