import { useState } from "react";
import GenericModal from "./GenericModal";

interface CreateBookModalProps {
    onClose: () => void;
    onCreate: (bookName: string) => Promise<void>;
}

export default function CreateBookModal({
    onClose,
    onCreate,
}: CreateBookModalProps) {
    const [bookName, setBookName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        setErrorMessage("");
        if (!bookName.trim()) {
            setErrorMessage("Veuillez entrer un nom pour le book.");
            return;
        }

        try {
            await onCreate(bookName);
            setBookName("");
            onClose();
        } catch (err) {
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
                onChange={(e) => setBookName(e.target.value)}
            />
            {errorMessage && (
                <p style={{ color: "red", marginTop: "8px" }}>{errorMessage}</p>
            )}
        </GenericModal>
    );
}
