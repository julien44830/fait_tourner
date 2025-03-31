import express from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../dbconfig"; // adapte le chemin selon ton projet
import { sendDeleteAccountEmail } from "../service/mailerService";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// Route pour demander la suppression du compte
router.post("/request-delete", verifyToken, async (req: Request, res: Response): Promise<void> => {
  console.log("=== Route POST /request-delete appelée ===");

  // On suppose que req.user contient l'utilisateur authentifié (grâce au middleware)
  const user = req.user as { id: string; email: string };
  if (!user) {
    console.error("Utilisateur non authentifié.");
    res.status(401).json({ message: "Utilisateur non authentifié." });
    return;
  }
  console.log("Utilisateur authentifié :", user);

  try {
    // Génération d'un token de suppression valable 1 heure
    const deleteToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    console.log("Token de suppression généré :", deleteToken);

    // Construction du lien de confirmation à envoyer par e-mail
    const link = `https://faittourner-production.up.railway.app/confirm-delete?token=${deleteToken}`;
    console.log("Lien de confirmation généré :", link);

    // Envoi de l'e-mail de confirmation via le service mailer
    console.log("Envoi de l'e-mail à :", user.email);
    await sendDeleteAccountEmail(user.email, link);
    console.log("E-mail envoyé avec succès.");

    res.status(200).json({ message: "Un e-mail de confirmation vous a été envoyé." });
  } catch (error) {
    console.error("Erreur lors de la demande de suppression :", error);
    res.status(500).json({ message: "Erreur lors de la demande de suppression." });
  }
});

// Route appelée lors du clic sur le lien de suppression envoyé par email
router.get("/confirm-delete", verifyToken, async (req: Request, res: Response): Promise<void> => {
  console.log("=== Route GET /confirm-delete appelée ===");

  // Récupération du token passé en query string
  const token = req.query.token as string;
  if (!token) {
    console.error("Token manquant dans la query string.");
    res.status(400).send("Token manquant.");
    return;
  }
  console.log("Token reçu :", token);

  try {
    // Décodage et vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
    console.log("Token décodé avec succès :", decoded);

    // Obtention d'une connexion à la base de données
    console.log("Connexion à la base de données...");
    const connection = await getConnection();

    // Exécution de la requête SQL pour supprimer l'utilisateur
    console.log(`Suppression de l'utilisateur avec l'id : ${decoded.id}`);
    await connection.query("DELETE FROM users WHERE id = ?", [decoded.id]);

    // Fermeture de la connexion
    await connection.end();
    console.log("Connexion fermée.");

    // Envoi d'une réponse confirmant la suppression
    res.send("Votre compte a été supprimé avec succès.");
  } catch (err) {
    console.error("Erreur lors de la confirmation de suppression :", err);
    res.status(400).send("Lien invalide ou expiré.");
  }
});

export default router;
