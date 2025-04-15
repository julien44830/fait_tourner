import express, { Request, Response } from "express";
import multer from "multer";
import upload from "../service/uploadService";
import { v4 as uuidv4 } from "uuid";

import { verifyToken } from "../middleware/authMiddleware";
import { getConnection } from "../dbconfig";

interface AuthRequest extends Request {
  user: { id: string };
}

const router = express.Router();

// 📌 Route pour uploader une image vers un book
router.post(
  "/upload/:bookId",
  verifyToken as any,
  (req, res, next) => {
    const uploadMiddleware = upload.array("images", 10);
    uploadMiddleware(req, res, function (err) {
      if (err) {
        if (err instanceof multer.MulterError || err.message.includes("Type de fichier non autorisé")) {
          return res.status(400).json({ error: err.message });
        }
        console.error("❌ Erreur multer :", err);
        return res.status(500).json({ error: "Erreur serveur lors de l'upload." });
      }
      next();
    });
  },

  async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const bookId = req.params.bookId;
    const files = req.files as Express.Multer.File[];


    console.log('%c⧭', 'color: #00736b', userId);

    if (!userId) {
      res.status(401).json({ error: "Utilisateur non authentifié." });
      return;
    }

    if (!files || files.length === 0) {
      res.status(400).json({ error: "Aucun fichier accepté." });
      return;
    }

    try {
      const connection = await getConnection();
      console.log("🧪 Vérif accès : user_id =", userId, "book_id =", bookId);


      const [bookAccess]: any = await connection.execute(
        `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
        [userId, bookId]
      );

      if (bookAccess.length === 0) {
        console.log('%c⧭', 'color: #d0bfff', "Upload route appeller !");
        res.status(403).json({ error: "Vous n'avez pas accès à ce book." });
        return;
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
        message: "✅ Upload terminé.",
        pictures: uploadedPictures,
      });
      return
    } catch (error) {
      console.error("❌ Erreur lors de l'upload :", error);
      res.status(500).json({ error: "Erreur serveur." });
      return
    }
  }
);


export default router;
