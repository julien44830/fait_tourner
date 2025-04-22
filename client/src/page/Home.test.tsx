import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";
import { BrowserRouter } from "react-router-dom";
import { logTestSuccess, flushSuccessLogs } from "../utils/logTestSuccess";

// Mock fetch et getEnvApiUrl
const mockFetch = jest.fn();

jest.mock("../utils/getEnvApiUrl", () => ({
    getEnvApiUrl: () => "http://localhost:4000",
}));

global.fetch = mockFetch;

describe("Home", () => {
    beforeEach(() => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("name", "Julien");
        jest.clearAllMocks();
    });

    afterAll(() => {
        flushSuccessLogs();
    });

    const renderWithRouter = () =>
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

    it("affiche les books chargés", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 1, name: "Mon premier book" }],
        });

        renderWithRouter();

        expect(await screen.findByText("Mon premier book")).toBeInTheDocument();
        logTestSuccess("Affichage des books réussi");
    });

    it("affiche un message si aucun book", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderWithRouter();

        expect(
            await screen.findByText(/vous n'avez aucun book actuellement/i)
        ).toBeInTheDocument();
        logTestSuccess("Affichage du message d'absence de book");
    });

    it("ouvre et ferme la modale de création", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderWithRouter();

        fireEvent.click(screen.getByText("Créer un nouveau book"));
        expect(await screen.findByText("Créer un book")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Annuler"));
        await waitFor(() => {
            expect(screen.queryByText("Créer un book")).not.toBeInTheDocument();
        });

        logTestSuccess("Ouverture et fermeture de la modale de création");
    });

    it("affiche une erreur si le champ est vide", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderWithRouter();
        fireEvent.click(screen.getByText("Créer un nouveau book"));
        fireEvent.click(await screen.findByText("Valider"));

        expect(
            await screen.findByText("Veuillez entrer un nom pour le book.")
        ).toBeInTheDocument();

        logTestSuccess("Affichage de l'erreur si champ vide lors de création");
    });
});
