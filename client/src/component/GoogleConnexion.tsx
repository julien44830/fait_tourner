import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function GoogleConnexion() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const invitationToken = params.get("token"); // 🔥 Récupère le token d'invitation s'il existe

    const login = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.post(
                    "https://faittourner-production.up.railway.app/api/auth/google/token",
                    {
                        access_token: tokenResponse.access_token,
                        token: invitationToken, // 🔥 Envoie aussi le token d'invitation
                    }
                );

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("name", res.data.user.name);
                setTimeout(() => navigate("/accueil"), 1000);
            } catch (err) {
                console.error("❌ Erreur de login Google :", err);
            }
        },
        onError: (errorResponse) => {
            console.error("❌ Erreur Google OAuth :", errorResponse);
        },
    });

    return <button onClick={() => login()}>Connexion avec Google</button>;
}
