import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.jpeg', 'favicon.ico'],
      manifest: {
        name: 'Cashmere Cottontail Farm',
        short_name: 'CCF',
        description: 'Luxury & boutique miniature animals — Valais Blacknose sheep, Pygmy goats, Mini Rex rabbits, Miniature Dachshunds & Silkie chickens.',
        theme_color: '#2c2c2c',
        background_color: '#faf8f5',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/logo.jpeg', sizes: '512x512', type: 'image/jpeg' }
        ]
      }
    })
  ]
});
