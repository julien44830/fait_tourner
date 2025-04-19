/**
 * 🔧 Récupère l'URL de l'API en tenant compte de l'environnement (Vite ou test Node).
 */
export const getEnvApiUrl = (): string => {
  // On essaye d'accéder à import.meta.env sans déclencher une erreur de compilation TypeScript
  try {
    // On utilise une fonction dynamique pour éviter que TypeScript ne parse `import.meta`
    // Cela évite le TS1343 dans les tests
    // eslint-disable-next-line no-new-func
    const viteEnvGetter = new Function("return import.meta.env.VITE_API_URL");
    const viteEnv = viteEnvGetter();
    if (viteEnv) return viteEnv;
  } catch (e) {
    // Silencieusement fallback
  }

  // Environnement Node (tests, SSR, etc.)
  if (typeof process !== "undefined" && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }

  // Fallback local
  return "http://localhost:4000";
};
