import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/search': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/crawl': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/index': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})