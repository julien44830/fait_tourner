// src/component/UploadModal.tsx
import { useState } from "react";

interface UploadModalProps {
    onClose: () => void;
    onUpload: (files: File[]) => Promise<void>;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadMessage, setUploadMessage] = useState("");

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

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Ajouter des images</h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
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
            </div>
        </div>
    );
}
