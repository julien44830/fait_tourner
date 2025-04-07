import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // ✅
import Home from "./page/Home";
import Login from "./page/Login";
import Book from "./page/Book";
import Registration from "./page/Registration";
import Footer from "./layout/Footer";

export default function App() {
    const { token, isReady } = useAuth();
    const isAuthenticated = !!token;

    if (!isReady) return <div>Chargement...</div>; // ou un loader
    return (
        <div className="app-container">
            <main className="main-content">
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
            </main>
            <Footer />
        </div>
    );
}
