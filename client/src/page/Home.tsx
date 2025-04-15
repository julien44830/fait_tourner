import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Loader from "../component/Loader"; // ⚠️ ajuste le chemin selon ton projet
import ConfirmModal from "../component/ConfirmModal"; // ⚠️ idem

interface Book {
    id: number;
    name: string;
}

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState<string>("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBookName, setNewBookName] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            const token = localStorage.getItem("token");
            const storedName = localStorage.getItem("name");
            if (storedName) setName(storedName);
            if (!token) {
                console.error("❌ Aucun token trouvé.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/books`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok)
                    throw new Error(`Erreur HTTP ${response.status}`);

                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error("❌ Erreur récupération books :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

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

    const handleDeleteBook = async (bookId: number) => {
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
        } catch (error) {
            console.error("❌ Erreur suppression :", error);
            alert("Erreur lors de la suppression du book.");
        }
    };

    return (
        <div className="home-container">
            <h2>Bonjour, {name}</h2>

            <button
                className="create-book-btn"
                onClick={() => setShowCreateModal(true)}
            >
                Créer un nouveau book
            </button>

            <h3>📚 Mes Books :</h3>

            <div className="books-list">
                {isLoading ? (
                    <Loader text="Chargement des books" />
                ) : books.length > 0 ? (
                    books.map((b) => (
                        <div
                            key={b.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 15px",
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                marginBottom: "10px",
                            }}
                        >
                            <NavLink
                                to={`/book/${b.id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "#333",
                                    flexGrow: 1,
                                }}
                            >
                                {b.name}
                            </NavLink>
                            <button
                                onClick={() => {
                                    setBookToDelete(b);
                                    setShowDeleteModal(true);
                                }}
                                style={{
                                    backgroundColor: "#fff",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                }}
                            >
                                <img
                                    src="/images/delete.png"
                                    alt="corbeille"
                                    style={{
                                        width: "20px",
                                        height: "24px",
                                    }}
                                />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-books">
                        ❌ Vous n'avez aucun book actuellement
                    </p>
                )}
            </div>

            {/* ✅ Modale de création */}
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
        </div>
    );
}
