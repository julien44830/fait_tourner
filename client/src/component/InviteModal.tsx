import { useState } from "react";

export default function InviteModal({ bookId }: { bookId: number }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/invite`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email, bookId }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setMessage("Invitation envoyée avec succès !");
            } else {
                setMessage(
                    data.error || "Erreur lors de l'envoi de l'invitation."
                );
            }
        } catch (error) {
            setMessage("Erreur serveur.");
        }
    };

    return (
        <div className="modal">
            <h2>Partager ce book</h2>
            <form onSubmit={handleInvite}>
                <input
                    type="email"
                    placeholder="Email de l'invité"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    className="button"
                    type="submit"
                >
                    Envoyer l'invitation
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
