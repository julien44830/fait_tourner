import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { getConnection } from "../dbconfig"; // Vérifie que le chemin est bon
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

interface AuthRequest extends Request {
  user?: { id?: string };
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


// 📌 Route GET pour récupérer un book par ID avec ses images et leurs tags
router.get("/book/:id", verifyToken as any, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const connection = await getConnection();
    const bookId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Non autorisé" });
      return;
    }

    // Vérifier l'accès
    const [accessRows]: any = await connection.execute(
      `SELECT 1 FROM users_book WHERE book_id = ? AND user_id = ?`,
      [bookId, userId]
    );

    if (accessRows.length === 0) {
      res.status(403).json({ error: "Accès refusé" });
      return;
    }

    // Récupérer le book
    const [bookRows]: any = await connection.execute(
      `SELECT id, name, owner_id FROM book WHERE id = ?`,
      [bookId]
    );

    if (bookRows.length === 0) {
      res.status(404).json({ error: "Book non trouvé" });
      return;
    }

    // Récupérer les images avec tags
    const [pictures]: any = await connection.execute(
      `SELECT p.id AS picture_id, p.name AS picture_name, p.path,
              JSON_ARRAYAGG(t.name) AS tags
       FROM picture p
       LEFT JOIN picture_tag pt ON p.id = pt.picture_id
       LEFT JOIN tag t ON pt.tag_id = t.id
       WHERE p.book_id = ?
       GROUP BY p.id`,
      [bookId]
    );

    res.status(200).json({
      book: bookRows[0],
      pictures,
    });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// 📘 Route : créer un book et lier à l'utilisateur
router.post("/books", verifyToken as any, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user?.id) {
    res.status(401).json({ error: "Non autorisé." });
    return;
  }

  try {
    const connection = await getConnection();

    const { title } = req.body;
    const owner_id = String(req.user.id).trim(); // ← id de l'utilisateur connecté
    const bookId = uuidv4(); // ← id du book

    ("📦 Body reçu :", req.body);
    ("🆔 UUID généré :", bookId);
    ("👤 owner_id :", owner_id, "→ longueur :", owner_id.length);

    // 🔹 Insertion du book
    await connection.execute(
      `INSERT INTO book (id, name, owner_id) VALUES (?, ?, ?)`,
      [bookId, title, owner_id]
    );

    // 🔹 Insertion dans users_book
    await connection.execute(
      `INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES (?, ?, ?, ?)`,
      [owner_id, bookId, true, 'owner']
    );

    res.status(201).json({ message: "📘 Livre ajouté avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du livre :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
// Assurez-vous d'avoir installé uuid : npm install uuid