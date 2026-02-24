import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure SW and manifest are included in build output
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          qr: ['qrcode.react', '@zxing/library', '@zxing/browser'],
        }
      }
    },
    // Warn only above 800kb (reduces false build warnings)
    chunkSizeWarningLimit: 800,
  },
  server: {
    // Proxy API calls to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
