import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function GoogleConnexion() {
    const navigate = useNavigate(); // Redirection après connexion

    const login = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            try {
                const res = await axios.post(
                    "https://faittourner-production.up.railway.app/api/auth/google/token",
                    { access_token: tokenResponse.access_token }
                );

                console.log("✅ Utilisateur connecté :", res.data);

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("name", res.data.user.name);
                setTimeout(() => navigate("/accueil"), 1000);

                // Stocker le token, rediriger, etc.
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
