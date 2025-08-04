import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path'

export default defineConfig({
  root: 'public',
  publicDir: '../assets',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html')
      },
      output: {
        manualChunks: {
          'editor': [
            './js/core/editor.js',
            './js/core/template-manager.js',
            './js/core/section-manager.js'
          ],
          'vendor': [
            'lodash',
            'sortablejs',
            'jszip',
            'dompurify'
          ]
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  optimizeDeps: {
    include: [
      'lodash',
      'sortablejs',
      'jszip',
      'dompurify',
      'marked',
      'color',
      'dayjs',
      'uuid',
      'file-saver'
    ]
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './public/js'),
      '@core': resolve(__dirname, './public/js/core'),
      '@components': resolve(__dirname, './public/js/components'),
      '@utils': resolve(__dirname, './public/js/utils'),
      '@styles': resolve(__dirname, './public/css')
    }
  }
})