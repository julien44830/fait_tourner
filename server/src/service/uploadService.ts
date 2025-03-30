import multer from "multer";
import path from "path";
import fs from "fs";

// 📂 Définition du stockage avec `multer.diskStorage`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const bookId = req.params.bookId;
    console.log("📦 req.params dans destination:", req.params);

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

// 📌 Configuration de Multer
const upload = multer({ storage });

export default upload; // 🔥 Exporter `upload` pour l'utiliser ailleurs
