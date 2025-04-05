import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import GoogleConnexion from "../component/GoogleConnexion";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../component/PasswordInput";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://faittourner-production.up.railway.app/api/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) throw new Error("Échec de la connexion");

            const data = await response.json();

            login(data.token);
            localStorage.setItem("name", data.name);

            navigate("/accueil");
        } catch (error) {
            console.error("❌ Erreur de connexion :", error);
        }
    };

    return (
        <>
            <form
                className="form-group-connexion"
                onSubmit={handleLogin}
            >
                <img
                    className="logo-connexion"
                    src="/images/logo.png"
                    alt=""
                />
                <h2>Connexion</h2>
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
                <PasswordInput
                    label="Mot de passe"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />{" "}
                <button className="form-btn-connexion">Connexion</button>
                <p>
                    Pas encore inscrit ?{" "}
                    <NavLink to="/inscription">Créer un compte</NavLink>
                </p>
            </form>
            <section className="connexion-google-wrapper">
                <p className="ou-texte">ou</p>
                <GoogleConnexion />
            </section>{" "}
        </>
    );
}
