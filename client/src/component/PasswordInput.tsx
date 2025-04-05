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
    error,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <label htmlFor={name}>
            <fieldset>
                <legend>{label}</legend>
                <div style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        style={{ paddingRight: "36px", width: "100%" }}
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
                        style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            height: "20px",
                            width: "20px",
                            cursor: "pointer",
                            userSelect: "none",
                        }}
                    />
                </div>
            </fieldset>
            {error && (
                <p style={{ color: "red", marginTop: "0.25rem" }}>{error}</p>
            )}
        </label>
    );
}
