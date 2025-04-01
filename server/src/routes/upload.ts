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
router.post("/upload/:bookId", upload.array("images", 10), verifyToken as any, async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  let userId = authReq.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Utilisateur non authentifié." });
    return
  }

  const bookId = req.params.bookId;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({ error: "Aucun fichier envoyé." });
    return
  }

  if (files.length > 10) {
    res.status(400).json({ error: "Trop de fichiers (10 max)." });
    return
  }

  try {
    const connection = await getConnection();

    // 🔍 Vérifie si l'utilisateur a accès au book
    const [bookAccess]: any = await connection.execute(
      `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
      [userId, bookId]
    );

    if (bookAccess.length === 0) {
      res.status(403).json({ error: "Vous n'avez pas accès à ce book." });
      return
    }

    const uploadedPictures = [];

    for (const file of files) {
      const imagePath = `/uploads/${bookId}/${file.filename}`;
      const pictureId = uuidv4();

      await connection.execute(
        `INSERT INTO picture (id, name, path, book_id, user_id, is_private) VALUES (?, ?, ?, ?, ?, ?)`,
        [pictureId, file.originalname, imagePath, bookId, userId, false]
      );

      uploadedPictures.push({
        picture_id: pictureId,
        path: imagePath,
        name: file.originalname,
      });
    }

    res.status(200).json({
      message: "✅ Images uploadées avec succès !",
      pictures: uploadedPictures,
    });
    return
  } catch (error) {
    console.error("❌ Erreur lors de l'upload :", error);
    res.status(500).json({ error: "Erreur serveur." });
    return
  }
});


export default router;
