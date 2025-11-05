import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        parserOpts: {
          plugins: ['jsx']
        }
      }
    }), 
    tailwindcss()
  ],
  base: './',
  build: {
    outDir: 'dist-react',
    sourcemap: true
  },
  server: {
    port: 5123,
    strictPort: true
  }
})
