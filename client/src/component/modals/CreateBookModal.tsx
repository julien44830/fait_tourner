import { useState } from "react";
import GenericModal from "./GenericModal";

/**
 * Composant CreateBookModal
 *
 * 👉 Ce composant représente une **modale permettant à l'utilisateur de créer un nouveau book**.
 * Elle contient un champ de texte pour saisir un nom de book, ainsi que des boutons pour valider ou annuler.
 *
 * ✅ Ce composant repose sur `GenericModal` pour l'affichage, et utilise un système d'état local
 * pour gérer l'entrée utilisateur ainsi que les erreurs de validation.
 *
 * 🎯 Il est pensé pour être utilisé dans une page comme le `Dashboard` ou `Home`, et s'intègre
 * facilement grâce aux props `onClose` et `onCreate`.
 */

// Props attendues par le composant
interface CreateBookModalProps {
    onClose: () => void; // Fonction appelée pour fermer la modale (ex: clic sur "Annuler" ou fermeture)
    onCreate: (bookName: string) => Promise<void>; // Fonction appelée lorsqu'on valide avec succès (asynchrone)
}

// Composant principal
export default function CreateBookModal({
    onClose,
    onCreate,
}: CreateBookModalProps) {
    const [bookName, setBookName] = useState(""); // Nom saisi par l'utilisateur
    const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur en cas d'échec

    // Fonction appelée lors du clic sur "Valider"
    const handleSubmit = async () => {
        setErrorMessage(""); // Réinitialise les erreurs

        // Validation : champ vide interdit
        if (!bookName.trim()) {
            setErrorMessage("Veuillez entrer un nom pour le book.");
            return;
        }

        try {
            await onCreate(bookName); // Appelle la fonction passée en props
            setBookName(""); // Réinitialise le champ
            onClose(); // Ferme la modale
        } catch (err) {
            // Gestion d'erreur serveur
            setErrorMessage("❌ Erreur lors de la création du book.");
            console.error(err);
        }
    };

    return (
        <GenericModal
            title="Créer un book"
            onClose={onClose}
            footer={
                <div className="modal-buttons">
                    <button
                        className="create-btn"
                        onClick={handleSubmit}
                    >
                        Valider
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
                type="text"
                placeholder="Nom du book"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)} // Met à jour l'état à chaque frappe
            />
            {errorMessage && (
                <p style={{ color: "red", marginTop: "8px" }}>{errorMessage}</p>
            )}
        </GenericModal>
    );
}
