// src/component/modals/GenericModal.tsx

import { ReactNode } from "react";

interface GenericModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    footer?: ReactNode; // permet d'ajouter des boutons personnalisés
    hideCloseButton?: boolean; // option pour masquer le bouton "Fermer"
}

export default function GenericModal({
    title,
    children,
    onClose,
    footer,
    hideCloseButton = false,
}: GenericModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{title}</h3>

                <div className="modal-content">{children}</div>

                <div className="modal-buttons">
                    {footer
                        ? footer
                        : !hideCloseButton && (
                              <button
                                  className="cancel-btn"
                                  onClick={onClose}
                              >
                                  Fermer
                              </button>
                          )}
                </div>
            </div>
        </div>
    );
}
