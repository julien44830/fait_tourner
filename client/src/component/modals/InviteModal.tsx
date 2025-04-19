// src/component/modals/InviteModal.tsx

import { useState } from "react";
import GenericModal from "./GenericModal";
import { getEnvApiUrl } from "../../utils/getEnvApiUrl";

interface InviteModalProps {
    bookId: string;
    onClose: () => void;
    apiUrl?: string;
}

export default function InviteModal({
    bookId,
    onClose,
    apiUrl,
}: InviteModalProps) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleShare = async () => {
        if (!email || !bookId) {
            setMessage("Email ou ID du book manquant.");
            return;
        }

        const baseUrl = apiUrl ?? getEnvApiUrl();

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${baseUrl}/api/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email, bookId }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Invitation envoyée avec succès !");
                setTimeout(() => {
                    setEmail("");
                    setMessage("");
                    onClose();
                }, 2000);
            } else {
                setMessage(data.error || "❌ Erreur lors de l'envoi.");
            }
        } catch {
            setMessage("❌ Erreur serveur.");
        }
    };

    return (
        <GenericModal
            title="Inviter un utilisateur"
            onClose={onClose}
            footer={
                <div className="modal-buttons">
                    <button
                        className="create-btn"
                        onClick={handleShare}
                    >
                        Envoyer l'invitation
                    </button>
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                </div>
            }
        >
            <input
                type="email"
                placeholder="Email de l'utilisateur"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </GenericModal>
    );
}
