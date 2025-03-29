import express from "express";
import { login, register } from "../constrollers/authController";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res, next) => {
  next();
}, login);

router.post("/register", (req, res, next) => {
  next();
}, register);

router.get('/auth/google', (req, res, next) => {
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  "/api/auth/google/callback",
  (req, res, next) => {
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
    req.query.access_token = req.body.token;
    next();
  },
  passport.authenticate("google-token", { session: false }),
  (req, res) => {
    if (req.user) {

      // 🔐 Création du JWT
      const user = req.user as { id: string; email: string };
      const token = jwt.sign(
        {
          userId: user.id,
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
      console.error("❌ Échec d'authentification Google");
      res.status(401).json({ message: "Échec d'authentification Google" });
    }
  }
);

export default router;
