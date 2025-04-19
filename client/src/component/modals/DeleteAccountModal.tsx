// src/component/modals/DeleteAccountModal.tsx

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

export default function DeleteAccountModal({
    isOpen,
    onClose,
    onConfirm,
    message,
}: DeleteAccountModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div
                className="modal-content"
                style={{ textAlign: "left" }}
            >
                <h2>Suppression de votre compte</h2>
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
                <p className="p-footer">
                    <strong>
                        Souhaitez-vous vraiment supprimer votre compte ?
                    </strong>
                </p>

                {message && (
                    <p style={{ color: "red", marginTop: "8px" }}>{message}</p>
                )}

                <div className="modal-buttons">
                    <button
                        className="create-btn button-delete"
                        onClick={onConfirm}
                    >
                        Confirmer
                    </button>
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
