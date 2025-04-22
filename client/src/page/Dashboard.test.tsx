import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logTestSuccess, flushSuccessLogs } from "../utils/logTestSuccess";

// 👇 Mock logout et fetch global
const mockLogout = jest.fn();
global.fetch = jest.fn();

// Fonction utilitaire pour rendre le Dashboard avec le contexte Auth
const renderDashboard = () => {
    return render(
        <AuthContext.Provider
            value={{
                logout: mockLogout,
                token: "fake-token",
                isAuthenticated: true,
                isReady: true,
                login: jest.fn(),
            }}
        >
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        </AuthContext.Provider>
    );
};

// Mock de l'URL de l'API
jest.mock("../utils/getEnvApiUrl", () => ({
    getEnvApiUrl: () => "http://localhost:4000",
}));

// Réinitialisation avant chaque test
beforeEach(() => {
    jest.resetAllMocks();
    localStorage.setItem("token", "test-token");
    localStorage.setItem("name", "Julien");
});

// ✅ Affichage des logs de succès à la fin de tous les tests
afterAll(() => {
    flushSuccessLogs();
});

describe("Dashboard", () => {
    test("affiche le nom de l'utilisateur", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();
        expect(await screen.findByText("Julien")).toBeInTheDocument();
        logTestSuccess("Nom de l'utilisateur affiché correctement");
    });

    test("ouvre la modale de création de book", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();
        fireEvent.click(await screen.findByText("+ Nouveau Book"));

        expect(screen.getByText("Créer un book")).toBeInTheDocument();
        logTestSuccess("Modale de création de book ouverte avec succès");
    });

    test("gère une erreur lors de la création d'un book", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();
        fireEvent.click(await screen.findByText("+ Nouveau Book"));
        fireEvent.click(screen.getByText("Valider"));

        expect(
            await screen.findByText("Veuillez entrer un nom pour le book.")
        ).toBeInTheDocument();
        logTestSuccess(
            "Erreur affichée correctement lors d'une création invalide"
        );
    });

    test("ouvre la modale de suppression de compte", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();
        fireEvent.click(await screen.findByText("Supprimer votre compte"));

        expect(
            screen.getByText(/Souhaitez-vous vraiment supprimer votre compte/i)
        ).toBeInTheDocument();
        logTestSuccess("Modale de suppression de compte ouverte avec succès");
    });

    test("déclenche la déconnexion", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();
        fireEvent.click(await screen.findByText("Déconnexion"));

        expect(mockLogout).toHaveBeenCalled();
        logTestSuccess("Déconnexion déclenchée avec succès");
    });
});
