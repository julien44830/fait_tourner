export const getEnvApiUrl = (): string => {
  try {
    const viteEnvGetter = new Function("return import.meta.env.VITE_API_URL");
    const viteEnv = viteEnvGetter();
    if (viteEnv) return viteEnv;

    const viteModeGetter = new Function("return import.meta.env.MODE");
    const viteMode = viteModeGetter();
    if (viteMode === "production") {
      throw new Error("❌ VITE_API_URL non définie en production !");
    }
  } catch (_) { }

  if (typeof process !== "undefined" && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }

  // Fallback uniquement en dev local
  return "http://localhost:4000";
};
