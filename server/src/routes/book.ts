// 📘 Fichier : routes/books.ts
// ==============================
// Ce fichier contient les routes principales de gestion des "books" (albums photo)
// pour un utilisateur :
// - Récupérer ses books
// - Créer un nouveau book
// - Supprimer un book (ou retirer un accès partagé)
// - Récupérer un book et ses images

import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getConnection } from "../dbconfig";
import { verifyToken } from "../middleware/authMiddleware";
import fs from "fs";
import path from "path";

const router = express.Router();

interface AuthRequest extends Request {
  user?: { id?: string };
}

// ============================
// 🔍 GET /books
// Récupère tous les books accessibles par l'utilisateur
// (ceux qu'il a créés ou ceux partagés avec lui)
// ============================
router.get("/books", verifyToken as express.RequestHandler, async (req: AuthRequest, res: Response): Promise<void> => {
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
});


// ============================
// 🔍 GET /book/:id
// Récupère un book et ses images/tags si l'utilisateur y a accès
// ============================
router.get("/book/:id", verifyToken as any, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const connection = await getConnection();
    const bookId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Non autorisé" });
      return
    }

    // ✅ Vérifier les droits d'accès
    const [accessRows]: any = await connection.execute(
      `SELECT 1 FROM users_book WHERE book_id = ? AND user_id = ?`,
      [bookId, userId]
    );
    if (accessRows.length === 0) {
      res.status(403).json({ error: "Accès refusé" });
      return
    }

    // ✅ Récupérer les infos du book
    const [bookRows]: any = await connection.execute(
      `SELECT id, name, owner_id FROM book WHERE id = ?`,
      [bookId]
    );
    if (bookRows.length === 0) {

      res.status(404).json({ error: "Book non trouvé" });
      return
    }

    // ✅ Récupérer les images + tags
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

    res.status(200).json({ book: bookRows[0], pictures });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// ============================
// ➕ POST /books
// Crée un nouveau book et l'associe à l'utilisateur connecté
// ============================
router.post("/books", verifyToken as any, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user?.id) {
    res.status(401).json({ error: "Non autorisé." });
    return
  }

  try {
    const connection = await getConnection();
    const { title } = req.body;
    const owner_id = String(req.user.id).trim();
    const bookId = uuidv4();

    await connection.execute(
      `INSERT INTO book (id, name, owner_id) VALUES (?, ?, ?)`,
      [bookId, title, owner_id]
    );

    await connection.execute(
      `INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES (?, ?, true, 'owner')`,
      [owner_id, bookId]
    );

    res.status(201).json({ bookId, message: "📘 Book ajouté avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du livre :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// ============================
// ❌ DELETE /book/:id
// Si proprio → supprime tout (images, accès, fichiers, book)
// Sinon → retire juste l'accès de l'utilisateur
// ============================
router.delete("/book/:id", verifyToken as any, async (req: AuthRequest, res: Response): Promise<void> => {
  const bookId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Non autorisé." });
    return
  }
  try {
    const connection = await getConnection();

    const [ownerRows]: any = await connection.execute(
      `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
      [userId, bookId]
    );

    if (ownerRows.length === 0) {
      res.status(403).json({ error: "Accès refusé au book." });
      return
    }

    const isOwner = ownerRows[0].is_owner;

    // ❌ NON proprio → juste supprimer son accès
    if (!isOwner) {
      await connection.execute(
        `DELETE FROM users_book WHERE user_id = ? AND book_id = ?`,
        [userId, bookId]
      );
      res.status(200).json({ message: "Accès retiré (non proprio)" });
      return
    }

    // ✅ Proprio → suppression totale
    const [pictures]: any = await connection.execute(
      `SELECT path FROM picture WHERE book_id = ?`,
      [bookId]
    );

    for (const pic of pictures) {
      const imagePath = path.join(__dirname, "../../uploads", bookId, path.basename(pic.path));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await connection.execute(
      `DELETE pt FROM picture_tag pt
       JOIN picture p ON pt.picture_id = p.id
       WHERE p.book_id = ?`,
      [bookId]
    );

    await connection.execute(`DELETE FROM picture WHERE book_id = ?`, [bookId]);
    await connection.execute(`DELETE FROM users_book WHERE book_id = ?`, [bookId]);
    await connection.execute(`DELETE FROM book WHERE id = ?`, [bookId]);

    const bookFolder = path.join(__dirname, "../../uploads", bookId);
    if (fs.existsSync(bookFolder) && fs.readdirSync(bookFolder).length === 0) {
      fs.rmdirSync(bookFolder);
    }

    res.status(200).json({ message: "📕 Book supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du book :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

export default router;
