import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5001',
        ws: true,
      },
    },
  },
})
