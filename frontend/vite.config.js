import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    },
    proxy: {
      '/posts': 'http://backend:8000',
      '/users': 'http://backend:8000',
      '/auth': 'http://backend:8000'
    }
  }
})
