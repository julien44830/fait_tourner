import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ Utilise le contexte

export default function GoogleConnexion() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const invitationToken = params.get("token");

    const { login } = useAuth(); // ✅ Appel au contexte

    const googleLogin = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.post(
                    "https://faittourner-production.up.railway.app/api/auth/google/token",
                    {
                        access_token: tokenResponse.access_token,
                        token: invitationToken,
                    }
                );

                // ✅ Appelle login() pour mettre à jour le contexte (pas seulement localStorage)
                login(res.data.token);
                localStorage.setItem("name", res.data.user.name);

                console.log(
                    "✅ Stockage terminé, redirection vers /accueil dans 100ms"
                );

                setTimeout(() => {
                    navigate("/accueil");
                }, 100);
            } catch (err) {
                console.error("❌ Erreur de login Google :", err);
            }
        },
        onError: (errorResponse) => {
            console.error("❌ Erreur Google OAuth :", errorResponse);
        },
    });

    return (
        <button
            onClick={() => googleLogin()}
            className="connexion-google"
        >
            <img
                src="/images/google.png"
                alt="Google"
                className="google-logo"
            />
            Connexion avec Google
        </button>
    );
}
