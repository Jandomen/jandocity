#!/bin/bash
# OTA release para APK offline-first — no necesita reinstalar
# Uso: ./scripts/ota-release.sh 0.1.1
set -e
VERSION=${1:-0.1.1}
echo "→ Bump version $VERSION"
# actualiza package.json y public/version.json
node -e "let p=require('./package.json');p.version='$VERSION';require('fs').writeFileSync('package.json',JSON.stringify(p,null,2))"
cat > public/version.json << JSON
{
  "version": "$VERSION",
  "url": "https://adqhqvzkqdhujjipabgf.supabase.co/storage/v1/object/public/updates/jandocity-$VERSION.zip",
  "notes": "OTA $VERSION"
}
JSON
cat > /tmp/manifest.json << JSON
{
  "version": "$VERSION",
  "url": "https://adqhqvzkqdhujjipabgf.supabase.co/storage/v1/object/public/updates/jandocity-$VERSION.zip"
}
JSON
echo "→ Build"
npm run build
echo "→ Zip"
cd dist && zip -r ../jandocity-$VERSION.zip . -q && cd ..
echo "→ Upload a Supabase Storage (usa SERVICE_ROLE del .env)"
# lee URL y key del .env
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d'=' -f2)
SERVICE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env | cut -d'=' -f2)
curl -s -X POST "$SUPABASE_URL/storage/v1/object/updates/jandocity-$VERSION.zip" -H "Authorization: Bearer $SERVICE_KEY" -H "apikey: $SERVICE_KEY" -H "Content-Type: application/zip" --data-binary @jandocity-$VERSION.zip | head -c 200
echo ""
curl -s -X POST "$SUPABASE_URL/storage/v1/object/updates/manifest.json" -H "Authorization: Bearer $SERVICE_KEY" -H "apikey: $SERVICE_KEY" -H "Content-Type: application/json" --data-binary @/tmp/manifest.json | head -c 200
echo ""
echo "→ Sync Capacitor"
npx cap sync android
echo "→ Listo: despliega a Vercel con vercel --prod para actualizar version.json web"
echo "APK instalado offline al tener internet descarga solo a los 2.5s y aplica al reiniciar"
