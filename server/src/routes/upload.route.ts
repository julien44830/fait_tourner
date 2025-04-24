import { Router } from "express";
import multer from "multer";
import upload from "../service/uploadService";
import { verifyToken } from "../middlewares/auth.middleware";
import { handleUpload } from "../controllers/upload.controller";

export const uploadRouter = Router();

uploadRouter.post(
  "/upload/:bookId",
  verifyToken,
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
  handleUpload
);
