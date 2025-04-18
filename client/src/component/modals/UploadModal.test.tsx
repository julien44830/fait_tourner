import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UploadModal from "../modals/UploadModal";

beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:fake-url");
});

beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    (console.error as jest.Mock).mockRestore();
});

describe("UploadModal", () => {
    const createFakeFile = (name = "test.png") =>
        new File(["(image)"], name, { type: "image/png" });

    it("✅ appelle onUpload avec les bons fichiers et ferme la modale", async () => {
        const mockOnUpload = jest.fn(() => Promise.resolve());
        const mockOnClose = jest.fn();

        render(
            <UploadModal
                onUpload={mockOnUpload}
                onClose={mockOnClose}
            />
        );

        const file = createFakeFile();
        const input = screen.getByLabelText("zone de téléchargement");
        fireEvent.change(input, { target: { files: [file] } });

        fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

        await waitFor(() => {
            expect(mockOnUpload).toHaveBeenCalledWith([file]);
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it("❌ affiche une erreur si aucun fichier n'est sélectionné", async () => {
        const mockOnUpload = jest.fn();
        const mockOnClose = jest.fn();

        render(
            <UploadModal
                onUpload={mockOnUpload}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

        expect(
            await screen.findByText(/veuillez sélectionner au moins une image/i)
        ).toBeInTheDocument();

        expect(mockOnUpload).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("❌ affiche un message d'erreur si l'upload échoue", async () => {
        const mockOnUpload = jest.fn(() =>
            Promise.reject(new Error("upload fail"))
        );
        const mockOnClose = jest.fn();

        render(
            <UploadModal
                onUpload={mockOnUpload}
                onClose={mockOnClose}
            />
        );

        const file = createFakeFile();
        const input = screen.getByLabelText("zone de téléchargement");
        fireEvent.change(input, { target: { files: [file] } });

        fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

        expect(
            await screen.findByText(/erreur lors de l'envoi des images/i)
        ).toBeInTheDocument();

        expect(mockOnUpload).toHaveBeenCalledWith([file]);
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
