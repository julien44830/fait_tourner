import { useState } from "react";

/**
 * Props du composant `PasswordInput`
 */
interface PasswordInputProps {
    label: string; // 🔤 Libellé affiché au-dessus du champ
    name: string; // 🔑 Nom de l’input, utilisé pour lier le label et l'input
    value: string; // 📦 Valeur du champ mot de passe
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 🔁 Handler de changement
    required?: boolean; // ✅ Si le champ est requis ou non (par défaut oui)
    error?: string; // ❌ (optionnel) Message d'erreur (non utilisé ici mais peut être étendu)
}

/**
 * Composant `PasswordInput`
 *
 * 🎯 Permet de saisir un mot de passe avec une icône pour afficher/masquer la valeur.
 *
 * ✅ Contrôle la visibilité du mot de passe via un bouton œil.
 * ✅ Affiche dynamiquement une image `eye.png` ou `eye-no.png` selon l'état.
 * ✅ Reçoit toutes les données en props : label, value, onChange, etc.
 */
export default function PasswordInput({
    label,
    name,
    value,
    onChange,
    required = true,
}: PasswordInputProps) {
    // 🔁 État local pour afficher ou masquer le mot de passe
    const [showPassword, setShowPassword] = useState(false);

    return (
        <label htmlFor={name}>
            <fieldset>
                <legend>{label}</legend>

                <div className="password-input-wrapper">
                    {/* 🔐 Champ de saisie */}
                    <input
                        type={showPassword ? "text" : "password"} // bascule visibilité
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className="password-input"
                    />

                    {/* 👁️ Icône pour basculer visibilité */}
                    <img
                        src={
                            showPassword
                                ? "/images/eye.png"
                                : "/images/eye-no.png"
                        }
                        alt={
                            showPassword
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                        }
                        onClick={() => setShowPassword(!showPassword)}
                        className="toggle-password-icon"
                    />
                </div>
            </fieldset>
        </label>
    );
}
