import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {} // Évite les erreurs avec `process.env` sur le frontend
  },
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173, // Définit un port pour éviter des conflits
    open: true, // Ouvre automatiquement le navigateur
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:4000",
        changeOrigin: true,
        secure: false
      }
    },
    historyApiFallback: true, // Permet d'éviter le 404 sur les routes React
  }
});
