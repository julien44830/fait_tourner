import React from "react";

interface ConfirmModalProps {
    title?: string;
    message: string;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

export default function ConfirmModal({
    title = "Confirmation",
    message,
    isOpen,
    onCancel,
    onConfirm,
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onCancel}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    maxWidth: "400px",
                    textAlign: "center",
                    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                }}
            >
                <h3>{title}</h3>
                <p style={{ margin: "15px 0" }}>{message}</p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: "20px",
                    }}
                >
                    <button
                        onClick={onCancel}
                        style={{
                            backgroundColor: "#ccc",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: "#e63946",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
