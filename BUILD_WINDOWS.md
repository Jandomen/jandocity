# Jandocity - Build Windows .EXE (Electron offline)

Tu `dist/` ya es offline (PWA + localStorage). Electron solo empaqueta ese `dist/` en un `.exe`.

## Opción rápida (local en Windows)
```bash
npm install
npm run build        # vite -> dist/
npm run build:win    # genera release/Jandocity-0.1.40-x64.exe + release/Jandocity-Portable-0.1.40.exe
# copia el portable a public para descarga web:
cp release/Jandocity-Portable-*.exe public/Jandocity-Portable-0.1.40.exe
```

## Opción cruzada (Mac)
Electron en Mac no puede generar NSIS sin `wine`. Usa portable:
```bash
npm run build:win-portable
# Si falla, usa GitHub Actions (recomendado)
```

## GitHub Actions (recomendado)
Push tag `v0.1.40` o `Run workflow` manual -> `release/*.exe` como artifact.
Luego descarga y `cp release/*.exe public/` + `git add public/*.exe && git push`.

## Como funciona offline
- `electron/main.cjs:18` -> `win.loadFile(dist/index.html)` — no hace `loadURL(http)`, carga archivos locales. Sin internet abre igual.
- `public/Jandocity.apk` y `public/Jandocity-Portable-*.exe` son descargas web via `MainMenu.vue:68` (isWeb).
- Dentro de Electron `isElectron=true` oculta botones de descarga.

## Como se actualiza
1. **Web**: Vercel deploy + reload (ya).
2. **Android**: `useAutoUpdater.js` + Capgo + `version.json`.
3. **Windows Electron**:
   - `electron/main.cjs:60` `autoUpdater` (electron-updater) chequea en background si hay internet (4s tras abrir).
   - Si configuras `publish` en `package.json:build` (GitHub Releases), descarga `.exe` nuevo silencioso, notifica via `DesktopUpdatePrompt.vue`, usuario clica `Reiniciar`.
   - Si no usas publish, funciona manual: sube nuevo `.exe` a `public/` + bump `version` en `package.json`, usuario descarga nuevo `.exe` (portable sobrescribe, instalador actualiza).
   - `src/composables/useElectronUpdater.js` escucha `update-available` / `download-progress` desde preload.

## Publicar nueva versión Windows
1. `npm version patch` (0.1.40 -> 0.1.41)
2. `npm run build:win` (en Windows o Actions)
3. Copia exe a `public/Jandocity-Portable-0.1.41.exe`
4. Actualiza `MainMenu.vue:76` link a nueva versión + `public/version.json` si usas autoUpdater genérico
5. `git add . && git commit -m "chore: bump win 0.1.41" && git push`
