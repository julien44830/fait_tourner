// src/component/modals/DeleteAccountModal.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteAccountModal from "./DeleteAccountModal";
import { logTestSuccess, flushSuccessLogs } from "../../utils/logTestSuccess";

describe("DeleteAccountModal", () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        flushSuccessLogs(); // ✅ affichage groupé
    });

    it("n'affiche rien si isOpen est false", () => {
        const { container } = render(
            <DeleteAccountModal
                isOpen={false}
                onClose={onClose}
                onConfirm={onConfirm}
                message=""
            />
        );

        expect(container.firstChild).toBeNull();
        logTestSuccess("Aucune modale affichée quand isOpen est false");
    });

    it("affiche le titre et les messages importants", () => {
        render(
            <DeleteAccountModal
                isOpen={true}
                onClose={onClose}
                onConfirm={onConfirm}
                message=""
            />
        );

        expect(
            screen.getByText("Suppression de votre compte")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Souhaitez-vous vraiment supprimer votre compte/i)
        ).toBeInTheDocument();

        logTestSuccess("Affichage du titre et des messages principaux");
    });

    it("affiche le message d’erreur si présent", () => {
        render(
            <DeleteAccountModal
                isOpen={true}
                onClose={onClose}
                onConfirm={onConfirm}
                message="Erreur lors de la suppression"
            />
        );

        expect(
            screen.getByText("Erreur lors de la suppression")
        ).toBeInTheDocument();

        logTestSuccess("Message d’erreur affiché correctement");
    });

    it("déclenche la fonction onConfirm au clic sur Confirmer", () => {
        render(
            <DeleteAccountModal
                isOpen={true}
                onClose={onClose}
                onConfirm={onConfirm}
                message=""
            />
        );

        fireEvent.click(screen.getByText("Confirmer"));
        expect(onConfirm).toHaveBeenCalled();
        logTestSuccess("Déclenchement de onConfirm au clic sur Confirmer");
    });

    it("déclenche la fonction onClose au clic sur Fermer", () => {
        render(
            <DeleteAccountModal
                isOpen={true}
                onClose={onClose}
                onConfirm={onConfirm}
                message=""
            />
        );

        fireEvent.click(screen.getByText("Fermer"));
        expect(onClose).toHaveBeenCalled();
        logTestSuccess("Déclenchement de onClose au clic sur Fermer");
    });
});
