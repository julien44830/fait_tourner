import React, { useEffect } from "react";

interface ImageModalProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function ImageModal({
    images,
    currentIndex,
    onClose,
    onPrev,
    onNext,
}: ImageModalProps) {
    const currentSrc = images[currentIndex];

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
            onClick={onClose}
        >
            <button
                className="nav-button nav-left"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
            >
                ◀
            </button>

            <img
                src={currentSrc}
                alt={`Image ${currentIndex + 1}`}
                onClick={(e) => e.stopPropagation()}
            />

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
