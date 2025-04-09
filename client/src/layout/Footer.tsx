import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Footer() {
    const navigate = useNavigate();
    const { isAuthenticated, isReady, logout } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/connexion");
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Vous devez être connecté.");
            return;
        }

        try {
            console.log;
            const res = await fetch(
                "https://faittourner-production.up.railway.app/request-delete",
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

            // ✅ Fermer la modale après 3 secondes
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
