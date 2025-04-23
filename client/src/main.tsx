/**
 * ✅ Point d’entrée principal de l’application React.
 *
 * Ce fichier configure :
 * - Le mode strict de React (`StrictMode`)
 * - Le routing de l’app (`BrowserRouter`)
 * - L’authentification via Google OAuth (`GoogleOAuthProvider`)
 * - Le contexte d’authentification global (`AuthProvider`)
 * - Le rendu de l’application principale (`App`)
 *
 * 📦 Environnement :
 * - Le clientId Google est injecté via `VITE_GOOGLE_CLIENT_ID` depuis les variables d’environnement.
 *
 * 💡 Cette configuration garantit que tous les composants enfants peuvent :
 *   - Accéder à React Router
 *   - Utiliser le contexte d’authentification
 *   - Effectuer une connexion OAuth Google
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 🔧 Composant racine de l'application
import App from "./App.tsx";

// 🌐 Fournisseur OAuth Google
import { GoogleOAuthProvider } from "@react-oauth/google";

// 🔐 Contexte personnalisé d'authentification
import { AuthProvider } from "./context/AuthContext";

// 🚦 Router pour la gestion des routes
import { BrowserRouter } from "react-router-dom";

// 🎨 Feuilles de styles globales
import "./index.css";

// 🔑 Récupération de la clé Google OAuth depuis les variables d’environnement
const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;

// 🚀 Initialisation du rendu React
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            {/* 🔐 Activation de l’authentification OAuth avec Google */}
            <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
                {/* 🔒 Activation du contexte d'authentification personnalisé */}
                <AuthProvider>
                    {/* 🚀 Lancement de l’application principale */}
                    <App />
                </AuthProvider>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </StrictMode>
);
