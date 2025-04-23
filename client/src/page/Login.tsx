/**
 * 🔐 Composant `Login`
 *
 * 🎯 Rôle :
 * Ce composant représente la page de connexion utilisateur.
 * Il permet à un utilisateur de :
 * - Se connecter via email/mot de passe
 * - Se connecter avec Google via OAuth (composant `GoogleConnexion`)
 *
 * ---
 *
 * ⚙️ Fonctionnalités :
 * - Effectue un appel `POST /api/login` pour authentifier l’utilisateur
 * - Stocke le token JWT dans le contexte via `useAuth().login()`
 * - Enregistre le nom dans le localStorage pour affichage ultérieur
 * - Redirige vers `/accueil` après connexion réussie
 *
 * ---
 *
 * 🧱 Composants utilisés :
 * - `PasswordInput` : champ de saisie du mot de passe avec affichage/masquage
 * - `GoogleConnexion` : bouton de connexion Google OAuth
 *
 * ---
 *
 * ✅ Sécurité :
 * - Utilise la fonction `getEnvApiUrl()` pour ne pas dépendre directement des variables d’environnement (utilisé pour les tests)
 */

import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import GoogleConnexion from "../component/GoogleConnexion";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../component/PasswordInput";
import { getEnvApiUrl } from "../utils/getEnvApiUrl";

export default function Login() {
    // 🔐 États liés au formulaire
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 🧭 Permet la redirection après connexion
    const navigate = useNavigate();

    // 🎯 Hook du contexte Auth pour stocker le token
    const { login } = useAuth();

    /**
     * 🔄 Fonction exécutée à la soumission du formulaire
     * Appelle l'API de connexion et stocke le token si la réponse est valide
     */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // 🔒 Empêche le rechargement de page

        try {
            // 📡 Appel de l'API d'authentification
            const response = await fetch(`${getEnvApiUrl()}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error("Échec de la connexion");

            const data = await response.json();

            // ✅ Stockage du token via contexte et du nom utilisateur
            login(data.token);
            localStorage.setItem("name", data.name);

            // 🔁 Redirection vers la page d’accueil après login
            navigate("/accueil");
        } catch (error) {
            console.error("❌ Erreur de connexion :", error);
        }
    };

    return (
        <>
            {/* 🧾 Formulaire de connexion classique */}
            <form
                className="form-group-connexion"
                onSubmit={handleLogin}
            >
                <img
                    className="logo-connexion"
                    src="/images/logo.png"
                    alt="Logo"
                />
                <h2>Connexion</h2>

                {/* Champ Email */}
                <label htmlFor="email">
                    <fieldset>
                        <legend>Email</legend>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </fieldset>
                </label>

                {/* Champ mot de passe avec affichage/masquage */}
                <PasswordInput
                    label="Mot de passe"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Bouton de soumission */}
                <button className="form-btn-connexion">Connexion</button>

                {/* Lien vers l’inscription */}
                <div>
                    Pas encore inscrit ?{" "}
                    <NavLink to="/inscription">Créer un compte</NavLink>
                </div>
            </form>

            {/* Connexion alternative via Google */}
            <section className="connexion-google-wrapper">
                <p className="ou-texte">ou</p>
                <GoogleConnexion />
            </section>
        </>
    );
}
