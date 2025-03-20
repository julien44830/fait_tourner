import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./page/Home";
import Login from "./page/Login";
import Book from "./page/Book";
import Registration from "./page/Registration";
import Footer from "./layout/Footer";

// 📌 Fonction pour vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
    const token = localStorage.getItem("token");

    if (!token) return false; // Aucun token, donc pas authentifié

    try {
        // 📌 Décoder le token et vérifier son expiration
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        return false; // Token invalide
    }
};

export default function App() {
    const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());

    // 🔥 Surveiller les changements du token pour mettre à jour l'état `isAuth`
    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuth(isAuthenticated());
        };

        // 🎯 Écoute les modifications du `localStorage`
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // 🔄 Vérifie `localStorage` à chaque rendu
    useEffect(() => {
        setIsAuth(isAuthenticated());
    }, [localStorage.getItem("token")]); // 🔥 Déclenche la mise à jour si `token` change

    if (isAuth === null) return <h1>Chargement...</h1>;

    return (
        <Router>
            <div>
                <Routes>
                    {/* ✅ Redirection conditionnelle */}
                    <Route
                        path="/"
                        element={
                            isAuth ? (
                                <Navigate
                                    to="/accueil"
                                    replace
                                />
                            ) : (
                                <Navigate
                                    to="/connexion"
                                    replace
                                />
                            )
                        }
                    />
                    <Route
                        path="/accueil"
                        element={
                            isAuth ? (
                                <Home />
                            ) : (
                                <Navigate
                                    to="/connexion"
                                    replace
                                />
                            )
                        }
                    />
                    <Route
                        path="/connexion"
                        element={<Login />}
                    />
                    <Route
                        path="/inscription"
                        element={<Registration />}
                    />
                    <Route
                        path="/book/:id"
                        element={
                            isAuth ? (
                                <Book />
                            ) : (
                                <Navigate
                                    to="/connexion"
                                    replace
                                />
                            )
                        }
                    />

                    {/* 🔥 Redirection si la route n'existe pas */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={isAuth ? "/accueil" : "/connexion"}
                                replace
                            />
                        }
                    />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}
