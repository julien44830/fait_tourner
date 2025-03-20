import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { getConnection } from "../dbconfig"; // Assure-toi que ce chemin est correct

const SECRET_KEY = "ton_secret_token"; // Remplace par une variable d'environnement

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const connection = await getConnection();
    const [users]: any = await connection.execute(
      "SELECT id, name, password FROM user WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      res.status(401).json({ error: "Utilisateur non trouvé" });
      return
    }

    const user = users[0];

    // Vérifier le mot de passe avec Argon2
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      res.status(401).json({ error: "Mot de passe incorrect" });
      return
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, name: user.name },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({ token, userId: user.id, name: user.name, lastname: user.lastname });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, token } = req.body;
    const connection = await getConnection();

    // Vérifier si l'utilisateur existe déjà
    const [existingUser]: any = await connection.execute(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      res.status(400).json({ error: "Un compte avec cet email existe déjà." });
      return
    }

    // Créer l'utilisateur
    const [result]: any = await connection.execute(
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    const newUserId = result.insertId;

    // ✅ Si un token d'invitation est présent, ajouter l'utilisateur au book
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { bookId: number, email: string };

        await connection.execute(
          "INSERT INTO users_book (user_id, book_id, role) VALUES (?, ?, 'member')",
          [newUserId, decoded.bookId]
        );

        console.log(`✅ L'utilisateur ${email} a été ajouté au book ${decoded.bookId}`);
      } catch (err) {
        console.error("❌ Erreur lors de la validation du token d'invitation :", err);
      }
    }

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};