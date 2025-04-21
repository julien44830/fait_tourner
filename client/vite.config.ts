import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";
import type { UserConfigExport } from "vite";

// 🔍 Log utile pour confirmer que la variable est bien injectée lors du build
console.log("🔧 VITE_API_URL injectée :", process.env.VITE_API_URL);

export default defineConfig({
  plugins: [react()],

  // ❌ NE PAS définir `process.env` manuellement, ça casse `import.meta.env`
  // define: {
  //   "process.env": process.env, // ⚠️ À ne surtout pas remettre !
  // },

  build: {
    outDir: "dist", // Dossier de sortie (par défaut déjà)
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    exclude: [...configDefaults.exclude, "e2e"], // Tu peux exclure les tests e2e si besoin
  },
} satisfies UserConfigExport);
