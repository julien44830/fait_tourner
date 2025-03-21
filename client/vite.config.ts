import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  build: {
    outDir: "dist",
  },
  server: {
    middlewareMode: false,
    hmr: true, // Ajout de Hot Module Replacement si besoin
  }
})
