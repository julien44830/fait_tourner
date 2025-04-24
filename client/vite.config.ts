import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";
import type { UserConfigExport } from "vite";


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    exclude: [...configDefaults.exclude, "e2e"],
  },
} satisfies UserConfigExport);
