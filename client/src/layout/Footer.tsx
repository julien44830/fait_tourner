import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Contexte partagé

export default function Footer() {
    const navigate = useNavigate();
    const { isAuthenticated, isReady, logout } = useAuth(); // ✅

    const handleLogout = () => {
        logout(); // ✅ Déconnecte via le contexte
        navigate("/connexion");
    };

    const handleDeleteRequest = async () => {
        const token = localStorage.getItem("token"); // ← encore tolérable ici
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
            <p>© 2025 PictEvent</p>
            {isReady &&
                isAuthenticated && ( // ✅ on affiche que si le contexte est prêt
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
