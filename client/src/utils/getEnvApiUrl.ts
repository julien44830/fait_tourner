/**
 * 🔧 Récupère l'URL de l'API en tenant compte de l'environnement (Vite, test, ou Node).
 */
export const getEnvApiUrl = (): string => {
  try {
    // Empêche l'exécution en mode test (comme Jest ou Vitest)
    const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
    if (!isTest) {
      const viteEnvGetter = new Function("return import.meta.env.VITE_API_URL");
      const viteEnv = viteEnvGetter();
      if (viteEnv) return viteEnv;

      const modeGetter = new Function("return import.meta.env.MODE");
      const viteMode = modeGetter();
      if (viteMode === "production") {
        throw new Error("❌ VITE_API_URL non définie en production !");
      }
    }
  } catch (_) {
    // Ignore l'erreur pour test ou SSR
  }

  if (typeof process !== "undefined" && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }

  // Local uniquement
  return "http://localhost:4000";
};
