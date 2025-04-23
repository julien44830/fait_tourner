import GenericModal from "./GenericModal";

/**
 * Composant ConfirmModal
 *
 * 👉 Ce composant représente une **modale de confirmation générique**.
 * Il est utilisé lorsqu'on souhaite demander à l'utilisateur une validation
 * explicite avant de réaliser une action sensible : suppression d’un élément,
 * déconnexion, confirmation de modification, etc.
 *
 * ✅ Il est réutilisable dans toute l'application : il suffit de lui passer un titre,
 * un message, et deux callbacks (`onConfirm` et `onCancel`).
 */

// Définition des propriétés attendues par le composant
interface ConfirmModalProps {
    isOpen: boolean; // Détermine si la modale est affichée ou non (souvent géré par le parent)
    title: string; // Titre affiché en haut de la modale
    message: string; // Message explicatif dans le corps de la modale
    onCancel: () => void; // Fonction appelée si l'utilisateur clique sur "Annuler" ou ferme la modale
    onConfirm: () => void | Promise<void>; // Fonction appelée si l'utilisateur confirme l'action (async possible)
    confirmLabel?: string; // Texte du bouton de confirmation (par défaut : "Confirmer")
    cancelLabel?: string; // Texte du bouton d'annulation (par défaut : "Annuler")
}

// Composant principal
export default function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Confirmer", // Valeur par défaut
    cancelLabel = "Annuler", // Valeur par défaut
}: ConfirmModalProps) {
    return (
        // Utilisation d'une modale générique comme base
        <GenericModal
            title={title} // Affiche le titre en haut de la modale
            onClose={onCancel} // Ferme la modale si on clique en dehors ou sur le bouton "Annuler"
            footer={
                // Pied de modale contenant les deux boutons d'action
                <div className="modal-buttons">
                    <button
                        className="create-btn"
                        onClick={onConfirm} // Action de confirmation
                    >
                        {confirmLabel}
                    </button>
                    <button
                        className="cancel-btn"
                        onClick={onCancel} // Action d'annulation
                    >
                        {cancelLabel}
                    </button>
                </div>
            }
        >
            {/* Affiche le message s’il est fourni */}
            {message && <p style={{ marginBottom: "1rem" }}>{message}</p>}
        </GenericModal>
    );
}
