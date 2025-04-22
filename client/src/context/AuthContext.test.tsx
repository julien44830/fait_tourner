// src/context/AuthContext.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { act } from "react";

// 🔧 Composant de test pour accéder au contexte
const TestComponent = () => {
    const { token, isAuthenticated, isReady, login, logout } = useAuth();

    return (
        <div>
            <p>Token: {token}</p>
            <p>isAuthenticated: {isAuthenticated ? "yes" : "no"}</p>
            <p>isReady: {isReady ? "yes" : "no"}</p>
            <button onClick={() => login("abc123")}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("initialise le token depuis le localStorage", async () => {
        localStorage.setItem("token", "test-token");

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Token: test-token")).toBeInTheDocument();
            expect(
                screen.getByText("isAuthenticated: yes")
            ).toBeInTheDocument();
            expect(screen.getByText("isReady: yes")).toBeInTheDocument();
        });
    });

    it("permet le login et met à jour le localStorage", async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await screen.findByText("isReady: yes");

        await act(async () => {
            fireEvent.click(screen.getByText("Login"));
        });

        expect(localStorage.getItem("token")).toBe("abc123");
        expect(screen.getByText("Token: abc123")).toBeInTheDocument();
        expect(screen.getByText("isAuthenticated: yes")).toBeInTheDocument();
    });

    it("permet le logout et supprime le token", async () => {
        localStorage.setItem("token", "to-be-cleared");

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await screen.findByText("isReady: yes");

        await act(async () => {
            fireEvent.click(screen.getByText("Logout"));
        });

        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("name")).toBeNull(); // aussi nettoyé
        expect(screen.getByText("Token:")).toBeInTheDocument(); // vide
        expect(screen.getByText("isAuthenticated: no")).toBeInTheDocument();
    });

    it("lève une erreur si useAuth est utilisé hors AuthProvider", () => {
        const originalError = console.error;
        console.error = jest.fn(); // évite le log rouge React

        expect(() => {
            render(<TestComponent />);
        }).toThrow("useAuth doit être utilisé dans un AuthProvider");

        console.error = originalError;
    });
});
