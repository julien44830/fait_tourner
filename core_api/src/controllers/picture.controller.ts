import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/UserRequest";
import { deletePicturesByIds } from "../models/picture.model";
import { findBookById } from "../models/book.model";
import { deletePicturesWithFiles } from "../services/deletePicturesWithFiles";

interface DeletePicturesBody {
  bookId: string;
  pictureIds: string[];
  imagePaths: string[];
}

/**
 * Contrôleur pour supprimer des images :
 * - supprime les fichiers via le microservice d'upload
 * - supprime les entrées correspondantes en base
 */
export const deletePicturesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user ?? {};
    const { bookId, pictureIds, imagePaths } = req.body;

    console.log('%c⧭', 'color: #e57373', bookId, pictureIds, imagePaths);

    // 🔒 Validation des données
    if (!userId) {
      res.status(401).json({ error: "Utilisateur non connecté." });
      return;
    }

    if (
      !bookId ||
      !Array.isArray(pictureIds) ||
      !Array.isArray(imagePaths) ||
      pictureIds.length === 0 ||
      imagePaths.length === 0
    ) {
      res.status(400).json({ error: "Paramètres requis manquants ou invalides." });
      return;
    }

    // 🔧 Appel du service métier
    await deletePicturesWithFiles({ userId, bookId, pictureIds, imagePaths });

    res.json({ message: "Images supprimées avec succès." });
  } catch (error) {
    console.error("❌ Erreur suppression images :", error);
    res.status(500).json({ error: "Erreur lors de la suppression des images." });
  }
};
