import GenericModal from "./GenericModal";

interface ConfirmModalProps {
    title: string;
    message?: string;
    onConfirm: () => void;
    onClose: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

export default function ConfirmModal({
    title,
    message,
    onConfirm,
    onClose,
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
}: ConfirmModalProps) {
    return (
        <GenericModal
            title={title}
            onClose={onClose}
            footer={
                <div className="modal-buttons">
                    <button
                        className="create-btn"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        {cancelLabel}
                    </button>
                </div>
            }
        >
            {message && <p style={{ marginBottom: "1rem" }}>{message}</p>}
        </GenericModal>
    );
}
