import GenericModal from "./GenericModal";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
    confirmLabel?: string;
    cancelLabel?: string;
}

export default function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
}: ConfirmModalProps) {
    return (
        <GenericModal
            title={title}
            onClose={onCancel}
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
                        onClick={onCancel}
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
