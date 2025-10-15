import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy HLS files and overlays API to Flask backend
      '/stream': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/overlays': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
