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
    const { name, email, password } = req.body;

    // Hash du mot de passe avec Argon2
    const hashedPassword = await argon2.hash(password);

    const connection = await getConnection();
    await connection.execute(
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
