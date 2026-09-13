import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Entreno',
        short_name: 'Entreno',
        description: 'Rutina de torso/pierna y running, con registro de series.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        // Hex fijo: el manifiesto no admite oklch, y el tema usa
        // oklch(0.585 0.125 38) para --clay y #F7F1EA para --bg.
        theme_color: '#B95E42',
        background_color: '#F7F1EA',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Las 76 fotos (3,2 MB) van al precache: es barato y garantiza que
        // estén disponibles sin red aunque nunca hayas abierto ese ejercicio.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}', 'fotos/**/*.jpg'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Las animaciones son cross-origin, así que no pueden precachearse.
            // jsDelivr responde access-control-allow-origin:*, y los <img> van
            // con crossOrigin="anonymous", así la respuesta es cors y no opaca:
            // eso permite a Workbox validarla y medirla.
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/gh\/hasaneyldrm\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'entreno-gifs',
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'entreno-fuentes',
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  server: {
    host: true,
    // '.ts.net' cubre el MagicDNS de Tailscale
    allowedHosts: ['.loca.lt', 'juans-macbook-pro', '.ts.net'],
  },
})
