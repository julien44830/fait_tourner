import { render, screen, fireEvent } from "@testing-library/react";
import GoogleConnexion from "./GoogleConnexion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { flushSuccessLogs, logTestSuccess } from "../utils/logTestSuccess";

// Mocks
jest.mock("axios");
jest.mock("@react-oauth/google", () => ({
    useGoogleLogin: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
    useLocation: () => ({
        search: "?token=invitation-token",
    }),
}));
jest.mock("../context/AuthContext", () => ({
    useAuth: jest.fn(),
}));
jest.mock("../utils/getEnvApiUrl", () => ({
    getEnvApiUrl: () => "http://localhost:4000",
}));

describe("GoogleConnexion", () => {
    const loginMock = jest.fn();
    const postMock = axios.post as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ login: loginMock });
    });

    afterAll(() => {
        flushSuccessLogs();
    });

    it("appelle googleLogin au clic sur le bouton", () => {
        const googleLoginMock = jest.fn();
        const useGoogleLogin = require("@react-oauth/google").useGoogleLogin;
        useGoogleLogin.mockReturnValue(googleLoginMock);

        render(<GoogleConnexion />);
        fireEvent.click(
            screen.getByRole("button", { name: /connexion avec google/i })
        );

        expect(googleLoginMock).toHaveBeenCalled();
        logTestSuccess("Appel de googleLogin déclenché au clic");
    });

    it("gère la logique onSuccess avec axios et login", async () => {
        const mockResponse = {
            data: {
                token: "fake-jwt-token",
                user: { name: "Julien" },
            },
        };

        postMock.mockResolvedValueOnce(mockResponse);

        let onSuccessHandler: (tokenResponse: any) => void = () => {};
        const useGoogleLogin = require("@react-oauth/google").useGoogleLogin;
        useGoogleLogin.mockImplementation(
            ({
                onSuccess,
            }: {
                onSuccess: (tokenResponse: { access_token: string }) => void;
            }) => {
                onSuccessHandler = onSuccess;
                return () => {};
            }
        );

        render(<GoogleConnexion />);
        await onSuccessHandler({ access_token: "fake-access-token" });

        expect(postMock).toHaveBeenCalledWith(
            expect.stringContaining("/api/auth/google/token"),
            {
                access_token: "fake-access-token",
                token: "invitation-token",
            }
        );
        expect(loginMock).toHaveBeenCalledWith("fake-jwt-token");
        expect(localStorage.getItem("name")).toBe("Julien");
        logTestSuccess(
            "Connexion Google réussie et données utilisateur stockées"
        );
    });

    it("gère les erreurs axios dans onSuccess", async () => {
        const consoleErrorMock = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const useGoogleLogin = require("@react-oauth/google").useGoogleLogin;
        useGoogleLogin.mockImplementation(
            ({
                onSuccess,
            }: {
                onSuccess: (tokenResponse: { access_token: string }) => void;
            }) => {
                return () => onSuccess({ access_token: "bad-token" });
            }
        );

        postMock.mockRejectedValueOnce(new Error("Erreur API"));

        render(<GoogleConnexion />);
        fireEvent.click(
            screen.getByRole("button", { name: /connexion avec google/i })
        );

        await Promise.resolve();
        expect(consoleErrorMock).toHaveBeenCalledWith(
            "❌ Erreur de login Google :",
            expect.any(Error)
        );
        logTestSuccess("Erreur de connexion Google capturée proprement");

        consoleErrorMock.mockRestore(); // Nettoyage 👍
    });
});
