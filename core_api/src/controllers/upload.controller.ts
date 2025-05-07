// src/controllers/upload.controller.ts

/**
 * 📤 Contrôleur Upload - Redirection des images vers le microservice Upload Service
 *
 * Ce contrôleur :
 * - Vérifie que l'utilisateur est authentifié
 * - Vérifie que le bookId est présent
 * - Redirige les fichiers vers le microservice d'upload
 * - Insère les informations des images uploadées dans la base de données
 *
 * Utilise :
 * - forwardImagesToUploadService (proxy)
 * - insertPicture (modèle Picture)
 *
 */

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { forwardImagesToUploadService } from "../services/forwardImagesToUploadService";
import { insertPicture } from "../models/picture.model";
import { AuthenticatedRequest } from "../types/UserRequest";

/**
 * 🎯 Gère l'upload d'images en les redirigeant vers upload_service
 * puis insère les images dans la base de données.
 *
 * @param req - Requête Express contenant l'utilisateur et les fichiers
 * @param res - Réponse Express
 */
export const handleUpload = async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;
  const bookId = req.params.bookId;

  // 🔒 Vérification utilisateur
  if (!user?.userId) {
    res.status(401).json({ error: "Non autorisé." });
    return;
  }

  // 📖 Vérification bookId
  if (!bookId) {
    res.status(400).json({ error: "Book ID manquant." });
    return;
  }

  try {
    console.log("📬 Envoi vers forwardImagesToUploadService :", { userId: user.userId, bookId });

    // 🚀 Redirection des fichiers vers upload_service
    const uploadResponse = await forwardImagesToUploadService(req, user.userId, bookId);

    if (!uploadResponse?.success || !Array.isArray(uploadResponse.images)) {
      console.error("❌ Upload service a retourné une erreur :", uploadResponse);
      res.status(502).json({ error: "Erreur lors de l'upload distant." }); // 502 plutôt que 500 (car erreur d'un autre service)
      return;
    }

    const insertedPictures = await Promise.all(
      uploadResponse.images.map(async (image: { originalname: string; filename: any; }) => {
        const pictureId = uuidv4();
        await insertPicture(
          pictureId,
          image.originalname,                         // 📝 Nom visible
          `/uploads/${bookId}/${image.filename}`,      // 📂 Chemin réel de stockage
          bookId,
          user.userId
        );
        return {
          id: pictureId,
          name: image.originalname,
          path: `/uploads/${bookId}/${image.filename}`,
        };
      })
    );

    // ✅ Réponse succès
    res.status(201).json({
      message: "Images uploadées et enregistrées en base avec succès 🎉",
      pictures: insertedPictures,
    });
  } catch (error) {
    console.error("❌ Erreur lors du traitement des images :", error);
    res.status(500).json({ error: "Erreur serveur lors du traitement des images." });
  }
};
