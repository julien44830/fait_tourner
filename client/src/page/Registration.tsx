import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GoogleConnexion from "../component/GoogleConnexion";
import PasswordInput from "../component/PasswordInput";
import Alert from "../component/Alert";

export default function Registration() {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Vérification de la force du mot de passe
    const isStrongPassword = (password: string) => {
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
        return strongPasswordRegex.test(password);
    };

    // ✅ Vérification si un token est présent dans l'URL
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
                        email: decoded.email, // Pré-remplit l'email
                    }));
                }
            } catch (err) {
                console.error("❌ Erreur lors du décodage du token :", err);
                setError("Token invalide ou expiré.");
            }
        }
    }, [location.search]);

    // 🛠 Gestion des changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Vérification de la force du mot de passe en temps réel
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

    // 📌 Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isStrongPassword(formData.password)) {
            setError("❌ Votre mot de passe n'est pas assez fort.");
            return;
        }

        const response = await fetch(
            `https://faittourner-production.up.railway.app/api/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    token, // 🔥 Envoie bien le token au backend
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("✅ Inscription réussie !");
            navigate("/connexion"); // 🔥 Redirection vers la page de connexion
        } else {
            setError(`❌ Erreur : ${data.error}`);
        }
    };

    return (
        <>
            {passwordError && (
                <Alert
                    type="error"
                    message={passwordError}
                    onClose={() => setPasswordError(null)}
                />
            )}
            <form
                className="form-group-connexion"
                onSubmit={handleSubmit}
            >
                <img
                    className="logo-connexion"
                    src="/images/logo.png"
                    alt=""
                />

                <h2>Inscription</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}

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
                            disabled={!!token} // 🔒 Empêche la modification si l'email vient de l'invitation
                        />
                    </fieldset>
                </label>

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

                <button
                    className="form-btn-connexion"
                    type="submit"
                >
                    Inscription
                </button>
                <p>
                    Déjà un compte ?{" "}
                    <NavLink to="/connexion">Connecte toi</NavLink>
                </p>
            </form>
            <section className="connexion-google-wrapper">
                <p className="ou-texte">ou</p>
                <GoogleConnexion />
            </section>{" "}
        </>
    );
}
