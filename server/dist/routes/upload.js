"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadService_1 = __importDefault(require("../service/uploadService"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const dbconfig_1 = require("../dbconfig");
const router = express_1.default.Router();
// 📌 Route pour uploader une image vers un book
router.post("/upload/:bookId", authMiddleware_1.verifyToken, uploadService_1.default.single("image"), async (req, res) => {
    try {
        const userId = req.user?.id;
        const bookId = parseInt(req.params.bookId, 10);
        if (!req.file) {
            res.status(400).json({ error: "Aucun fichier envoyé." });
            return;
        }
        const connection = await (0, dbconfig_1.getConnection)();
        // 🔍 Vérifier si l'utilisateur a accès au book
        const [bookAccess] = await connection.execute(`SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`, [userId, bookId]);
        if (bookAccess.length === 0) {
            res.status(403).json({ error: "Vous n'avez pas accès à ce book." });
            return;
        }
        // 📂 Enregistrer l'image en base de données
        const imagePath = `/uploads/${bookId}/${req.file.filename}`;
        await connection.execute(`INSERT INTO picture (name, path, book_id, user_id, is_private) VALUES (?, ?, ?, ?, ?)`, [req.file.filename, imagePath, bookId, userId, false]);
        res.json({ message: "Image uploadée avec succès !", path: imagePath });
    }
    catch (error) {
        console.error("❌ Erreur lors de l'upload :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});
exports.default = router;
