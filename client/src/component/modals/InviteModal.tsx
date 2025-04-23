// src/component/modals/InviteModal.tsx

import { useState } from "react";
import GenericModal from "./GenericModal";
import { getEnvApiUrl } from "../../utils/getEnvApiUrl";

/**
 * Composant `InviteModal`
 *
 * 🎯 Permet à l'utilisateur **d'inviter quelqu’un par email** à consulter un book spécifique.
 * - Utilise une modale générique (`GenericModal`)
 * - Appelle une API d'invitation avec l'ID du book et l'email de l'invité
 * - Affiche les messages de succès ou d’erreur
 *
 */

interface InviteModalProps {
    bookId: string; // ID du book concerné par l’invitation
    onClose: () => void; // Fonction pour fermer la modale
    apiUrl?: string; // (optionnel) permet de passer une URL personnalisée (utile pour les tests)
}

export default function InviteModal({
    bookId,
    onClose,
    apiUrl,
}: InviteModalProps) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    /**
     * Fonction déclenchée lors du clic sur "Envoyer l'invitation"
     * ➕ Valide les champs, envoie la requête POST, gère les réponses
     */
    const handleShare = async () => {
        if (!email || !bookId) {
            setMessage("Email ou ID du book manquant.");
            return;
        }

        const baseUrl = apiUrl ?? getEnvApiUrl(); // 📦 utilise la fonction d’URL centralisée

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
                // ✅ Succès : message et fermeture après 2 sec
                setMessage("✅ Invitation envoyée avec succès !");
                setTimeout(() => {
                    setEmail("");
                    setMessage("");
                    onClose();
                }, 2000);
            } else {
                // ❌ Erreur API : message personnalisé
                setMessage(data.error || "❌ Erreur lors de l'envoi.");
            }
        } catch {
            // ❌ Erreur serveur générique
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
