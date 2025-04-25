import { Router, Request, Response } from "express";
import { sendInvitationEmail, sendDeleteAccountEmail } from "../services/mailer.service";

const router = Router();

// Route pour envoyer une invitation
router.post("/invite", async (req: Request, res: Response): Promise<void> => {
  const { recipientEmail, bookName, invitationLink } = req.body;

  if (!recipientEmail || !bookName || !invitationLink)
    res.status(400).json({ error: "Champs manquants" });
  const result = await sendInvitationEmail(recipientEmail, bookName, invitationLink);
  res.status(result.success ? 200 : 500).json(result);
  return

});

// Route pour envoyer le mail de suppression de compte
router.post("/delete-account", async (req: Request, res: Response): Promise<void> => {
  const { email, link } = req.body;

  if (!email || !link)
    res.status(400).json({ error: "Champs manquants" });

  const result = await sendDeleteAccountEmail(email, link);
  res.status(result.success ? 200 : 500).json(result);
  return
});

export default router;
