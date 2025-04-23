import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ Utilise le contexte d'authentification
import { getEnvApiUrl } from "../utils/getEnvApiUrl"; // ✅ Utilitaire pour obtenir l'URL de l'API

/**
 * Composant `GoogleConnexion`
 *
 * 🎯 Ce composant permet à l'utilisateur de **se connecter via Google OAuth 2.0**.
 * Il utilise la stratégie "implicit flow" pour récupérer un `access_token` Google,
 * qu'il transmet ensuite à l'API backend pour obtenir un JWT.
 *
 * ✅ Gère la connexion classique et le cas particulier d'une **invitation via token dans l'URL**.
 * ✅ Met à jour le contexte d’authentification avec le token JWT reçu du backend.
 * ✅ Redirige l’utilisateur vers `/accueil` après une connexion réussie.
 */

export default function GoogleConnexion() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const invitationToken = params.get("token");

    const { login } = useAuth(); // Récupère la fonction login du contexte

    // ⚙️ Initialisation de la connexion Google avec les handlers de succès/erreur
    const googleLogin = useGoogleLogin({
        flow: "implicit", // ⚠️ Utilisation du flux implicite côté client
        onSuccess: async (tokenResponse) => {
            try {
                // 🔐 Appel au backend avec l'access_token Google
                const res = await axios.post(
                    `${getEnvApiUrl()}/api/auth/google/token`, // ✅ URL dynamique
                    {
                        access_token: tokenResponse.access_token,
                        token: invitationToken, // Inclut le token d'invitation s’il est présent
                    }
                );

                // 🔓 Mise à jour du contexte et du localStorage
                login(res.data.token);
                localStorage.setItem("name", res.data.user.name);

                // ✅ Redirection vers la page d’accueil
                navigate("/accueil");
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
            onClick={() => googleLogin()} // Déclenche le login Google
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
