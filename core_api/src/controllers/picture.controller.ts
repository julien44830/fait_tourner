import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/UserRequest";
import { deletePicturesByIds } from "../models/picture.model";
import { findBookById } from "../models/book.model";

export const deletePicturesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ✅ Cast local ici seulement
    const { userId } = (req as AuthenticatedRequest).user ?? {};
    const { bookId, pictureIds } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Utilisateur non connecté." });
      return;
    }

    if (!bookId || !Array.isArray(pictureIds) || pictureIds.length === 0) {
      res.status(400).json({ error: "bookId ou pictureIds manquant." });
      return;
    }

    const book = await findBookById(bookId);
    if (!book) {
      res.status(404).json({ error: "Book introuvable." });
      return;
    }

    const isOwner = book.owner_id === userId;
    await deletePicturesByIds(pictureIds, userId, bookId, isOwner);

    res.json({ message: "Images supprimées avec succès." });
  } catch (error) {
    console.error("❌ Erreur suppression images :", error);
    res.status(500).json({ error: "Erreur lors de la suppression des images." });
  }
};
