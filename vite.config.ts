import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Integrálna mapa bytia - Integrálna mapa bytia',
        short_name: 'Integrálna mapa bytia',
        description: 'Integrálna mapa bytia - numerológia, astrológia, Human Design a sebarozvoj',
        theme_color: '#1e1b4b',
        background_color: '#0f0a2e',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
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
