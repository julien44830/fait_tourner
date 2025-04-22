import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmModal from "./ConfirmModal";
import { logTestSuccess, flushSuccessLogs } from "../../utils/logTestSuccess";

describe("ConfirmModal", () => {
    const defaultProps = {
        isOpen: true,
        title: "Confirmation",
        message: "Es-tu sûr ?",
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
        confirmLabel: "Oui",
        cancelLabel: "Non",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("affiche le titre et le message", () => {
        render(<ConfirmModal {...defaultProps} />);

        expect(screen.getByText("Confirmation")).toBeInTheDocument();
        expect(screen.getByText("Es-tu sûr ?")).toBeInTheDocument();

        logTestSuccess("Titre et message affichés correctement");
    });

    it("déclenche onConfirm quand on clique sur 'Confirmer'", () => {
        render(<ConfirmModal {...defaultProps} />);
        fireEvent.click(screen.getByText("Oui"));

        expect(defaultProps.onConfirm).toHaveBeenCalled();
        logTestSuccess("onConfirm déclenché au clic sur le bouton Confirmer");
    });

    it("déclenche onCancel quand on clique sur 'Annuler'", () => {
        render(<ConfirmModal {...defaultProps} />);
        fireEvent.click(screen.getByText("Non"));

        expect(defaultProps.onCancel).toHaveBeenCalled();
        logTestSuccess("onCancel déclenché au clic sur le bouton Annuler");
    });

    afterAll(() => {
        flushSuccessLogs(); // ✅ affichage final groupé
    });
});
