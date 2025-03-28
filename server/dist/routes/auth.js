"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../constrollers/authController");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post("/login", (req, res, next) => {
    console.log("📨 Requête POST /login reçue");
    next();
}, authController_1.login);
router.post("/register", (req, res, next) => {
    console.log("📨 Requête POST /register reçue");
    next();
}, authController_1.register);
router.get('/auth/google', (req, res, next) => {
    console.log("🌐 Requête GET /auth/google reçue → redirection vers Google");
    next();
}, passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/api/auth/google/callback", (req, res, next) => {
    console.log("🔁 Requête GET /api/auth/google/callback reçue");
    next();
}, passport_1.default.authenticate("google", {
    failureRedirect: "/connexion",
}), (req, res) => {
    console.log("✅ Authentification Google réussie, redirection vers le front");
    res.redirect("https://fait-tourner.vercel.app/accueil");
});
router.post("/auth/google/token", (req, res, next) => {
    console.log("📥 Requête POST /auth/google/token reçue");
    console.log(req.body);
    next();
}, passport_1.default.authenticate("google-token"), (req, res) => {
    if (req.user) {
        console.log("✅ Utilisateur authentifié avec Google :", req.user);
        res.status(200).json({ message: "Authentifié avec Google", user: req.user });
    }
    else {
        console.log("❌ Échec d'authentification Google");
        res.status(401).json({ message: "Échec d'authentification Google" });
    }
});
exports.default = router;
