import express, { Request, Response } from "express";
import { upload } from "../service/uploadService";
import { verifyToken } from "../middleware/authMiddleware";
import { getConnection } from "../dbconfig";

const router = express.Router();

// 📌 Route pour uploader une image vers un book
router.post(
  "/upload/:bookId",
  verifyToken,
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const bookId = parseInt(req.params.bookId, 10);

      if (!req.file) {
        res.status(400).json({ error: "Aucun fichier envoyé." });
        return;
      }

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
      const imagePath = `/uploads/${req.file.filename}`;
      await connection.execute(
        `INSERT INTO picture (name, path, book_id, user_id, is_private) VALUES (?, ?, ?, ?, ?)`,
        [req.file.filename, imagePath, bookId, userId, false]
      );

      res.json({ message: "Image uploadée avec succès !", path: imagePath });
    } catch (error) {
      console.error("❌ Erreur lors de l'upload :", error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  }
);

export default router;
