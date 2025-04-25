import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// 📁 Dossier de destination
const uploadPath = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// ✅ Types autorisés
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// 🎯 Filtres de type MIME
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  console.log("📦 Type MIME reçu :", file.mimetype);

  if (/^image\//.test(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn("❌ Type non supporté :", file.mimetype);
    cb(null, false); // ✅ silencieux mais propre
  }
};

// 📦 Stockage local avec nom en UUID
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext;
    cb(null, filename);
  },
});

// ⚙️ Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo max par fichier
    files: 10, // Maximum 10 fichiers
  },
});

// 🚀 Route multi-upload
// ✅ Utiliser multer comme middleware directement dans la route
router.post("/", upload.array("images", 10), (req, res): void => {
  const files = req.files as Express.Multer.File[];
  console.log("📦 Types MIME reçus :", files.map(file => file.mimetype));
  console.log("🧾 Fichiers reçus :", files);

  if (!files || files.length === 0) {
    res.status(400).json({ error: "Aucun fichier reçu." });
    return;
  }

  const uploaded = files.map((file) => ({
    filename: file.filename,
    originalname: file.originalname,
    url: `/uploads/${file.filename}`,
  }));

  res.status(200).json({
    success: true,
    message: "Images uploadées avec succès",
    images: uploaded,
  });
});


export default router;
