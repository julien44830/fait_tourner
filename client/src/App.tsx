/**
 * ✅ App.tsx
 *
 * Composant racine principal de l'application React.
 *
 * Il gère :
 * - L'initialisation de la mise en page responsive (desktop/mobile)
 * - Les routes publiques et protégées via React Router
 * - L'affichage conditionnel du footer
 * - La redirection en fonction de l'état d'authentification
 *
 * ---
 *
 * 📦 Routes :
 * - `/`             → redirige vers `/accueil` ou `/connexion`
 * - `/accueil`      → page protégée (Accueil/Dashboard)
 * - `/book/:id`     → page protégée (détail d'un book)
 * - `/connexion`    → page de login
 * - `/inscription`  → page de création de compte
 * - `*`             → fallback vers accueil ou login
 *
 * 🔒 Les routes protégées sont encapsulées dans `<RequireAuth />`
 *
 * 📐 Le footer n’est affiché que :
 *    - Si on n’est pas dans le Dashboard (`/accueil`)
 *    - Ou si on est en mode mobile (< 1024px)
 */

import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Accueil from "./page/accueil";
import Login from "./page/Login";
import Book from "./page/Book";
import Registration from "./page/Registration";
import Footer from "./layout/Footer";

export default function App() {
    // 🔐 Récupère le token et l'état de chargement depuis le contexte Auth
    const { token, isReady } = useAuth();
    const isAuthenticated = !!token;

    // 📍 Pour détecter la route active (utile pour le footer)
    const location = useLocation();

    // 🖥️ Gère la détection desktop vs mobile
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ⏳ Affichage temporaire tant que le contexte d’authentification n’est pas prêt
    if (!isReady) return <div>Chargement...</div>;

    // 🔐 Composant de wrapper pour forcer l'authentification sur certaines routes
    const RequireAuth = ({ children }: { children: React.ReactNode }) =>
        isAuthenticated ? (
            children
        ) : (
            <Navigate
                to="/connexion"
                replace
            />
        );

    return (
        <div className="app-container">
            <main className="main-content">
                <Routes>
                    {/* ✅ Redirige / vers /accueil si connecté, sinon vers /connexion */}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={isAuthenticated ? "/accueil" : "/connexion"}
                                replace
                            />
                        }
                    />

                    {/* 🔒 Pages protégées */}
                    <Route
                        path="/accueil"
                        element={
                            <RequireAuth>
                                <Accueil />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/book/:id"
                        element={
                            <RequireAuth>
                                <Book />
                            </RequireAuth>
                        }
                    />

                    {/* 🔓 Pages publiques */}
                    <Route
                        path="/connexion"
                        element={
                            isAuthenticated ? (
                                <Navigate
                                    to="/accueil"
                                    replace
                                />
                            ) : (
                                <Login />
                            )
                        }
                    />
                    <Route
                        path="/inscription"
                        element={<Registration />}
                    />

                    {/* 🚨 Route de secours pour toute URL non prévue */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={isAuthenticated ? "/accueil" : "/connexion"}
                                replace
                            />
                        }
                    />
                </Routes>
            </main>

            {/* ✅ Le footer est affiché sauf sur /accueil en mode desktop */}
            {(location.pathname !== "/accueil" || !isDesktop) && <Footer />}
        </div>
    );
}
