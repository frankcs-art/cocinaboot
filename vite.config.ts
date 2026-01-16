import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // Temporarily disabled PWA for deployment
        // VitePWA({
        //   registerType: 'autoUpdate',
        //   workbox: {
        //     globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        //   },
        //   manifest: {
        //     name: 'Blanquita IA',
        //     short_name: 'Blanquita IA',
        //     description: 'Sistema inteligente de inventario y gestión de proveedores con IA',
        //     theme_color: '#ffffff',
        //     background_color: '#ffffff',
        //     display: 'standalone',
        //     icons: [
        //       {
        //         src: '/icon-192x192.svg',
        //         sizes: '192x192',
        //         type: 'image/svg+xml'
        //       },
        //       {
        //         src: '/icon-512x512.svg',
        //         sizes: '512x512',
        //         type: 'image/svg+xml'
        //       }
        //     ]
        //   }
        // })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
  });
