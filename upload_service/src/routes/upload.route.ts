/**
 * 📂 Upload Route - Service d'upload d'images
 * 
 * Ce fichier configure :
 * - La création dynamique d'un dossier `/uploads/{bookId}` pour chaque book
 * - Le filtrage des fichiers pour accepter uniquement les images (jpeg, png, webp, gif)
 * - Le renommage des fichiers avec des UUIDs pour éviter les conflits
 * - La réponse HTTP après upload avec les chemins corrects pour le frontend
 * 
 * Utilise `multer` pour gérer l'upload des fichiers.
 * 
 * Auteur : Julien (fait_tourner) 🚀
 */

import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// 🛄 Initialisation du routeur Express
const router = Router();

// 📁 Chemin de base pour les uploads
const baseUploadPath = path.join(__dirname, "../../uploads");

// 🏗️ Création du dossier uploads s'il n'existe pas
if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
  console.log("📂 Dossier 'uploads' créé !");
}

// ✅ Liste des types de fichiers autorisés
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * 🌟 Fonction de filtrage pour multer
 * Vérifie si le fichier uploadé est bien une image autorisée
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log("📦 Type MIME reçu :", file.mimetype);

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn("❌ Type non supporté :", file.mimetype);
    cb(new Error("Type de fichier non supporté"));
  }
};

/**
 * 🛠️ Fonction dynamique pour créer un stockage multer à chaque requête
 */
function createDynamicUpload(bookId: string) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const bookUploadPath = path.join(baseUploadPath, bookId);

      if (!fs.existsSync(bookUploadPath)) {
        fs.mkdirSync(bookUploadPath, { recursive: true });
        console.log(`📁 Dossier créé pour le book : ${bookId}`);
      }

      cb(null, bookUploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = uuidv4() + ext;
      cb(null, filename);
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 Mo par fichier
      files: 10, // 10 fichiers max
    },
  });
}

/**
 * 🚀 Route POST /:bookId
 * - Récupère l'ID du book via l'URL
 * - Upload les images dans le dossier du book correspondant
 * - Retourne les chemins accessibles pour le frontend
 */
router.post("/:bookId", (req: Request, res: Response, next) => {
  const bookId = req.params.bookId;

  const uploadPath = path.join(baseUploadPath, bookId);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`📂 Dossier créé pour le book : ${bookId}`);
  }

  const upload = createDynamicUpload(bookId);
  upload.array("images", 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error("❌ Erreur multer :", err);
      return res.status(500).json({ error: "Erreur serveur lors de l'upload." });
    }
    next();
  });
}, (req: Request, res: Response): void => {
  const files = req.files as Express.Multer.File[];
  const bookId = req.params.bookId;

  console.log("📦 Types MIME reçus :", files.map(file => file.mimetype));
  console.log("📜 Fichiers reçus :", files);

  if (!files || files.length === 0) {
    res.status(400).json({ error: "Aucun fichier reçu." });
    return;
  }

  const uploaded = files.map((file) => ({
    filename: file.filename,
    originalname: file.originalname,
    url: `/uploads/${bookId}/${file.filename}`,
  }));

  console.log("📂 Images enregistrées :", uploaded);

  res.status(200).json({
    success: true,
    message: "Images uploadées avec succès",
    images: uploaded,
  });
});

// 🛫 Export du routeur
export default router;
