import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageModal from "./ImageModal";

describe("ImageModal", () => {
    const images = ["img1.jpg", "img2.jpg", "img3.jpg"];
    const mockOnClose = jest.fn();
    const mockOnPrev = jest.fn();
    const mockOnNext = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("affiche l'image en fonction de l'index", () => {
        render(
            <ImageModal
                images={images}
                currentIndex={1}
                onClose={mockOnClose}
                onPrev={mockOnPrev}
                onNext={mockOnNext}
            />
        );
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "img2.jpg");
        expect(img).toHaveAttribute("alt", "Image 2");
    });

    it("ferme la modale au clic sur le bouton ❌", () => {
        render(
            <ImageModal
                images={images}
                currentIndex={0}
                onClose={mockOnClose}
                onPrev={mockOnPrev}
                onNext={mockOnNext}
            />
        );
        fireEvent.click(screen.getByLabelText("Fermer la modale"));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("navigue avec les boutons ◀ et ▶", () => {
        render(
            <ImageModal
                images={images}
                currentIndex={0}
                onClose={mockOnClose}
                onPrev={mockOnPrev}
                onNext={mockOnNext}
            />
        );

        fireEvent.click(screen.getByText("◀"));
        fireEvent.click(screen.getByText("▶"));

        expect(mockOnPrev).toHaveBeenCalled();
        expect(mockOnNext).toHaveBeenCalled();
    });

    it("réagit aux touches clavier Escape, ArrowLeft, ArrowRight", () => {
        render(
            <ImageModal
                images={images}
                currentIndex={0}
                onClose={mockOnClose}
                onPrev={mockOnPrev}
                onNext={mockOnNext}
            />
        );

        fireEvent.keyDown(window, { key: "Escape" });
        fireEvent.keyDown(window, { key: "ArrowLeft" });
        fireEvent.keyDown(window, { key: "ArrowRight" });

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockOnPrev).toHaveBeenCalled();
        expect(mockOnNext).toHaveBeenCalled();
    });
});
