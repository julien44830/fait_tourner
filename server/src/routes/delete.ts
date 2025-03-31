import express from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../dbconfig"; // adapte le chemin selon ton projet
import { sendDeleteAccountEmail } from "../service/mailerService";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// Route pour demander la suppression du compte
router.post("/request-delete", verifyToken, async (req: Request, res: Response): Promise<void> => {
  // On suppose que req.user contient l'utilisateur authentifié (grâce à un middleware d'auth)
  const user = req.user as { id: string; email: string };
  if (!user) {
    res.status(401).json({ message: "Utilisateur non authentifié." });
    return;
  }

  try {
    // Génération d'un token de suppression valable 1 heure
    const deleteToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Construction du lien de confirmation à envoyer par e-mail
    const link = `https://tonapp.com/confirm-delete?token=${deleteToken}`;

    // Envoi de l'e-mail de confirmation via le service mailer
    await sendDeleteAccountEmail(user.email, link);

    res.status(200).json({ message: "Un e-mail de confirmation vous a été envoyé." });
  } catch (error) {
    console.error("Erreur lors de la demande de suppression :", error);
    res.status(500).json({ message: "Erreur lors de la demande de suppression." });
  }
});

// Route appelée lors du clic sur le lien de suppression envoyé par email
router.get("/confirm-delete", verifyToken, async (req: Request, res: Response): Promise<void> => {
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
