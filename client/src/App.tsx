import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // ✅
import Home from "./page/Home";
import Login from "./page/Login";
import Book from "./page/Book";
import Registration from "./page/Registration";
import Footer from "./layout/Footer";
import { useEffect } from "react";

export default function App() {
    const { token, isReady } = useAuth();
    const isAuthenticated = !!token;
    console.log("App rendu, isAuthenticated :", isAuthenticated);

    useEffect(() => {
        console.log("🔄 App.tsx rerender → token:", token);
    }, [token]);
    if (!isReady) return <div>Chargement...</div>; // ou un loader
    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
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
                        isAuthenticated ? (
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
                <Route
                    path="/book/:id"
                    element={
                        isAuthenticated ? (
                            <Book />
                        ) : (
                            <Navigate
                                to="/connexion"
                                replace
                            />
                        )
                    }
                />
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
            <Footer />
        </div>
    );
}
