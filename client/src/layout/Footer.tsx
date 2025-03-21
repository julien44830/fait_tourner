import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Supprime le token d'authentification
        localStorage.removeItem("token"); // Ou sessionStorage.removeItem("token")
        // Redirige vers la page de connexion
        navigate("/connexion");
    };

    return (
        <footer>
            <p>© 2025 - Mon Application</p>
            <button onClick={handleLogout}>Déconnexion</button>
        </footer>
    );
}
