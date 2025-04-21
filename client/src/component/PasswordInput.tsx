import { useState } from "react";

interface PasswordInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
}

export default function PasswordInput({
    label,
    name,
    value,
    onChange,
    required = true,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <label htmlFor={name}>
            <fieldset>
                <legend>{label}</legend>
                <div className="password-input-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className="password-input"
                    />
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
