// src/component/modals/UploadModal.tsx

import { useState } from "react";
import GenericModal from "./GenericModal";

interface UploadModalProps {
    onClose: () => void;
    onUpload: (files: File[]) => Promise<void>;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadMessage, setUploadMessage] = useState("");

    const handleUpload = async () => {
        setUploadMessage("");
        if (selectedFiles.length === 0) {
            setUploadMessage("Veuillez sélectionner au moins une image.");
            return;
        }

        try {
            await onUpload(selectedFiles);
            setSelectedFiles([]);
            onClose();
        } catch (err) {
            console.error("Erreur d'envoi :", err);
            setUploadMessage("❌ Erreur lors de l'envoi des images.");
        }
    };

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
                setSelectedFiles([]);
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

            {uploadMessage && (
                <p style={{ marginTop: "10px", color: "#c00" }}>
                    {uploadMessage}
                </p>
            )}
        </GenericModal>
    );
}
