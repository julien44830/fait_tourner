import express from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../dbconfig"; // adapte le chemin selon ton projet

const router = express.Router();

// Route appelée lors du clic sur le lien de suppression envoyé par email
router.get("/confirm-delete", async (req: Request, res: Response): Promise<void> => {
  // Récupération du token passé en query string
  const token = req.query.token as string;
  if (!token) {
    res.status(400).send("Token manquant.");
    return
  }

  try {
    // Décodage et vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    // Obtention d'une connexion à la base de données
    const connection = await getConnection();

    // Exécution de la requête SQL pour supprimer l'utilisateur
    // Assure-toi que le nom de la table ("users") correspond à celui de ta base de données
    await connection.query("DELETE FROM users WHERE id = ?", [decoded.id]);

    // Fermeture de la connexion
    await connection.end();

    // Envoi d'une réponse confirmant la suppression
    res.send("Votre compte a été supprimé avec succès.");
  } catch (err) {
    // En cas de token invalide ou expiré
    res.status(400).send("Lien invalide ou expiré.");
  }
});

export default router;
