import express, { Request, Response } from "express";
import upload from "../service/uploadService";
import { verifyToken } from "../middleware/authMiddleware";
import { getConnection } from "../dbconfig";

interface AuthRequest extends Request {
  user: { id: number };
}

const router = express.Router();

// 📌 Route pour uploader une image vers un book
router.post("/upload/:bookId", verifyToken as any, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  let userId = authReq.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Utilisateur non authentifié." });
    return;
  }
  userId = (req as any).user?.id;
  const bookId = parseInt(req.params.bookId, 10);

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
    await connection.execute(
      `INSERT INTO picture (name, path, book_id, user_id, is_private) VALUES (?, ?, ?, ?, ?)`,
      [req.file.filename, imagePath, bookId, userId, false]
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'upload :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }

});

export default router;
