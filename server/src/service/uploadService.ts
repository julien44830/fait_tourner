import multer from "multer";
import path from "path";

// 📂 Définir le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 📂 Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName); // 🔥 Génération d'un nom unique
  },
});

// 🎯 Vérifier le type de fichier
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format non supporté. Formats acceptés : JPEG, PNG, JPG"), false);
  }
};

// 📤 Exporter la configuration Multer
export const upload = multer({ storage, fileFilter });
