import express, { Request, Response } from "express";
import upload from "../service/uploadService";
import { v4 as uuidv4 } from "uuid";

import { verifyToken } from "../middleware/authMiddleware";
import { getConnection } from "../dbconfig";

interface AuthRequest extends Request {
  user: { id: string };
}

const router = express.Router();

// 📌 Route pour uploader une image vers un book
router.post("/upload/:bookId", upload.single("image"), verifyToken as any, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  let userId = authReq.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Utilisateur non authentifié." });
    return;
  }
  userId = (req as any).user?.id;
  const bookId = req.params.bookId;

  if (!req.file) {
    res.status(400).json({ error: "Aucun fichier envoyé." });
    return;
  }

  try {
    const connection = await getConnection();

    // 🔍 Vérifier si l'utilisateur a accès au book
    const [bookAccess]: any = await connection.execute(
      `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
      [userId, bookId]
    );

    if (bookAccess.length === 0) {
      res.status(403).json({ error: "Vous n'avez pas accès à ce book." });
      return;
    }

    // 📂 Enregistrer l'image en base de données
    const imagePath = `/uploads/${bookId}/${req.file.filename}`;
    const pictureId = uuidv4();
    await connection.execute(
      `INSERT INTO picture (id, name, path, book_id, user_id, is_private) VALUES (?, ?, ?, ?, ?, ?)`,
      [pictureId, req.file.filename, imagePath, bookId, userId, false]
    );

    // ✅ Envoie une réponse JSON correcte au frontend
    res.status(200).json({
      message: "Image uploadée avec succès !",
      picture_id: pictureId,
      path: imagePath,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'upload :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }

});

export default router;
