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
        <footer
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderTop: "1px solid #ccc",
            }}
        >
            <p>© 2025 - Mon Application</p>
            <button
                onClick={handleLogout}
                style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Déconnexion
            </button>
        </footer>
    );
}
