import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config"; // <-- ici
import type { UserConfigExport } from "vite";   // <-- ici

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  build: {
    outDir: "dist",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    exclude: [...configDefaults.exclude, "e2e"], // ← si tu veux exclure un dossier e2e par exemple
  },
} satisfies UserConfigExport); // ✅ pour que `test` soit reconnu proprement
