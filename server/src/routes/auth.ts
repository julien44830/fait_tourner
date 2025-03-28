import express from "express";
import { login, register } from "../constrollers/authController";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res, next) => {
  console.log("📨 Requête POST /login reçue");
  next();
}, login);

router.post("/register", (req, res, next) => {
  console.log("📨 Requête POST /register reçue");
  next();
}, register);

router.get('/auth/google', (req, res, next) => {
  console.log("🌐 Requête GET /auth/google reçue → redirection vers Google");
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  "/api/auth/google/callback",
  (req, res, next) => {
    console.log("🔁 Requête GET /api/auth/google/callback reçue");
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "/connexion",
  }),
  (req, res) => {
    console.log("✅ Authentification Google réussie, redirection vers le front");
    res.redirect("https://fait-tourner.vercel.app/accueil");
  }
);

router.post(
  "/auth/google/token",
  (req, res, next) => {
    console.log("📥 Requête POST /auth/google/token reçue");
    console.log("👉 Token reçu :", req.body.token);
    req.query.access_token = req.body.token;
    next();
  },
  passport.authenticate("google-token", { session: false }),
  (req, res) => {
    if (req.user) {
      console.log("✅ Utilisateur authentifié avec Google :", req.user);

      // 🔐 Création du JWT
      const user = req.user as { id: string; email: string };
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.SECRET_KEY!, { expiresIn: "2h" }
      );

      // ✅ Réponse avec token + user
      res.status(200).json({
        message: "Authentifié avec Google",
        token,
        user: req.user,
      });
    } else {
      console.log("❌ Échec d'authentification Google");
      res.status(401).json({ message: "Échec d'authentification Google" });
    }
  }
);

export default router;
