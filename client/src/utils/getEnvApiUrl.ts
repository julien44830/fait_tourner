export const getEnvApiUrl = (): string => {
  const viteEnv = import.meta.env.VITE_API_URL;

  if (!viteEnv) {
    if (import.meta.env.MODE === "production") {
      throw new Error("❌ VITE_API_URL non définie en production !");
    }

    // fallback uniquement pour le dev local
    return "http://localhost:4000";
  }

  return viteEnv;
};
