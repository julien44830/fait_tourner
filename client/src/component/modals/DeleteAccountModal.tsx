// src/component/modals/DeleteAccountModal.tsx

/**
 * Composant DeleteAccountModal
 *
 * 👉 Ce composant affiche une **modale de confirmation pour la suppression de compte**.
 * Il informe l'utilisateur des conséquences de la suppression de son compte (books, images, accès...).
 *
 * ✅ Utilise un système de props pour s'afficher uniquement si `isOpen` est vrai,
 * et déclenche des callbacks personnalisés `onConfirm` ou `onClose` selon l'action utilisateur.
 *
 */

// Définition des props attendues par le composant
interface DeleteAccountModalProps {
    isOpen: boolean; // Détermine si la modale est visible
    onClose: () => void; // Fonction appelée lorsqu'on ferme la modale (bouton "Fermer")
    onConfirm: () => void; // Fonction appelée lorsqu'on confirme la suppression
    message: string; // Message d'erreur ou d'alerte à afficher sous les conditions
}

// Composant principal
export default function DeleteAccountModal({
    isOpen,
    onClose,
    onConfirm,
    message,
}: DeleteAccountModalProps) {
    // Si la modale n'est pas ouverte, ne retourne rien
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div
                className="modal-content"
                style={{ textAlign: "left" }}
            >
                <h2>Suppression de votre compte</h2>

                {/* Liste des conséquences visibles par l'utilisateur */}
                <p className="p-footer">
                    <strong>Conséquences de la suppression :</strong>
                </p>
                <ul className="ul-footer">
                    <li className="li-footer">
                        Tous vos books seront supprimés
                    </li>
                    <li className="li-footer">
                        Les images qu’ils contiennent seront supprimées
                    </li>
                    <li className="li-footer">
                        Vos ami(e)s ne pourront plus accéder à vos books
                    </li>
                    <li className="li-footer">
                        Les books de vos ami(e)s et les images que vous avez
                        partagées ne vous seront plus accessibles
                    </li>
                    <li className="li-footer">
                        Les images partagées dans les books de vos ami(e)s
                        seront supprimées
                    </li>
                </ul>

                {/* Message de confirmation final */}
                <p className="p-footer">
                    <strong>
                        Souhaitez-vous vraiment supprimer votre compte ?
                    </strong>
                </p>

                {/* Affichage d'un éventuel message d'erreur */}
                {message && (
                    <p style={{ color: "red", marginTop: "8px" }}>{message}</p>
                )}

                {/* Boutons d'action */}
                <div className="modal-buttons">
                    <button
                        className="create-btn button-delete"
                        onClick={onConfirm} // Confirme la suppression
                    >
                        Confirmer
                    </button>
                    <button
                        className="cancel-btn"
                        onClick={onClose} // Ferme simplement la modale
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
