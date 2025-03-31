import express, { Request, Response } from "express";
import { getConnection } from "../dbconfig";
import jwt from "jsonwebtoken";
import { sendInvitationEmail } from "../service/mailerService";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

interface AuthRequest extends Request {
  user?: { id: string };
}

// 📨 Route pour inviter un utilisateur à rejoindre un book
router.post("/invite", verifyToken, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;
  console.log("📩 Requête reçue pour /invite");
  console.log("🧾 Body de la requête :", req.body);
  console.log("👤 ID de l'utilisateur connecté :", userId);

  if (!userId) {
    console.warn("🚫 Utilisateur non authentifié !");
    res.status(401).json({ error: "Non autorisé." });
    return;
  }

  try {
    const { email, bookId } = req.body;
    console.log("📬 Email cible :", email);
    console.log("📘 ID du book cible :", bookId);

    if (!email || !bookId) {
      console.warn("⚠️ Email ou bookId manquant");
      res.status(400).json({ error: "Email ou ID du book manquant." });
      return;
    }

    const connection = await getConnection();
    console.log("🔌 Connexion à la base OK");

    // 🔍 Vérification du book
    const [bookResult]: any = await connection.execute(
      `SELECT name, owner_id FROM book WHERE id = ?`,
      [bookId]
    );
    console.log("🔍 Résultat de la recherche du book :", bookResult);

    if (bookResult.length === 0) {
      console.warn("❌ Book non trouvé :", bookId);
      res.status(404).json({ error: "Book non trouvé." });
      return;
    }

    const { name: bookName, owner_id } = bookResult[0];
    console.log("📗 Nom du book :", bookName);
    console.log("👑 Propriétaire du book :", owner_id);

    if (userId !== owner_id) {
      console.warn("🚫 L'utilisateur n'est pas l'auteur du book");
      res.status(403).json({ error: "Vous n'êtes pas l'auteur de ce book." });
      return;
    }

    // 🔍 Vérifier si l'utilisateur invité existe
    const [userRows]: any = await connection.execute(
      `SELECT id FROM user WHERE email = ?`,
      [email]
    );
    console.log("👤 Résultat de la recherche d'utilisateur :", userRows);

    let inviteToken: string;
    let inviteLink: string;

    if (userRows.length > 0) {
      const invitedUserId = userRows[0].id;
      console.log("✅ Utilisateur cible trouvé :", invitedUserId);

      const [bookLink]: any = await connection.execute(
        `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
        [invitedUserId, bookId]
      );
      console.log("🔍 Lien existant avec le book :", bookLink);

      if (bookLink.length === 0) {
        console.log("🔗 Aucun lien trouvé, ajout de l'utilisateur au book...");
        await connection.execute(
          `INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES (?, ?, 0, 'viewer')`,
          [invitedUserId, bookId]
        );
        console.log("✅ Utilisateur ajouté au book :", invitedUserId, bookId);
      } else {
        console.log("ℹ️ L'utilisateur est déjà membre du book.");
      }

      // Générer le token pour un utilisateur déjà inscrit
      inviteToken = jwt.sign({ bookId, email }, process.env.SECRET_KEY as string, {
        expiresIn: "7d",
      });
      inviteLink = `https://www.pictevent.fr/accepter-invitation?token=${inviteToken}`;
      console.log("🔗 Lien d'invitation généré (existant) :", inviteLink);
    } else {
      // Générer le token pour un nouvel utilisateur
      console.log("➕ L'utilisateur n'existe pas encore, génération d'un lien d'inscription...");
      inviteToken = jwt.sign({ email, bookId }, process.env.SECRET_KEY as string, {
        expiresIn: "7d",
      });
      inviteLink = `https://www.pictevent.fr/inscription?token=${inviteToken}`;
      console.log("🔗 Lien d'inscription généré :", inviteLink);
    }

    // ✉️ Envoi de l'email
    console.log("📨 Envoi de l'email...");
    const mailResponse = await sendInvitationEmail(email, bookName, inviteLink);
    console.log("📬 Résultat du service d'email :", mailResponse);

    if (!mailResponse.success) {
      console.error("❌ Erreur lors de l'envoi de l'email :", mailResponse.message);
      res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
      return;
    }

    console.log("✅ Invitation envoyée avec succès !");
    res.json({ message: "✅ Invitation envoyée avec succès !" });
  } catch (error) {
    console.error("❌ Erreur serveur pendant l'invitation :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

export default router;
