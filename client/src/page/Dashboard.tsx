import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Book from "./Book";
import ConfirmModal from "../component/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import "../style/dashboard.css";

interface BookType {
    id: string;
    name: string;
}

export default function Dashboard() {
    const [books, setBooks] = useState<BookType[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBookName, setNewBookName] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<BookType | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [message, setMessage] = useState("");
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            const token = localStorage.getItem("token");
            const storedName = localStorage.getItem("name") || "Utilisateur";
            setUserName(storedName);

            if (!token) return navigate("/connexion");

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/books`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                if (Array.isArray(data)) {
                    setBooks(data);
                    if (data.length > 0) setSelectedBookId(data[0].id);
                } else {
                    console.error("Données inattendues reçues:", data);
                    setBooks([]);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des books", err);
            }
        };

        fetchBooks();
    }, [navigate]);

    const handleCreateBook = async () => {
        setErrorMessage("");
        if (!newBookName.trim()) {
            setErrorMessage("Veuillez entrer un nom pour le book.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setErrorMessage("Vous devez être connecté.");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/books`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ title: newBookName }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setBooks([...books, { id: data.bookId, name: newBookName }]);
                setNewBookName("");
                setShowCreateModal(false);
            } else {
                setErrorMessage(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error("❌ Erreur création book :", error);
            setErrorMessage("Erreur serveur.");
        }
    };

    const handleDeleteBook = async (bookId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Vous devez être connecté.");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/book/${bookId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Erreur serveur");
            }

            setBooks((prev) => prev.filter((b) => b.id !== bookId));
            if (selectedBookId === bookId) setSelectedBookId(null);
        } catch (error) {
            console.error("❌ Erreur suppression :", error);
            alert("Erreur lors de la suppression du book.");
        }
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
        <>
            <div className="dashboard-container">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <p className="user-info">
                            <strong>{userName}</strong>
                        </p>
                    </div>

                    <div className="book-list">
                        <h3>Listes de Books :</h3>
                        {books.map((b) => (
                            <div
                                key={b.id}
                                className={`book-card ${
                                    selectedBookId === b.id ? "active" : ""
                                }`}
                                onClick={() => setSelectedBookId(b.id)}
                            >
                                <span className="book-name">{b.name}</span>
                                <button
                                    className="delete-book-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBookToDelete(b);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <img
                                        src="/images/delete.png"
                                        alt="Supprimer"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        className="create-book-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Nouveau Book
                    </button>

                    {isDesktop && (
                        <div className="dashboard-footer">
                            <button
                                className="button-delete"
                                onClick={logout}
                            >
                                Déconnexion
                            </button>
                            <button
                                className="button-delete"
                                onClick={() => setShowAccountModal(true)}
                            >
                                Supprimer votre compte
                            </button>
                            <p className="footer-desktop">© 2025 Pictevent</p>
                        </div>
                    )}
                </aside>

                <main className="dashboard-content">
                    {selectedBookId ? (
                        isDesktop ? (
                            <Book id={selectedBookId} />
                        ) : (
                            (() => {
                                navigate(`/book/${selectedBookId}`);
                                return null;
                            })()
                        )
                    ) : (
                        <p>Sélectionne un book dans la liste </p>
                    )}
                </main>
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Créer un book</h3>
                        <input
                            type="text"
                            placeholder="Nom du book"
                            value={newBookName}
                            onChange={(e) => setNewBookName(e.target.value)}
                        />
                        {errorMessage && (
                            <p style={{ color: "red", marginTop: "8px" }}>
                                {errorMessage}
                            </p>
                        )}

                        <div className="modal-buttons">
                            <button
                                onClick={handleCreateBook}
                                className="create-btn"
                            >
                                Valider
                            </button>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="cancel-btn"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Modale de confirmation suppression */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Supprimer ce book"
                message={`Voulez-vous vraiment supprimer "${bookToDelete?.name}" ?`}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setBookToDelete(null);
                }}
                onConfirm={async () => {
                    if (bookToDelete) {
                        await handleDeleteBook(bookToDelete.id);
                        setShowDeleteModal(false);
                        setBookToDelete(null);
                    }
                }}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
            />

            {showAccountModal && (
                <div className="modal-overlay">
                    <div
                        className="modal-content"
                        style={{ textAlign: "left" }}
                    >
                        <h2>Suppression de votre compte</h2>
                        <p className="p-footer">
                            <strong>Conséquences de la suppression :</strong>
                        </p>
                        <ul className="ul-footer">
                            <li className="li-footer">
                                Tous vos books seront supprimés
                            </li>
                            <li className="li-footer">
                                Les images qu’ils contiennent seront supprimées
                            </li>
                            <li className="li-footer">
                                Vos ami(e)s ne pourront plus accéder à vos books
                            </li>
                            <li className="li-footer">
                                Les books de vos ami(e)s et les images que vous
                                avez partagées ne vous seront plus accessibles
                            </li>
                            <li className="li-footer">
                                Les images partagées dans les books de vos
                                ami(e)s seront supprimées
                            </li>
                        </ul>
                        <p className="p-footer">
                            <strong>
                                Souhaitez-vous vraiment supprimer votre compte ?
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
                                    setShowAccountModal(false);
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
    );
}
