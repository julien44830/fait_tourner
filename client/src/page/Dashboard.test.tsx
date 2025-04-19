import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// 👇 utilise Jest ici !
const mockLogout = jest.fn();
global.fetch = jest.fn();

process.env.VITE_API_URL = "http://localhost:4000"; // pour getEnvApiUrl()

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
            {" "}
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        </AuthContext.Provider>
    );
};

beforeEach(() => {
    jest.resetAllMocks();
    localStorage.setItem("token", "test-token");
    localStorage.setItem("name", "Julien");
});

describe("Dashboard", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        localStorage.setItem("token", "test-token");
        localStorage.setItem("name", "Julien");
    });

    test("affiche le nom de l'utilisateur", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();

        expect(await screen.findByText("Julien")).toBeInTheDocument();
    });

    test("ouvre la modale de création de book", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();
        const createBtn = await screen.findByText("+ Nouveau Book");
        fireEvent.click(createBtn);

        expect(screen.getByText("Créer un book")).toBeInTheDocument();
    });

    test("gère une erreur lors de la création d'un book", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();

        fireEvent.click(await screen.findByText("+ Nouveau Book"));
        fireEvent.click(screen.getByText("Valider")); // envoie jestde

        expect(
            await screen.findByText("Veuillez entrer un nom pour le book.")
        ).toBeInTheDocument();
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
    });

    test("déclenche la déconnexion", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderDashboard();

        fireEvent.click(await screen.findByText("Déconnexion"));
        expect(mockLogout).toHaveBeenCalled();
    });
});
