import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Redirection après connexion

    const handleLogin = async (e: React.FormEvent) => {
        // ✅ Correction de la typo
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Échec de la connexion");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);

            navigate("/accueil");
        } catch (error) {
            console.error("❌ Erreur de connexion :", error);
        }
    };

    return (
        <form
            className="form-group-connexion"
            onSubmit={handleLogin}
        >
            {" "}
            {/* ✅ Correction de la typo */}
            <h2>Connexion</h2>
            <label htmlFor="email">
                <fieldset>
                    <legend>Email</legend>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </fieldset>
            </label>
            <label htmlFor="password">
                <fieldset>
                    <legend>Mot de passe</legend>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </fieldset>
            </label>
            <button className="form-btn-connexion">Connexion</button>
            <p>
                Pas encore inscrit ?{" "}
                <NavLink to="/inscription">Créer un compte</NavLink>
            </p>
        </form>
    );
}
