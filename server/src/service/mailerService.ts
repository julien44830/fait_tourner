import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY); // 🔥 Stocke ta clé API dans `.env`

export const sendInvitationEmail = async (
  recipientEmail: string,
  bookName: string,
  invitationLink: string
) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // 
      to: recipientEmail,
      subject: `Invitation à rejoindre le book : ${bookName}`,
      html: `
        <h1>Invitation à rejoindre un book</h1>
        <p>Vous avez été invité à rejoindre le book "<strong>${bookName}</strong>".</p>
        <p>Pour accepter l'invitation, cliquez sur le lien ci-dessous :</p>
        <a href="${invitationLink}" target="_blank">Accepter l'invitation</a>
        <p>Si vous n'avez pas encore de compte, vous pourrez en créer un.</p>
      `,
    });

    console.log("✅ Email envoyé avec succès :", response);
    return { success: true, message: "Email envoyé avec succès !" };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    return { success: false, message: "Erreur lors de l'envoi de l'email." };
  }
};
