"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbconfig_1 = require("../dbconfig"); // Vérifie que le chemin est bon
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// 📌 Route GET pour récupérer les books appartenant à l'utilisateur ou accessibles via invitation
router.get("/books", authMiddleware_1.verifyToken, async (req, res) => {
    if (!req.user?.id) {
        res.status(401).json({ error: "Non autorisé." });
        return;
    }
    const userId = req.user.id;
    try {
        const connection = await (0, dbconfig_1.getConnection)();
        const [rows] = await connection.execute(`SELECT DISTINCT b.* 
         FROM book b
         JOIN users_book ub ON b.id = ub.book_id
         WHERE ub.user_id = ?`, [userId]);
        res.json(rows.length > 0 ? rows : []);
    }
    catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});
// 📌 Route GET pour récupérer un book par ID avec ses images
router.get("/books/:id", authMiddleware_1.verifyToken, async (req, res) => {
    try {
        const connection = await (0, dbconfig_1.getConnection)();
        const bookId = parseInt(req.params.id, 10);
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Non autorisé" });
            return;
        }
        // Vérifier si l'utilisateur a accès au book
        const [accessRows] = await connection.execute(`SELECT 1 FROM users_book WHERE book_id = ? AND user_id = ?`, [bookId, userId]);
        if (accessRows.length === 0) {
            res.status(403).json({ error: "Accès refusé, vous n'avez pas les droits sur ce book" });
            return;
        }
        // 🔥 Récupérer les détails du book
        const [bookRows] = await connection.execute(`SELECT id, name, owner_id FROM book WHERE id = ?`, [bookId]);
        if (bookRows.length === 0) {
            res.status(404).json({ error: "Book non trouvé" });
            return;
        }
        res.status(200).json(bookRows[0]);
    }
    catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
// 📌 Route pour créer un book
router.post("/books", authMiddleware_1.verifyToken, async (req, res) => {
    console.log("📌 Token reçu :", req.header("Authorization"));
    if (!req.user?.id) {
        res.status(401).json({ error: "Non autorisé." });
        return;
    }
    try {
        const connection = await (0, dbconfig_1.getConnection)();
        const { title, owner_id } = req.body;
        // Exemple d’insertion :
        await connection.execute(`INSERT INTO book (name, owner_id) VALUES (?, ?)`, [title, req.user.id]);
        res.status(201).json({ message: "Livre ajouté avec succès" });
    }
    catch (error) {
        console.error("❌ Erreur lors de l'ajout du livre :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
exports.default = router;
