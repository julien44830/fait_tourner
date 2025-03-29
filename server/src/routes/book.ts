import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { getConnection } from "../dbconfig"; // Vérifie que le chemin est bon
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

interface AuthRequest extends Request {
  user?: { id?: number };
}

// 📌 Route GET pour récupérer les books appartenant à l'utilisateur ou accessibles via invitation
router.get(
  "/books",
  verifyToken as unknown as express.RequestHandler,
  async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: "Non autorisé." });
      return;
    }

    const userId = req.user.id;

    try {
      const connection = await getConnection();

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
  }
);


// 📌 Route GET pour récupérer un book par ID avec ses images
router.get("/books/:id", verifyToken as any, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const connection = await getConnection();
    const bookId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Non autorisé" });
      return;
    }

    // Vérifier si l'utilisateur a accès au book
    const [accessRows]: any = await connection.execute(
      `SELECT 1 FROM users_book WHERE book_id = ? AND user_id = ?`,
      [bookId, userId]
    );

    if (accessRows.length === 0) {
      res.status(403).json({ error: "Accès refusé, vous n'avez pas les droits sur ce book" });
      return;
    }

    // 🔥 Récupérer les détails du book
    const [bookRows]: any = await connection.execute(
      `SELECT id, name, owner_id FROM book WHERE id = ?`,
      [bookId]
    );

    if (bookRows.length === 0) {
      res.status(404).json({ error: "Book non trouvé" });
      return;
    }

    res.status(200).json(bookRows[0]);

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 📌 Route pour créer un book
router.post("/books", verifyToken as any, async (req: AuthRequest, res: Response): Promise<void> => {

  if (!req.user?.id) {
    res.status(401).json({ error: "Non autorisé." });
    return;
  }

  try {
    const connection = await getConnection();
    const { title } = req.body;
    const owner_id = req.user?.id;
    const bookId = uuidv4();

    console.log("📦 Body reçu :", req.body);
    console.log("📘 UUID généré :", bookId);

    // Exemple d’insertion :
    await connection.execute(
      `INSERT INTO book (name, owner_id) VALUES (?, ?)`,
      [bookId, title, owner_id]
    );
    res.status(201).json({ message: "Livre ajouté avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du livre :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});





export default router;
// Assurez-vous d'avoir installé uuid : npm install uuid