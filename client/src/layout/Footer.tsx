/**
 * Composant `Footer`
 *
 * ✅ Ce composant affiche un pied de page en version mobile.
 * ✅ S'il y a un utilisateur connecté (isAuthenticated), il affiche :
 *   - Un bouton de déconnexion
 *   - Un bouton pour demander la suppression du compte (qui ouvre une modale)
 *
 * ✉️ Lorsqu’un utilisateur demande la suppression :
 *   - un email de confirmation est envoyé automatiquement
 *   - le compte n’est pas supprimé immédiatement : il est supprimé **après validation du lien reçu par email**
 *   - L’objectif ici est de **lancer le processus de suppression** côté serveur, tout en laissant le contrôle à l’utilisateur.
 *
 * 🧠 Il utilise le contexte d'authentification pour accéder à :
 *   - l'état de connexion (`isAuthenticated`)
 *   - la méthode de déconnexion (`logout`)
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Footer() {
    const navigate = useNavigate();
    const { isAuthenticated, isReady, logout } = useAuth();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [message, setMessage] = useState("");

    // 🔐 Déconnexion et redirection vers /connexion
    const handleLogout = () => {
        logout();
        navigate("/connexion");
    };

    // 🧨 Envoie une requête POST pour demander la suppression du compte
    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Vous devez être connecté.");
            return;
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/request-delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setMessage(data.message);

            // ✅ Ferme la modale automatiquement après 3 secondes
            setTimeout(() => {
                setShowDeleteModal(false);
                setMessage("");
            }, 3000);
        } catch (error) {
            console.error("Erreur lors de la demande de suppression :", error);
            setMessage("Erreur lors de l'envoi de la demande.");
        }
    };

    return (
        <footer>
            <p>© 2025 PictEvent</p>

            {/* ✅ Affiche les boutons uniquement si l'app est prête et que l'utilisateur est connecté */}
            {isReady && isAuthenticated && (
                <>
                    <button
                        className="button-delete"
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </button>

                    <button
                        className="button-delete"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Supprimer votre compte
                    </button>

                    {/* 🧾 Modale de confirmation de suppression */}
                    {showDeleteModal && (
                        <div className="modal-overlay">
                            <div
                                className="modal-content"
                                style={{ textAlign: "left" }}
                            >
                                <h2>Suppression de votre compte</h2>
                                <p className="p-footer">
                                    <strong>
                                        Conséquences de la suppression :
                                    </strong>
                                </p>
                                <ul className="ul-footer">
                                    <li className="li-footer">
                                        Tous vos books seront supprimés
                                    </li>
                                    <li className="li-footer">
                                        Les images qu’ils contiennent seront
                                        supprimées
                                    </li>
                                    <li className="li-footer">
                                        Vos ami(e)s ne pourront plus accéder à
                                        vos books
                                    </li>
                                    <li className="li-footer">
                                        Les books de vos ami(e)s et les images
                                        que vous avez partagées ne vous seront
                                        plus accessibles
                                    </li>
                                    <li className="li-footer">
                                        Les images partagées dans les books de
                                        vos ami(e)s seront supprimées
                                    </li>
                                </ul>
                                <p className="p-footer">
                                    <strong>
                                        Souhaitez-vous vraiment supprimer votre
                                        compte ?
                                    </strong>
                                </p>

                                {/* 🛑 Message d'erreur éventuel */}
                                {message && (
                                    <p
                                        style={{
                                            color: "red",
                                            marginTop: "8px",
                                        }}
                                    >
                                        {message}
                                    </p>
                                )}

                                {/* ✅ Boutons d'action */}
                                <div className="modal-buttons">
                                    <button
                                        className="create-btn button-delete"
                                        onClick={handleConfirmDelete}
                                    >
                                        Confirmer
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setMessage("");
                                        }}
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </footer>
    );
}
