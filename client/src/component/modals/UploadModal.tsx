// src/component/modals/UploadModal.tsx

import { useState } from "react";
import GenericModal from "./GenericModal";

/**
 * Composant `UploadModal`
 *
 * 🎯 Ce composant permet à l’utilisateur de **sélectionner et envoyer plusieurs images** dans une modale.
 *
 * ✅ Fonctionnalités :
 * - Sélection de fichiers images (`accept="image/*"`)
 * - Limitation à 10 images
 * - Aperçu des images sélectionnées
 * - Suppression individuelle de fichiers sélectionnés
 * - Affichage des erreurs et validation
 */

interface UploadModalProps {
    onClose: () => void; // Fonction appelée à la fermeture de la modale
    onUpload: (files: File[]) => Promise<void>; // Fonction async de traitement des fichiers
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadMessage, setUploadMessage] = useState("");

    /**
     * Soumet les fichiers sélectionnés
     * - Valide que des fichiers sont présents
     * - Appelle la fonction `onUpload` avec les fichiers
     * - Gère les erreurs
     */
    const handleUpload = async () => {
        setUploadMessage("");

        if (selectedFiles.length === 0) {
            setUploadMessage("Veuillez sélectionner au moins une image.");
            return;
        }

        try {
            await onUpload(selectedFiles);
            setSelectedFiles([]); // Réinitialise les fichiers
            onClose(); // Ferme la modale
        } catch (err) {
            console.error("Erreur d'envoi :", err);
            setUploadMessage("❌ Erreur lors de l'envoi des images.");
        }
    };

    /**
     * Gère le changement dans l’input type="file"
     * - Convertit la FileList en tableau
     * - Imite une limite de 10 images
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            if (filesArray.length > 10) {
                alert("❌ Maximum 10 images.");
                return;
            }
            setSelectedFiles(filesArray);
        }
    };

    return (
        <GenericModal
            title="Ajouter des images"
            onClose={() => {
                setSelectedFiles([]); // Réinitialise à la fermeture
                onClose();
            }}
            footer={
                <div className="modal-buttons">
                    <button
                        className="create-btn"
                        onClick={handleUpload}
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
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                aria-label="zone de téléchargement"
            />

            {/* ✅ Aperçu des images sélectionnées */}
            {selectedFiles.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "10px",
                    }}
                >
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            style={{ position: "relative" }}
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                }}
                            />
                            <button
                                onClick={() =>
                                    setSelectedFiles((prev) =>
                                        prev.filter((_, i) => i !== index)
                                    )
                                }
                                style={{
                                    position: "absolute",
                                    top: "-8px",
                                    right: "-8px",
                                    backgroundColor: "#ff4d4d",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ❌ Affichage des erreurs */}
            {uploadMessage && (
                <p style={{ marginTop: "10px", color: "#c00" }}>
                    {uploadMessage}
                </p>
            )}
        </GenericModal>
    );
}
