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
      from: "noreply@pictevent.fr", // 
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

    return { success: true, message: "Email envoyé avec succès !" };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    return { success: false, message: "Erreur lors de l'envoi de l'email." };
  }
};

export const sendDeleteAccountEmail = async (email: string, link: string) => {
  try {
    const response = await resend.emails.send({
      from: "noreply@pictevent.fr",
      to: email,
      subject: "Confirmation de suppression de compte",
      html: `
            <h2>Suppression de votre compte</h2>
              <ul>
                <p><strong>Conséquences de la suppression :</strong></p>
                <li>Tous vos books seront supprimés</li>
                <li>Les images qu'ils contiennent seront supprimées</li>
                <li>Vos ami(e)s ne pourront plus accéder à vos books</li>
                <li>Les books de vos ami(e)s et les images que vous avez partagées ne vous seront plus accessibles</li>
                <li>Les images partagées dans les books de vos ami(e)s seront supprimées</li>
              </ul>
            <p>Si vous souhaitez supprimer définitivement votre compte, cliquez sur le lien ci-dessous :</p>
            <a href="${link}">Confirmer la suppression de mon compte</a>
            <p>Ce lien est valable 1 heure.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
    });

    return { success: true, message: "Email envoyé avec succès !" };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    return { success: false, message: "Erreur lors de l'envoi de l'email." };
  }
};
