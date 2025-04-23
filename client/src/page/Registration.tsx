/**
 * 👤 Composant `Registration`
 *
 * 🎯 Objectif :
 * Permet aux utilisateurs de créer un compte via un formulaire classique ou via une invitation par email contenant un `token`.
 *
 * ---
 *
 * ⚙️ Fonctionnalités principales :
 * - Gère un formulaire d’inscription avec nom, prénom, email, mot de passe et confirmation
 * - Vérifie la robustesse du mot de passe en temps réel
 * - Pré-remplit l’email depuis un token d’invitation si fourni dans l’URL
 * - Affiche des messages d’erreur en cas de validation ou réponse API négative
 * - Redirige vers la page de connexion en cas de succès
 * - Intègre aussi une connexion alternative via Google (composant `GoogleConnexion`)
 *
 * ---
 *
 * 🧱 Dépendances :
 * - `PasswordInput` : champs de mot de passe masqué/visible
 * - `GoogleConnexion` : bouton OAuth Google
 * - `Alert` : affichage conditionnel de message d'erreur
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GoogleConnexion from "../component/GoogleConnexion";
import PasswordInput from "../component/PasswordInput";
import Alert from "../component/Alert";

export default function Registration() {
    // 🔐 États du formulaire d’inscription
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [token, setToken] = useState<string | null>(null); // 🔑 Token d’invitation (optionnel)
    const [error, setError] = useState<string | null>(null); // ❌ Erreurs d'inscription
    const [passwordError, setPasswordError] = useState<string | null>(null); // ❌ Erreurs de mot de passe
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * 🔐 Vérifie que le mot de passe est fort :
     * - Min. 8 caractères
     * - Au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
     */
    const isStrongPassword = (password: string) => {
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
        return strongPasswordRegex.test(password);
    };

    /**
     * 🔄 Récupère le token dans l’URL à l’arrivée sur la page
     * Pré-remplit l’email si possible.
     */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get("token");

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            try {
                const decoded: any = jwtDecode(tokenFromUrl);
                if (decoded.email) {
                    setFormData((prevData) => ({
                        ...prevData,
                        email: decoded.email,
                    }));
                }
            } catch (err) {
                console.error("❌ Erreur de décodage token :", err);
                setError("Token invalide ou expiré.");
            }
        }
    }, [location.search]);

    /**
     * 📝 Mise à jour des champs du formulaire
     * Met aussi à jour le message d’erreur sur le mot de passe
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            if (!isStrongPassword(value)) {
                setPasswordError(
                    "⚠️ Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
                );
            } else {
                setPasswordError(null);
            }
        }
    };

    /**
     * 🚀 Envoie le formulaire au backend pour l’inscription
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isStrongPassword(formData.password)) {
            setError("❌ Votre mot de passe n'est pas assez fort.");
            return;
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    token,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("✅ Inscription réussie !");
            navigate("/connexion");
        } else {
            setError(`❌ Erreur : ${data.error}`);
        }
    };

    return (
        <>
            {/* ⚠️ Message d’erreur pour mot de passe faible */}
            {passwordError && (
                <Alert
                    type="error"
                    message={passwordError}
                    onClose={() => setPasswordError(null)}
                />
            )}

            {/* 🧾 Formulaire d’inscription */}
            <form
                className="form-group-connexion"
                onSubmit={handleSubmit}
            >
                <img
                    className="logo-connexion"
                    src="/images/logo.png"
                    alt="Logo"
                />

                <h2>Inscription</h2>

                {/* ❌ Message d’erreur global */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Champs Nom, Prénom, Email */}
                <label htmlFor="name">
                    <fieldset>
                        <legend>Nom</legend>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                </label>

                <label htmlFor="lastname">
                    <fieldset>
                        <legend>Prénom</legend>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                </label>

                <label htmlFor="email">
                    <fieldset>
                        <legend>Email</legend>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={!!token} // 🔒 Verrouille le champ si email depuis token
                        />
                    </fieldset>
                </label>

                {/* Champs Mot de passe et Confirmation */}
                <PasswordInput
                    label="Mot de passe"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={passwordError ?? undefined}
                />

                <PasswordInput
                    label="Confirmation du mot de passe"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                {/* 🔘 Bouton d'envoi */}
                <button
                    className="form-btn-connexion"
                    type="submit"
                >
                    Inscription
                </button>

                {/* 🔁 Redirection si déjà inscrit */}
                <p>
                    Déjà un compte ?{" "}
                    <NavLink to="/connexion">Connecte toi</NavLink>
                </p>
            </form>

            {/* ✅ Connexion Google */}
            <section className="connexion-google-wrapper">
                <p className="ou-texte">ou</p>
                <GoogleConnexion />
            </section>
        </>
    );
}
