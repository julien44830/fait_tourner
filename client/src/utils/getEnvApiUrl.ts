/**
 * 🌍 getEnvApiUrl
 *
 * ✅ Fonction utilitaire pour récupérer l'URL de l'API à partir des variables d'environnement Vite.
 *
 * ---
 *
 * 🔍 Description :
 * Cette fonction permet d'obtenir dynamiquement l'URL de base pour les appels API,
 * en tenant compte de l'environnement (`development` ou `production`) et en appliquant
 * un fallback automatique en local si la variable `VITE_API_URL` est absente.
 *
 * ---
 *
 * ⚠️ En production, l'absence de `VITE_API_URL` génère une erreur explicite pour éviter les bugs silencieux.
 * 🛠 En développement, un fallback vers `http://localhost:4000` est retourné si la variable est manquante.
 *
 * ---
 *
 * 📦 Usage :
 * ```ts
 * const apiUrl = getEnvApiUrl(); // retourne VITE_API_URL ou localhost:4000
 * fetch(`${apiUrl}/api/users`);
 * ```
 */


export const getEnvApiUrl = (): string => {
  // 🔎 Récupération de la variable d’environnement Vite
  const viteEnv = import.meta.env.VITE_API_URL;

  // ❌ Si la variable n’est pas définie
  if (!viteEnv) {
    // 🚨 En production : on lance une erreur explicite
    if (import.meta.env.MODE === "production") {
      throw new Error("❌ VITE_API_URL non définie en production !");
    }

    // 💻 En développement : fallback vers localhost
    return "http://localhost:4000";
  }

  // ✅ Retourne l'URL définie dans VITE_API_URL
  return viteEnv;
};
