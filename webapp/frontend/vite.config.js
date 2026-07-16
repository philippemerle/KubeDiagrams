import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['@terrastruct/d2'],
    include: ['path-browserify'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // the backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
