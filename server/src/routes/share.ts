import express, { Request, Response } from "express";
import { getConnection } from "../dbconfig";
import jwt from "jsonwebtoken";
import { sendInvitationEmail } from "../service/mailerService"; // ✅ Import du service Resend
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

interface AuthRequest extends Request {
  user?: { id: number };
}

// 📌 Route pour inviter un utilisateur à rejoindre un book
router.post("/invite", verifyToken, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    res.status(401).json({ error: "Non autorisé." });
    return;
  }


  try {
    const { email, bookId } = req.body;

    const connection = await getConnection();

    // ✅ Vérifier si le book existe et que l'utilisateur en est bien l'auteur
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

    // ✅ Vérifier si l'utilisateur invité existe déjà
    const [userRows]: any = await connection.execute(
      `SELECT id FROM user WHERE email = ?`,
      [email]
    );

    if (userRows.length > 0) {
      const invitedUserId = userRows[0].id;

      // ✅ Vérifier si l'utilisateur est déjà lié au book
      const [bookLink]: any = await connection.execute(
        `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
        [invitedUserId, bookId]
      );

      if (bookLink.length === 0) {
        // 🔥 L'utilisateur n'est pas encore dans le book, on l'ajoute
        await connection.execute(
          `INSERT INTO users_book (user_id, book_id, role) VALUES (?, ?, 'viewer')`,
          [invitedUserId, bookId]
        );
      }
    }

    let inviteToken: string;
    let inviteLink: string;

    if (userRows.length > 0) {
      // 🎯 L'utilisateur existe, générer un lien pour accepter l'invitation
      inviteToken = jwt.sign({ bookId, email }, process.env.SECRET_KEY as string, {
        expiresIn: "7d",
      });
      inviteLink = `http://192.168.1.80:5173/accepter-invitation?token=${inviteToken}`;
    } else {
      // ❌ L'utilisateur n'existe pas, générer un lien d'inscription
      inviteToken = jwt.sign({ email, bookId }, process.env.SECRET_KEY as string, {
        expiresIn: "7d",
      });
      inviteLink = `http://192.168.1.80:5173/inscription?token=${inviteToken}`;
    }

    // 📧 Envoyer l'email avec Resend
    const mailResponse = await sendInvitationEmail(email, bookName, inviteLink);

    if (!mailResponse.success) {
      console.error("❌ Erreur lors de l'envoi de l'email :", mailResponse.message);
      res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
      return;
    }

    res.json({ message: "Invitation envoyée avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'invitation :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

export default router;
