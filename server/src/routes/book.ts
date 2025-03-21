import express, { Request, Response, NextFunction } from "express";
import { getConnection } from "../dbconfig"; // Vérifie que le chemin est bon
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

interface AuthRequest extends Request {
  user?: { id: number };
}

// 📌 Route GET pour récupérer les books appartenant à l'utilisateur ou accessibles via invitation
router.get("/books", verifyToken, async (req: AuthRequest, res: Response) => {

  if (!req.user?.id) {
    res.status(401).json({ error: "Non autorisé." });
    return;
  }

  try {
    const connection = await getConnection();
    const userId = req.user.id;

    const [rows]: any = await connection.execute(
      `SELECT DISTINCT b.* 
       FROM book b
       JOIN users_book ub ON b.id = ub.book_id
       WHERE ub.user_id = ?`,
      [userId]
    );

    res.json(rows.length > 0 ? rows : []);
  } catch (error) {
    console.error("❌ Erreur MySQL :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});


// 📌 Route GET pour récupérer un book par ID
router.get("/books/:id", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await getConnection(); // Connexion à la BDD
    const bookId = parseInt(req.params.id, 10);
    const userId = (req as AuthRequest).user?.id; // Récupérer l'ID de l'utilisateur connecté

    if (!userId) {
      res.status(401).json({ error: "Non autorisé" });
      return;
    }

    const [accessRows]: any = await connection.execute(
      `SELECT 1 
      FROM users_book 
      WHERE book_id = ? AND user_id = ?`,
      [bookId, userId]
    );

    if (accessRows.length === 0) {
      res.status(403).json({ error: "Accès refusé, vous n'avez pas les droits sur ce book" });
      return;
    }

    // 🔥 Requête SQL pour récupérer un book
    const [rows]: any = await connection.execute(
      `SELECT 
          picture.id AS picture_id, 
          picture.name AS picture_name, 
          picture.user_id, 
          picture.is_private, 
          picture.create_at, 
          picture.date_upload,
          picture.path,
          GROUP_CONCAT(tag.name) AS tags
          FROM picture
          LEFT JOIN picture_tag ON picture_tag.picture_id = picture.id
          LEFT JOIN tag ON tag.id = picture_tag.tag_id
          WHERE picture.book_id = ?
          GROUP BY picture.id;`,
      [bookId]
    );


    if (rows.length === 0) {
      res.status(404).json({ error: "Book non trouvé" });
      return
    }

    res.json(rows);
    return
  } catch (error) {
    console.error("❌ Erreur MySQL :", error);
    res.status(500).json({ error: "Erreur serveur" });
    return
  }
});



export default router;
