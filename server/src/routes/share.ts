import express, { Request, Response } from "express";
import { getConnection } from "../dbconfig";
import jwt from "jsonwebtoken";
import { sendInvitationEmail } from "../service/mailerService";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

interface AuthRequest extends Request {
  user?: { id: string };
}

router.post("/invite", verifyToken, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;
  console.log("📨 Body reçu dans /invite :", req.body);

  if (!userId) {
    res.status(401).json({ error: "Non autorisé." });
    return;
  }
  console.log('%c⧭', 'color: #e5de73', req.body);

  try {
    const { email, bookId } = req.body;

    if (!email || !bookId) {
      res.status(400).json({ error: "Email ou ID du book manquant." });
      return;
    }

    const connection = await getConnection();

    // 🔍 Vérifier si le book existe et que l'utilisateur en est le propriétaire
    const [bookResult]: any = await connection.execute(
      `SELECT name, owner_id FROM book WHERE id = ?`,
      [bookId]
    );

    if (bookResult.length === 0) {
      console.error("❌ Book non trouvé :", bookId);
      res.status(404).json({ error: "Book non trouvé." });
      return;
    }

    const { name: bookName, owner_id } = bookResult[0];

    if (!owner_id || userId !== owner_id) {
      console.error("❌ L'utilisateur n'est pas l'auteur du book.");
      res.status(403).json({ error: "Vous n'êtes pas l'auteur de ce book." });
      return;
    }

    // 🔍 Vérifier si l'utilisateur invité existe
    const [userRows]: any = await connection.execute(
      `SELECT id FROM user WHERE email = ?`,
      [email]
    );

    let inviteToken: string;
    let inviteLink: string;

    if (userRows.length > 0) {
      const invitedUserId = userRows[0].id;

      if (!invitedUserId || !bookId) {
        console.error("🚨 Paramètres manquants pour l'ajout au book :", { invitedUserId, bookId });
        res.status(400).json({ error: "Paramètres manquants." });
        return;
      }

      // 🔍 Vérifier si déjà dans le book
      const [bookLink]: any = await connection.execute(
        `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
        [invitedUserId, bookId]
      );

      if (bookLink.length === 0) {
        await connection.execute(
          `INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES (?, ?, 0, 'viewer')`,
          [invitedUserId, bookId]
        );
        console.log("✅ Utilisateur ajouté au book :", invitedUserId, bookId);
      }

      inviteToken = jwt.sign({ bookId, email }, process.env.SECRET_KEY as string, {
        expiresIn: "7d",
      });

      inviteLink = `https://www.pictevent.fr/accepter-invitation?token=${inviteToken}`;
    } else {
      // 🔗 L'utilisateur n'existe pas encore : créer lien vers inscription
      inviteToken = jwt.sign({ email, bookId }, process.env.SECRET_KEY as string, {
        expiresIn: "7d",
      });

      inviteLink = `https://www.pictevent.fr/inscription?token=${inviteToken}`;
    }

    // ✉️ Envoi de l'email
    const mailResponse = await sendInvitationEmail(email, bookName, inviteLink);

    if (!mailResponse.success) {
      console.error("❌ Erreur lors de l'envoi de l'email :", mailResponse.message);
      res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
      return;
    }

    res.json({ message: "✅ Invitation envoyée avec succès !" });

  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'invitation :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

export default router;
