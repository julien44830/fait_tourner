/**
 * ✅ logTestSuccess.ts
 *
 * 📌 Fournit des fonctions utilitaires pour enregistrer et afficher des logs
 * de tests réussis de manière structurée.
 *
 * ---
 *
 * 🔍 Description :
 * Ce fichier permet de centraliser les messages de succès dans les tests
 * (par exemple avec Jest), pour ensuite les afficher groupés à la fin de la suite de tests.
 *
 * ---
 *
 * 📦 Utilisation :
 * ```ts
 * logTestSuccess("Connexion réussie avec Google");
 * logTestSuccess("Affichage de la modale CreateBook");
 *
 * afterAll(() => {
 *   flushSuccessLogs();
 * });
 * ```
 *
 * ✅ Résultat dans la console :
 * ```
 * ✅ Test réussi : Connexion réussie avec Google
 * ✅ Test réussi : Affichage de la modale CreateBook
 * ```
 */

// 🧪 Stockage temporaire des messages de succès
const successMessages: string[] = [];

/**
 * ✅ Enregistre un message de succès
 *
 * @param message - Le message à enregistrer (ex : "Connexion réussie")
 */
export const logTestSuccess = (message: string) => {
  // Formatage automatique avec un emoji ✅
  successMessages.push(`✅ Test réussi : ${message}`);
};

/**
 * 📤 Affiche tous les messages de succès enregistrés
 */
export const flushSuccessLogs = () => {
  if (successMessages.length > 0) {
    console.log(successMessages.join("\n")); // Affiche chaque message sur une ligne
  }
};
