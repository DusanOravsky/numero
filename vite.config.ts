import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import pkg from './package.json'

const analyze = process.env.ANALYZE === '1';
const isBuild = process.argv.includes('build');
if (isBuild) writeFileSync(resolve(import.meta.dirname, 'public/version.json'), JSON.stringify({ version: pkg.version }) + '\n');

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
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
      registerType: 'prompt',
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
        // OFFLINE-FIRST stratégia s MANUÁLNYM update.
        //  - Všetko cache-first → app sa otvorí okamžite aj keď je GitHub offline
        //  - Žiadny skipWaiting / clientsClaim → SW čaká kým ho user manuálne aktivuje
        //  - Update zmení iba ak user klikne "Aktualizovať" v Settings
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
        globIgnores: ['**/version.json'],
        cleanupOutdatedCaches: true,
        // skipWaiting/clientsClaim ZÁMERNE NEDÁVAME — chceme manuálne riadený update
        navigateFallback: process.env.GITHUB_ACTIONS ? '/numero/index.html' : '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/_/, /\.[a-z0-9]{2,5}$/i],
        runtimeCaching: [
          {
            // version.json — VŽDY z network (na detekciu novej verzie)
            urlPattern: /\/version\.json$/,
            handler: 'NetworkOnly',
          },
          {
            // HTML / SPA navigations: CacheFirst → okamžitý load aj offline.
            // Cache sa update-uje IBA keď user manuálne spustí update.
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'CacheFirst',
            options: {
              cacheName: 'navigations',
              expiration: { maxEntries: 5, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          {
            // App shell JS/CSS chunks (hashed names, immutable)
            urlPattern: /\/assets\/.*\.(?:js|css)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets',
              expiration: { maxEntries: 60, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          {
            // Local images & icons
            urlPattern: /\.(?:png|jpe?g|svg|webp|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 50, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
        ],
      }
    })
  ],
  base: process.env.GITHUB_ACTIONS ? '/numero/' : '/',
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/astronomy-engine')) {
            return 'astronomy';
          }
          if (id.includes('node_modules/jspdf')) {
            return 'pdf';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'framework';
          }
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/framer-motion/') || id.includes('node_modules/zustand/')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
