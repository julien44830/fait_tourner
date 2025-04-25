import { Request, Response } from "express";
import { getConnection } from "../db/dbconfig";
import { v4 as uuidv4 } from "uuid";


export const handleUpload = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as { id: string; email: string };
  const bookId = req.params.bookId;
  const files = req.files as Express.Multer.File[];

  if (!user.id) {
    res.status(401).json({ error: "Utilisateur non authentifié." });
    return;
  }

  if (!files || files.length === 0) {
    res.status(400).json({ error: "Aucun fichier accepté." });
    return;
  }

  try {
    const connection = await getConnection();

    const [bookAccess]: any = await connection.execute(
      `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
      [user.id, bookId]
    );

    if (bookAccess.length === 0) {
      res.status(403).json({ error: "Vous n'avez pas accès à ce book." });
      return;
    }

    const uploadedPictures = [];

    for (const file of files) {
      const imagePath = `/uploads/${bookId}/${file.filename}`;
      const pictureId = uuidv4();

      await connection.execute(
        `INSERT INTO picture (id, name, path, book_id, user_id, is_private) VALUES (?, ?, ?, ?, ?, ?)`,
        [pictureId, file.originalname, imagePath, bookId, user.id, false]
      );

      uploadedPictures.push({
        picture_id: pictureId,
        path: imagePath,
        name: file.originalname,
      });
    }

    res.status(200).json({
      message: "✅ Upload terminé.",
      pictures: uploadedPictures,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'upload :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
