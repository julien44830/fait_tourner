import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmModal from "./ConfirmModal";
import { logTestSuccess, flushSuccessLogs } from "../../utils/logTestSuccess";

describe("ConfirmModal", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        flushSuccessLogs(); // ✅ affichage groupé à la fin
    });

    it("affiche le titre et le message", () => {
        render(
            <ConfirmModal
                isOpen={true}
                title="Titre de test"
                message="Message de test"
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        );

        expect(screen.getByText("Titre de test")).toBeInTheDocument();
        expect(screen.getByText("Message de test")).toBeInTheDocument();
        logTestSuccess("Affichage du titre et message correct");
    });

    it("déclenche la confirmation au clic sur Confirmer", () => {
        render(
            <ConfirmModal
                isOpen={true}
                title="Confirm"
                message="Êtes-vous sûr ?"
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        );

        fireEvent.click(screen.getByText("Confirmer"));
        expect(onConfirm).toHaveBeenCalled();
        logTestSuccess("Déclenchement du onConfirm au clic sur Confirmer");
    });

    it("déclenche l'annulation au clic sur Annuler", () => {
        render(
            <ConfirmModal
                isOpen={true}
                title="Confirm"
                message="Êtes-vous sûr ?"
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        );

        fireEvent.click(screen.getByText("Annuler"));
        expect(onCancel).toHaveBeenCalled();
        logTestSuccess("Déclenchement du onCancel au clic sur Annuler");
    });
});
