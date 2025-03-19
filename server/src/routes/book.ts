import express, { Request, Response } from "express";
import { getConnection } from "../dbconfig"; // Vérifie que le chemin est bon

const router = express.Router();


// 📌 Route GET pour récupérer tout les books
router.get("/books", async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await getConnection(); // Connexion à la BDD
    const bookId = parseInt(req.params.id, 10);

    // 🔥 Requête SQL pour récupérer un book
    const [rows]: any = await connection.execute(
      "SELECT * FROM book",
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

// 📌 Route GET pour récupérer un book par ID
router.get("/books/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await getConnection(); // Connexion à la BDD
    const bookId = parseInt(req.params.id, 10);

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
