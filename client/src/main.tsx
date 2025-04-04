import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom"; // ✅

import "./index.css";

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
                {" "}
                {/* ✅ Ajouté ici */}
                <AuthProvider>
                    <App />
                </AuthProvider>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </StrictMode>
);
