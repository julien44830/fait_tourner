// src/component/modals/InviteModal.tsx

import { useState } from "react";
import GenericModal from "./GenericModal";

interface InviteModalProps {
    bookId: string;
    onClose: () => void;
}

export default function InviteModal({ bookId, onClose }: InviteModalProps) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleInvite = async () => {
        if (!email || !bookId) {
            setMessage("Email ou ID du book manquant.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/invite`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email, bookId }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Invitation envoyée !");
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
                        onClick={handleInvite}
                    >
                        Envoyer
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
