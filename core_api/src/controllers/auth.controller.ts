import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";
import { getConnection } from "../db/dbconfig";

import { findUserByEmail, createUser } from "../models/user.model";
import { findBookById, addUserToBook } from "../models/book.model";


const SECRET_KEY = process.env.SECRET_KEY as string;


export const loginWithGoogle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Échec d'authentification Google" });
      return
    }

    const user = req.user as { id: string; email: string };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    const invitationToken = req.body.token;

    if (invitationToken) {
      try {
        const decoded = jwt.verify(invitationToken, SECRET_KEY) as { bookId: string; email: string };
        const connection = await getConnection();

        const [linkRows]: any = await connection.execute(
          `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
          [user.id, decoded.bookId]
        );

        if (linkRows.length === 0) {
          await connection.execute(
            `INSERT INTO users_book (user_id, book_id, role, is_owner) VALUES (?, ?, 'viewer', 0)`,
            [user.id, decoded.bookId]
          );
        }
      } catch (err) {
        res.status(400).json({ error: "Token d'invitation invalide ou expiré." });
        return
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
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Utilisateur non trouvé" });
      return;
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      res.status(401).json({ error: "Mot de passe incorrect" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({ token, userId: user.id, name: user.name });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, token } = req.body;

    // 🔎 Vérifier si l'utilisateur existe déjà
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "Un compte avec cet email existe déjà." });
      return;
    }

    // 🔐 Hachage du mot de passe
    const hashedPassword = await argon2.hash(password);

    // 🆔 Générer un ID unique pour l'utilisateur
    const userId = uuidv4();

    // 📝 Création de l'utilisateur
    await createUser(userId, name, email, hashedPassword);

    // 📩 Gérer le token d'invitation s'il est présent
    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY) as { bookId: string; email: string };

        const book = await findBookById(decoded.bookId);
        if (!book) {
          res.status(400).json({ error: "Le book n'existe pas." });
          return;
        }

        const success = await addUserToBook(userId, decoded.bookId);
        if (!success) {
          console.error("❌ Échec de l'ajout de l'utilisateur au book");
        }
      } catch (err) {
        console.error("❌ Erreur lors de la validation du token d'invitation :", err);
        res.status(400).json({ error: "Token invalide ou expiré." });
        return;
      }
    }

    // ✅ Succès
    res.status(201).json({ message: "Inscription réussie !" });

  } catch (error) {
    console.error("❌ Erreur serveur dans register :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
