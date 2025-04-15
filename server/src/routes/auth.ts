import express from "express";
import { getConnection } from "../dbconfig";
import { login, register } from "../constrollers/authController";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// src/routes/auth.ts

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
  async (req, res, next) => {
    req.query.access_token = req.body.token;
    next();
  },

  passport.authenticate("google-token", { session: false }),

  async (req, res, next) => {

    try {
      if (!req.user) {
        console.error("❌ Échec d'authentification Google");
        res.status(401).json({ message: "Échec d'authentification Google" });
        return;
      }

      const user = req.user as { id: string; email: string };
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.SECRET_KEY!,
        { expiresIn: "2h" }
      );

      // 📦 Récupération du token d’invitation s’il existe
      const invitationToken = req.body.token;

      if (invitationToken) {
        try {
          const decoded = jwt.verify(invitationToken, process.env.SECRET_KEY!) as {
            bookId: string;
            email: string;
          };

          const connection = await getConnection();

          // 🔎 Vérifie si l'utilisateur est déjà dans le book
          const [linkRows]: any = await connection.execute(
            `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
            [user.id, decoded.bookId]
          );

          if (linkRows.length === 0) {
            await connection.execute(
              `INSERT INTO users_book (user_id, book_id, role, is_owner) VALUES (?, ?, 'viewer', 0)`,
              [user.id, decoded.bookId]
            );
            console.log("✅ Utilisateur ajouté au book via Google :", user.id, decoded.bookId);
          } else {
            console.log("ℹ️ Utilisateur déjà lié à ce book");
          }

        } catch (err) {
          console.error("❌ Token d'invitation invalide ou expiré :", err);
          res.status(400).json({ error: "Token d'invitation invalide ou expiré." });
          return;
        }
      }

      res.status(200).json({
        message: "Authentifié avec Google",
        token,
        user,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;