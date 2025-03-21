"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// 📂 Définition du stockage avec `multer.diskStorage`
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const bookId = req.params.bookId;
        // Vérifier que bookId est valide
        if (!bookId || isNaN(Number(bookId))) {
            return cb(new Error("Book ID invalide ou manquant"), "");
        }
        // 📂 Définir le chemin du sous-dossier
        const uploadPath = path_1.default.join(__dirname, "../../uploads", bookId);
        // 📂 Vérifier si le dossier existe, sinon le créer
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // 🔥 Renommer le fichier avec un timestamp unique
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// 📌 Configuration de Multer
const upload = (0, multer_1.default)({ storage });
exports.default = upload; // 🔥 Exporter `upload` pour l'utiliser ailleurs
