import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InviteModal from "./InviteModal";
import { logTestSuccess, flushSuccessLogs } from "../../utils/logTestSuccess";

// ✅ Mock de la fonction d’environnement
jest.mock("../../utils/getEnvApiUrl", () => ({
    getEnvApiUrl: () => "https://fake.api",
}));

beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    jest.resetAllMocks();
});

describe("InviteModal", () => {
    afterAll(() => {
        flushSuccessLogs(); // ✅ Un seul affichage à la fin
    });

    it("envoie une invitation avec le bon bookId, email et token", async () => {
        const bookId = "42";
        const fakeEmail = "invite@test.com";

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        ) as jest.Mock;

        render(
            <InviteModal
                bookId={bookId}
                onClose={() => {}}
            />
        );

        const emailInput = screen.getByPlaceholderText(
            "Email de l'utilisateur"
        );
        const submitButton = screen.getByRole("button", {
            name: /envoyer l'invitation/i,
        });

        fireEvent.change(emailInput, { target: { value: fakeEmail } });
        fireEvent.click(submitButton);

        await waitFor(() =>
            expect(screen.getByText(/invitation envoyée/i)).toBeInTheDocument()
        );

        const [url, options] = (fetch as jest.Mock).mock.calls[0];
        const body = JSON.parse(options.body);
        const token = options.headers.Authorization;

        expect(url).toContain("/api/invite");
        expect(body.email).toBe(fakeEmail);
        expect(body.bookId).toBe(bookId);
        expect(token).toBe("Bearer fake-token");

        logTestSuccess(
            "Invitation envoyée avec succès avec les bons paramètres"
        );
    });

    it("affiche un message d'erreur si l'API échoue", async () => {
        const bookId = "42";
        const fakeEmail = "erreur@test.com";

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () =>
                    Promise.resolve({
                        error: "Erreur personnalisée depuis l'API",
                    }),
            })
        ) as jest.Mock;

        render(
            <InviteModal
                bookId={bookId}
                onClose={() => {}}
            />
        );

        const emailInput = screen.getByPlaceholderText(
            "Email de l'utilisateur"
        );
        const submitButton = screen.getByRole("button", {
            name: /envoyer l'invitation/i,
        });

        fireEvent.change(emailInput, { target: { value: fakeEmail } });
        fireEvent.click(submitButton);

        await waitFor(() =>
            expect(
                screen.getByText(/erreur personnalisée depuis l'api/i)
            ).toBeInTheDocument()
        );

        expect(fetch).toHaveBeenCalled();
        logTestSuccess("Message d’erreur affiché correctement si l’API échoue");
    });
});
