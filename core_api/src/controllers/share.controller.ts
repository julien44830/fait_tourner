import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../db/dbconfig";
import { sendInvitationEmail } from "../services/mailerService";



export const inviteToBook = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as { id: string; email: string };

  if (!user.id) {
    res.status(401).json({ error: "Non autorisé." });
    return;
  }

  try {
    const { email, bookId } = req.body;

    if (!email || !bookId) {
      res.status(400).json({ error: "Email ou ID du book manquant." });
      return;
    }

    const connection = await getConnection();

    // Vérifier que le book existe et appartient à l’utilisateur
    const [bookResult]: any = await connection.execute(
      "SELECT name, owner_id FROM book WHERE id = ?",
      [bookId]
    );

    if (bookResult.length === 0) {
      res.status(404).json({ error: "Book non trouvé." });
      return;
    }

    const { name: bookName, owner_id } = bookResult[0];

    if (owner_id !== user.id) {
      res.status(403).json({ error: "Vous n'êtes pas l’auteur de ce book." });
      return;
    }

    // Vérifie si l’utilisateur invité existe déjà
    const [userRows]: any = await connection.execute(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    let inviteToken: string;
    let inviteLink: string;

    if (userRows.length > 0) {
      const invitedUserId = userRows[0].id;

      const [bookLink]: any = await connection.execute(
        "SELECT * FROM users_book WHERE user_id = ? AND book_id = ?",
        [invitedUserId, bookId]
      );

      if (bookLink.length === 0) {
        await connection.execute(
          "INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES (?, ?, 0, 'viewer')",
          [invitedUserId, bookId]
        );
      }

      inviteToken = jwt.sign({ bookId, email }, process.env.SECRET_KEY!, {
        expiresIn: "7d",
      });
      inviteLink = `${process.env.FRONT_BASE_URL}/accepter-invitation?token=${inviteToken}`;
    } else {
      inviteToken = jwt.sign({ bookId, email }, process.env.SECRET_KEY!, {
        expiresIn: "7d",
      });
      inviteLink = `${process.env.FRONT_BASE_URL}/inscription?token=${inviteToken}`;
    }

    const mailResponse = await sendInvitationEmail(email, bookName, inviteLink);

    if (!mailResponse.success) {
      res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
      return;
    }

    res.json({ message: "✅ Invitation envoyée avec succès !" });
  } catch (error) {
    console.error("❌ Erreur serveur pendant l'invitation :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
