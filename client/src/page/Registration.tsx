import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error] = useState("");
    const [success] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("http://localhost:4000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inscription réussie !");
            navigate("/connexion"); // 🔥 Rediriger vers la page de connexion
        } else {
            alert(`Erreur : ${data.error}`);
        }
    };

    return (
        <>
            <form
                className="form-group-connexion"
                onSubmit={handleSubmit}
            >
                <h2>Inscription</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}

                <label htmlFor="name">
                    <fieldset>
                        <legend>Nom </legend>
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
                        <legend>Prénom </legend>
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
                        <legend>Email </legend>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                </label>

                <label htmlFor="password">
                    <fieldset>
                        <legend>Mot de passe </legend>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                </label>

                <label htmlFor="confirmPassword">
                    <fieldset>
                        <legend>Confirmation du mot de passe </legend>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                </label>

                <button
                    className="form-btn-connexion"
                    type="submit"
                >
                    Inscription
                </button>
            </form>
        </>
    );
}
