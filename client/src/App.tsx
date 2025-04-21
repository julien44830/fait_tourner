import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Accueil from "./page/accueil";
import Login from "./page/Login";
import Book from "./page/Book";
import Registration from "./page/Registration";
import Footer from "./layout/Footer";

export default function App() {
    const { token, isReady } = useAuth();
    const isAuthenticated = !!token;
    const location = useLocation(); // 👈 pour savoir sur quelle route on est

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ⏳ Affichage temporaire pendant le chargement de l'auth
    if (!isReady) return <div>Chargement...</div>;

    // 🔒 Composant wrapper pour les routes protégées
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
                    {/* ✅ Redirection page d'accueil */}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={isAuthenticated ? "/accueil" : "/connexion"}
                                replace
                            />
                        }
                    />

                    {/* 🔒 Routes protégées */}
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

                    {/* 🔓 Routes publiques */}
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

                    {/* 🚨 Catch-all : redirection */}
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

            {/* ✅ Affiche le footer UNIQUEMENT si on n’est PAS dans le dashboard */}
            {(location.pathname !== "/accueil" || !isDesktop) && <Footer />}
        </div>
    );
}
