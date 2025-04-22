import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateBookModal from "./CreateBookModal";
import { logTestSuccess, flushSuccessLogs } from "../../utils/logTestSuccess";

describe("CreateBookModal", () => {
    const mockOnClose = jest.fn();
    const mockOnCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        flushSuccessLogs(); // ✅ Résumé des tests
    });

    it("affiche le titre de la modale", () => {
        render(
            <CreateBookModal
                onClose={mockOnClose}
                onCreate={mockOnCreate}
            />
        );
        expect(screen.getByText("Créer un book")).toBeInTheDocument();
        logTestSuccess("Affichage du titre de la modale");
    });

    it("appelle onCreate avec le bon nom de book", async () => {
        mockOnCreate.mockResolvedValueOnce(undefined);

        render(
            <CreateBookModal
                onClose={mockOnClose}
                onCreate={mockOnCreate}
            />
        );
        fireEvent.change(screen.getByPlaceholderText("Nom du book"), {
            target: { value: "Mon nouveau book" },
        });

        fireEvent.click(screen.getByText("Valider"));

        await waitFor(() => {
            expect(mockOnCreate).toHaveBeenCalledWith("Mon nouveau book");
            expect(mockOnClose).toHaveBeenCalled();
        });

        logTestSuccess("Création de book déclenchée avec succès");
    });

    it("affiche une erreur si le champ est vide", async () => {
        render(
            <CreateBookModal
                onClose={mockOnClose}
                onCreate={mockOnCreate}
            />
        );
        fireEvent.click(screen.getByText("Valider"));

        expect(
            await screen.findByText("Veuillez entrer un nom pour le book.")
        ).toBeInTheDocument();

        expect(mockOnCreate).not.toHaveBeenCalled();
        logTestSuccess(
            "Affichage d'une erreur si aucun nom de book n'est saisi"
        );
    });

    it("gère une erreur lors de la création", async () => {
        const mockOnCreate = jest.fn(() => Promise.reject(new Error("fail")));
        const mockOnClose = jest.fn();
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        render(
            <CreateBookModal
                onClose={mockOnClose}
                onCreate={mockOnCreate}
            />
        );
        fireEvent.change(screen.getByPlaceholderText("Nom du book"), {
            target: { value: "Book qui échoue" },
        });

        fireEvent.click(screen.getByText("Valider"));

        expect(
            await screen.findByText("❌ Erreur lors de la création du book.")
        ).toBeInTheDocument();
        expect(mockOnCreate).toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
        logTestSuccess("Affichage d'une erreur si la création échoue");
    });

    it("ferme la modale au clic sur Annuler", () => {
        render(
            <CreateBookModal
                onClose={mockOnClose}
                onCreate={mockOnCreate}
            />
        );
        fireEvent.click(screen.getByText("Annuler"));

        expect(mockOnClose).toHaveBeenCalled();
        logTestSuccess("Fermeture de la modale au clic sur Annuler");
    });
});
