import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../db/dbconfig";
import { sendDeleteAccountEmail } from "../service/mailerService";
import fs from "fs";
import path from "path";


// POST /request-delete
export const requestDeleteAccount = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as { id: string; email: string };

  if (!user) {
    res.status(401).json({ message: "Utilisateur non authentifié." });
    return;
  }

  try {
    const deleteToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    const baseUrl = process.env.BACKEND_URL || "http://localhost:4000";

    const link = `${baseUrl}/confirm-delete?token=${deleteToken}`;
    await sendDeleteAccountEmail(user.email, link);

    res.status(200).json({ message: "Un e-mail de confirmation vous a été envoyé." });
  } catch (error) {
    console.error("Erreur lors de la demande de suppression :", error);
    res.status(500).json({ message: "Erreur lors de la demande de suppression." });
  }
};

// ✅ GET /confirm-delete
export const confirmDeleteAccount = async (req: Request, res: Response): Promise<void> => {
  const token = req.query.token as string;

  if (!token) {
    res.status(400).send("Token manquant.");
    return;
  }

  try {
    // ✅ Vérifie et décode le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
    const userId = decoded.id;

    const connection = await getConnection();

    // 📦 Récupère tous les books de l'utilisateur
    const [books]: any = await connection.execute(
      "SELECT id FROM book WHERE owner_id = ?",
      [userId]
    );

    // 🧹 Supprime les dossiers physiques associés à chaque book
    for (const book of books) {
      const folderPath = path.join(__dirname, "..", "..", "uploads", book.id);
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log("🗑️ Dossier supprimé :", folderPath);
      }
    }

    // ❌ Supprime le compte utilisateur (et tout en cascade via les contraintes SQL)
    await connection.execute("DELETE FROM user WHERE id = ?", [userId]);
    await connection.end();

    res.send("Votre compte a été supprimé avec succès.");
  } catch (error) {
    console.error("❌ Erreur lors de la confirmation de suppression :", error);
    res.status(400).send("Lien invalide ou expiré.");
  }
};