import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vérifie si un token est présent dans le localStorage
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // Convertit en booléen
    }, []);

    const handleLogout = () => {
        // Supprime le token d'authentification
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        // Redirige vers la page de connexion
        navigate("/connexion");
    };

    const handleDeleteRequest = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Vous devez être connecté.");

        const res = await fetch(
            "https://faittourner-production.up.railway.app/request-delete",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();
        alert(data.message);
    };

    return (
        <footer>
            <p>© 2025 - Mon Application</p>
            {isAuthenticated && (
                <>
                    <button onClick={handleLogout}>Déconnexion</button>
                    <button onClick={handleDeleteRequest}>
                        Supprimer votre compte
                    </button>
                </>
            )}
        </footer>
    );
}
