import axios from "axios";

/**
 * 🔥 Supprime des fichiers sur le microservice upload_service
 * @param bookId - ID du book
 * @param files - Liste des fichiers à supprimer
 */
export const deleteImagesOnUploadService = async (
  bookId: string,
  files: string[]
): Promise<{ success: boolean }> => {
  try {
    const response = await axios.post("http://localhost:5001/upload/delete-multiple", {
      bookId,
      files,
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur lors de l'appel à upload_service pour la suppression :", error.response?.data || error.message);
    return { success: false };
  }
};
