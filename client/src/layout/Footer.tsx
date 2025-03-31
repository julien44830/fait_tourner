import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Supprime le token d'authentification
        localStorage.removeItem("token"); // Ou sessionStorage.removeItem("token")
        localStorage.removeItem("name"); // Ou sessionStorage.removeItem("name")
        // Redirige vers la page de connexion
        navigate("/connexion");
    };

    const handleDeleteRequest = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Vous devez être connecté.");

        const res = await fetch(
            "https://faittourner-production.up.railway.app/confirm-delete?token=xxx",
            {
                method: "GET",
                headers: {
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
            <button onClick={handleLogout}>Déconnexion</button>
            <button onClick={handleDeleteRequest}>supprimé votre compte</button>
        </footer>
    );
}
