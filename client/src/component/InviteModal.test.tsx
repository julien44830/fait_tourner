// src/component/InviteModal.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InviteModal from "./InviteModal";

// 🧹 Avant chaque test : on remet un token simulé dans le localStorage
beforeEach(() => {
    localStorage.setItem("token", "fake-token");
});

// 🧼 Après chaque test : on reset les mocks
afterEach(() => {
    jest.resetAllMocks();
});

describe("InviteModal", () => {
    it("envoie une invitation avec le bon bookId, email et token", async () => {
        const bookId = 42;
        const fakeEmail = "invite@test.com";

        // mock de la fonction fetch
        (global.fetch as jest.Mock) = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        );

        // rend le composant
        render(<InviteModal bookId={bookId} />);

        const emailInput = screen.getByPlaceholderText("Email de l'invité");
        const submitButton = screen.getByRole("button", {
            name: /envoyer l'invitation/i,
        });

        // Simulation de saisie && clic
        fireEvent.change(emailInput, { target: { value: fakeEmail } });
        console.log("📧 Email saisi :", emailInput.getAttribute("value"));

        fireEvent.click(submitButton);

        // Attente de l'apparition du message de confirmation
        await waitFor(() =>
            expect(
                screen.getByText(/invitation envoyée avec succès/i)
            ).toBeInTheDocument()
        );
        console.log("✅ Message de confirmation affiché");

        // Vérification que fetch a bien été appelé
        expect(fetch).toHaveBeenCalled();

        // Analyse des paramètres transmis à fetch
        const fetchArgs = (fetch as jest.Mock).mock.calls[0];

        if (!fetchArgs || fetchArgs.length < 2) {
            throw new Error(
                "❌ Les arguments de fetch sont manquants ou incomplets."
            );
        }

        const url = fetchArgs[0];
        const options = fetchArgs[1];
        const body = JSON.parse(options.body);
        const token = options.headers.Authorization;

        console.log("🔗 URL appelée :", url);
        console.log("📦 Données envoyées à l'API :", body);
        console.log("🪪 Token envoyé :", token);

        // ✅ Vérifications finales
        expect(url).toBe(
            "https://faittourner-production.up.railway.app/api/invite"
        );
        expect(body.email).toBe(fakeEmail);
        expect(body.bookId).toBe(bookId);
        expect(token).toBe("Bearer fake-token");
    });

    it("affiche un message d'erreur si l'API échoue", async () => {
        console.log("test en cas d'erreur");
        const bookId = 42;
        const fakeEmail = "erreur@test.com";

        // 🧪 Mock fetch pour simuler une réponse avec erreur
        (global.fetch as jest.Mock) = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () =>
                    Promise.resolve({
                        error: "Erreur personnalisée depuis l'API",
                    }),
            })
        );

        render(<InviteModal bookId={bookId} />);

        const emailInput = screen.getByPlaceholderText("Email de l'invité");
        const submitButton = screen.getByRole("button", {
            name: /envoyer l'invitation/i,
        });

        // 🖱️ Simulation de la saisie + clic
        fireEvent.change(emailInput, { target: { value: fakeEmail } });
        console.log("📧 Email saisi :", emailInput.getAttribute("value"));

        fireEvent.click(submitButton);
        console.log("🚀 Requête envoyée au clic du bouton");

        // ✅ Vérifie que le message d'erreur s'affiche
        await waitFor(() =>
            expect(
                screen.getByText(/erreur personnalisée depuis l'api/i)
            ).toBeInTheDocument()
        );
        console.log("❌ Message d'erreur affiché avec succès");

        // ✅ Vérifie que fetch a été appelé avec les bons paramètres
        expect(fetch).toHaveBeenCalled();

        const fetchArgs = (fetch as jest.Mock).mock.calls[0];
        if (!fetchArgs || fetchArgs.length < 2) {
            throw new Error(
                "❌ Les arguments de fetch sont manquants ou incomplets."
            );
        }

        const url = fetchArgs[0];
        const options = fetchArgs[1];
        const body = JSON.parse(options.body);
        const token = options.headers.Authorization;

        console.log("🔗 URL appelée :", url);
        console.log("📦 Données envoyées à l'API :", body);
        console.log("🪪 Token envoyé :", token);
    });
});
