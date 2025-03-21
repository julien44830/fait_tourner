"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitationEmail = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY); // 🔥 Stocke ta clé API dans `.env`
const sendInvitationEmail = async (recipientEmail, bookName, invitationLink) => {
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
        return { success: true, message: "Email envoyé avec succès !" };
    }
    catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email :", error);
        return { success: false, message: "Erreur lors de l'envoi de l'email." };
    }
};
exports.sendInvitationEmail = sendInvitationEmail;
