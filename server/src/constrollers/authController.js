"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const dbconfig_1 = require("../dbconfig"); // Assure-toi que ce chemin est correct
const SECRET_KEY = process.env.SECRET_KEY; // Remplace par une variable d'environnement
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Vérifier si l'utilisateur existe
        const connection = await (0, dbconfig_1.getConnection)();
        const [users] = await connection.execute("SELECT id, name, password FROM user WHERE email = ?", [email]);
        if (users.length === 0) {
            res.status(401).json({ error: "Utilisateur non trouvé" });
            return;
        }
        const user = users[0];
        // Vérifier le mot de passe avec Argon2
        const passwordValid = await argon2_1.default.verify(user.password, password);
        if (!passwordValid) {
            res.status(401).json({ error: "Mot de passe incorrect" });
            return;
        }
        // Générer un token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, name: user.name }, SECRET_KEY, { expiresIn: "2h" });
        res.json({ token, userId: user.id, name: user.name, lastname: user.lastname });
    }
    catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { name, email, password, token } = req.body;
        const connection = await (0, dbconfig_1.getConnection)();
        // ✅ Vérifier si l'utilisateur existe déjà
        const [existingUser] = await connection.execute("SELECT id FROM user WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            res.status(400).json({ error: "Un compte avec cet email existe déjà." });
            return;
        }
        // ✅ Hachage du mot de passe avec Argon2
        const hashedPassword = await argon2_1.default.hash(password);
        // ✅ Créer l'utilisateur avec le mot de passe haché
        const [result] = await connection.execute("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
        const newUserId = result.insertId;
        // ✅ Si un token d'invitation est présent, ajouter l'utilisateur au book
        // ✅ Ajout de l'utilisateur au book après inscription
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                console.log(`📩 Token décodé : email=${decoded.email}, bookId=${decoded.bookId}`);
                const [bookCheck] = await connection.execute("SELECT id FROM book WHERE id = ?", [decoded.bookId]);
                if (bookCheck.length === 0) {
                    console.error("❌ Erreur : Le book n'existe pas.");
                    res.status(400).json({ error: "Le book n'existe pas." });
                    return;
                }
                const [insertResult] = await connection.execute("INSERT INTO users_book (user_id, book_id, role) VALUES (?, ?, 'viewer')", [newUserId, decoded.bookId]);
                if (insertResult.affectedRows > 0) {
                }
                else {
                    console.error("❌ Échec de l'ajout du book.");
                }
            }
            catch (err) {
                console.error("❌ Erreur lors de la validation du token d'invitation :", err);
                res.status(400).json({ error: "Token invalide ou expiré." });
                return;
            }
        }
        res.status(201).json({ message: "Inscription réussie !" });
    }
    catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};
exports.register = register;
