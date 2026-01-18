import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
        }),
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
        }),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  },
                }
              },
              {
                 urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
                 handler: 'StaleWhileRevalidate',
                 options: {
                    cacheName: 'assets-cache',
                    expiration: {
                       maxEntries: 50,
                       maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
                    }
                 }
              }
            ]
          },
          manifest: {
            name: 'Blanquita IA',
            short_name: 'Blanquita IA',
            description: 'Sistema inteligente de inventario y gestión de proveedores con IA',
            theme_color: '#09090b',
            background_color: '#09090b',
            display: 'standalone',
            icons: [
              {
                src: '/icon-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              },
              {
                src: '/icon-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml'
              }
            ]
          }
        })
      ],
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor': ['react', 'react-dom'],
              'ui': ['lucide-react', 'recharts'],
              'ai': ['@google/genai']
            }
          }
        }
      },
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
