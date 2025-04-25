import multer from "multer";
import path from "path";
import fs from "fs";

// 📂 Définition du stockage avec `multer.diskStorage`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const bookId = req.params.bookId;

    // Vérifier que bookId est valide
    if (!bookId || typeof bookId !== "string") {
      return cb(new Error("Book ID invalide ou manquant"), "");
    }

    // 📂 Définir le chemin du sous-dossier
    const uploadPath = path.join(__dirname, "../../uploads", bookId);

    // 📂 Vérifier si le dossier existe, sinon le créer
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 🔥 Renommer le fichier avec un timestamp unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ Vérification du type de fichier autorisé
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // ✅ Autorisé
  } else {
    cb(
      new Error(
        "❌ Type de fichier non autorisé. Seuls les fichiers JPEG, PNG et WEBP sont acceptés."
      ),
      false
    );
  }
};

// 📌 Configuration de Multer avec fileFilter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // facultatif : 5 Mo max
});

export default upload;
