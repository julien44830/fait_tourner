import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { insertPicture } from "../models/picture.model";

/**
 * 📤 Contrôleur d'upload d'images
 * 
 * Ce contrôleur :
 * - Reçoit les fichiers envoyés directement via Multer
 * - Insère les chemins de fichiers dans la base de données
 * - Retourne la liste des images enregistrées
 * 
 * @param req - Requête Express contenant `files`, `userId`, `bookId`
 * @param res - Réponse Express
 */
export const uploadPictures = async (req: Request, res: Response): Promise<void> => {
  // 🔎 Récupération des infos de la requête
  const userId = req.body.userId;
  const bookId = req.params.bookId || req.body.bookId; // selon d'où vient l'info
  const files = req.files as Express.Multer.File[];

  // 🔒 Vérifications
  if (!userId) {
    res.status(401).json({ error: "Utilisateur non authentifié." });
    return;
  }

  if (!bookId) {
    res.status(400).json({ error: "ID du book manquant." });
    return;
  }

  if (!files || files.length === 0) {
    res.status(400).json({ error: "Aucun fichier reçu." });
    return;
  }

  try {
    const insertedImages = [];

    // 📚 Parcours de chaque fichier reçu
    for (const file of files) {
      const pictureId = uuidv4();
      const imageUrl = `/uploads/${bookId}/${file.filename}`; // chemin relatif pour servir les images

      // 📥 Insertion dans la BDD
      await insertPicture(
        pictureId,
        file.originalname,
        imageUrl,
        bookId,
        userId
      );

      insertedImages.push({
        id: pictureId,
        originalname: file.originalname,
        url: imageUrl,
      });
    }

    // ✅ Réponse succès
    res.status(201).json({
      success: true,
      message: "✅ Images uploadées et enregistrées avec succès",
      images: insertedImages,
    });
  } catch (error) {
    console.error("❌ Erreur serveur lors de l'upload :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'upload." });
  }
};
