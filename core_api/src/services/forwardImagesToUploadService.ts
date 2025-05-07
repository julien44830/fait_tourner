import axios from "axios";
import { Request } from "express";

/**
 * 📤 Redirige la requête multipart brute vers le microservice upload_service
 * 
 * @param req - Requête Express complète
 * @param userId - ID de l'utilisateur
 * @param bookId - ID du book
 */
export const forwardImagesToUploadService = async (
  req: Request,
  userId: string,
  bookId: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:5001/upload/${bookId}`,
      req,
      {
        headers: {
          ...req.headers,
          "user-id": userId,
        },
        maxContentLength: Infinity, // facultatif si gros fichiers
        maxBodyLength: Infinity,    // facultatif si gros fichiers
      }

    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur lors du forward vers upload_service :", error.response?.data || error.message);
    throw new Error("Erreur lors du transfert d'images vers upload_service.");
  }
};
