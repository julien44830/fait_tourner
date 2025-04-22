import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logTestSuccess, flushSuccessLogs } from "../utils/logTestSuccess";

// 🧪 Mocks
jest.mock("../utils/getEnvApiUrl", () => ({
    getEnvApiUrl: () => "http://localhost:4000",
}));
jest.mock("../component/GoogleConnexion", () => () => (
    <div data-testid="mock-google">GoogleConnexionMock</div>
));
jest.mock("../context/AuthContext", () => ({
    useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("Login", () => {
    const loginMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ login: loginMock });
    });

    afterAll(() => {
        flushSuccessLogs();
    });

    it("✅ effectue une connexion et redirige l'utilisateur", async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                token: "test-token",
                name: "Julien",
            }),
        };

        global.fetch = jest.fn().mockResolvedValueOnce(mockResponse) as any;

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@email.com" },
        });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), {
            target: { value: "password" },
        });

        fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith("test-token");
            expect(localStorage.getItem("name")).toBe("Julien");
            expect(mockNavigate).toHaveBeenCalledWith("/accueil");
        });

        logTestSuccess("Connexion réussie et redirection");
    });

    it("❌ gère une erreur si fetch échoue", async () => {
        console.error = jest.fn();

        global.fetch = jest
            .fn()
            .mockRejectedValueOnce(new Error("Erreur réseau")) as any;

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@email.com" },
        });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), {
            target: { value: "password" },
        });

        fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                "❌ Erreur de connexion :",
                expect.any(Error)
            );
        });

        logTestSuccess("Erreur de connexion gérée proprement");
    });
});
