import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  // Rutas relativas: dist/ funciona en cualquier servidor o subcarpeta.
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    VitePWA({
      // 'prompt' deja la versión nueva en espera: src/shared/updates.ts decide cuándo aplicarla.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Brinco',
        short_name: 'Brinco',
        description: 'Mini apps para que los niños aprendan jugando.',
        lang: 'es',
        start_url: './',
        scope: './',
        display: 'standalone',
        // Android oculta las barras del sistema; iOS no lo admite y se queda en standalone.
        display_override: ['fullscreen', 'standalone'],
        // Las tablets giran; en teléfonos acostados se pide girar (RotateHint).
        orientation: 'any',
        background_color: '#6C4DF6',
        theme_color: '#6C4DF6',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,mp3}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
});
