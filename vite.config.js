import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Jandocity',
        short_name: 'Jandocity',
        description: 'City builder 150×150 — offline',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'favicon.png', sizes: '96x96', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 3000000,
        runtimeCaching: [
          { urlPattern: /^https:\/\/.*/, handler: 'NetworkFirst', options: { cacheName: 'external', expiration: { maxEntries: 30, maxAgeSeconds: 86400 } } }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: { port: 5173 },
  build: {
    target: 'es2018',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'pinia', '@supabase/supabase-js', 'simplex-noise'],
  },
})
