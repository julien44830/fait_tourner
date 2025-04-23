import { useEffect } from "react";

/**
 * Composant `ImageModal`
 *
 * 👉 Cette modale sert à **afficher une image en plein écran** avec possibilité :
 * - de naviguer entre plusieurs images (précédente/suivante),
 * - de fermer la modale via un clic ou la touche "Escape",
 * - de naviguer au clavier via ← et →.
 *
 */

interface ImageModalProps {
    images: string[]; // Tableau des URLs des images à afficher
    currentIndex: number; // Index de l'image actuellement affichée
    onClose: () => void; // Fonction de fermeture de la modale
    onPrev: () => void; // Fonction pour aller à l'image précédente
    onNext: () => void; // Fonction pour aller à l'image suivante
}

export default function ImageModal({
    images,
    currentIndex,
    onClose,
    onPrev,
    onNext,
}: ImageModalProps) {
    const currentSrc = images[currentIndex]; // URL de l'image en cours

    // 🎹 Gestion des touches clavier : Escape, ←, →
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "ArrowRight") onNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, onPrev, onNext]);

    return (
        <div
            className="modal-overlay"
            onClick={onClose} // Fermeture par clic à l'extérieur de l'image
        >
            {/* ❌ Bouton pour fermer la modale */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Empêche la fermeture si clic sur le bouton
                    onClose();
                }}
                style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "2rem",
                    cursor: "pointer",
                    zIndex: 10001,
                }}
                aria-label="Fermer la modale"
                title="Fermer"
            >
                ❌
            </button>

            {/* ◀ Bouton précédent */}
            <button
                className="nav-button nav-left"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
            >
                ◀
            </button>

            {/* 🖼️ Affichage de l'image en cours */}
            <img
                src={currentSrc}
                alt={`Image ${currentIndex + 1}`}
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture si clic sur l'image
            />

            {/* ▶ Bouton suivant */}
            <button
                className="nav-button nav-right"
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
            >
                ▶
            </button>
        </div>
    );
}
