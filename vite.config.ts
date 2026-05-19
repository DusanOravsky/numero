import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

const analyze = process.env.ANALYZE === '1';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    analyze && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Integrálna mapa bytia',
        short_name: 'Integrálna mapa',
        description: 'Numerológia, astrológia, Human Design a sebarozvoj – offline PWA',
        theme_color: '#fafaf9',
        background_color: '#fafaf9',
        display: 'standalone',
        orientation: 'portrait',
        start_url: process.env.GITHUB_ACTIONS ? '/numero/' : '/',
        scope: process.env.GITHUB_ACTIONS ? '/numero/' : '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
        cleanupOutdatedCaches: true,
        navigateFallback: process.env.GITHUB_ACTIONS ? '/numero/index.html' : '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/_/, /\.[a-z0-9]{2,5}$/i],
        runtimeCaching: [
          {
            // SPA route navigations: cache-first with network update fallback
            urlPattern: /^https?:\/\/[^/]+\/(numero\/)?$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'navigations',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 5, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            // App shell JS/CSS chunks (have hashes, immutable once cached)
            urlPattern: /\/assets\/.*\.(?:js|css)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets',
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            // Local images & icons
            urlPattern: /\.(?:png|jpe?g|svg|webp|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      }
    })
  ],
  base: process.env.GITHUB_ACTIONS ? '/numero/' : '/',
  resolve: {
    alias: { '@': '/src' }
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/astronomy-engine')) {
            return 'astronomy';
          }
          if (id.includes('node_modules/jspdf')) {
            return 'pdf';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/') || id.includes('node_modules/framer-motion/') || id.includes('node_modules/zustand/')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
