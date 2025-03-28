import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleConnexion() {
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
