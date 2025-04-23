// src/component/modals/GenericModal.tsx

import { ReactNode } from "react";

/**
 * Composant GenericModal
 *
 * 👉 Ce composant représente une **modale réutilisable générique**.
 * Il permet d'afficher une boîte de dialogue avec :
 * - Un titre
 * - Un contenu personnalisé (`children`)
 * - Des boutons d'action en pied de modale (footer)
 *
 * ✅ Il est utilisé comme base pour construire des modales spécifiques :
 * - Création de book (CreateBookModal)
 * - Confirmation de suppression (ConfirmModal)
 * - Etc.
 *
 */

// Définition des props attendues
interface GenericModalProps {
    title: string; // Titre de la modale
    children: ReactNode; // Contenu principal de la modale (formulaire, texte, etc.)
    onClose: () => void; // Fonction appelée lorsqu'on clique sur "Fermer"
    footer?: ReactNode; // Optionnel : personnalise le footer (boutons d'action)
    hideCloseButton?: boolean; // Optionnel : masque le bouton "Fermer" si true
}

// Composant principal
export default function GenericModal({
    title,
    children,
    onClose,
    footer,
    hideCloseButton = false, // false par défaut
}: GenericModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                {/* Titre affiché en haut de la modale */}
                <h3>{title}</h3>

                {/* Contenu injecté par les enfants */}
                <div className="modal-content">{children}</div>

                {/* Pied de la modale avec les boutons */}
                <div className="modal-buttons">
                    {/* Si un footer personnalisé est fourni, on l'affiche.
                        Sinon, on affiche un bouton Fermer par défaut (sauf s'il est masqué). */}
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
