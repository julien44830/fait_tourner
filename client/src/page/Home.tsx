import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface Book {
    id: number;
    name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);
    const [name, setName] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [newBookName, setNewBookName] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            const token = localStorage.getItem("token");
            const storedName = localStorage.getItem("name");
            if (storedName) setName(storedName);
            if (!token) {
                console.error("❌ Aucun token trouvé, accès refusé.");
                return;
            }

            try {
                const response = await fetch(
                    `https://faittourner-production.up.railway.app/api/books`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }

                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error(
                    "❌ Erreur lors de la récupération des books :",
                    error
                );
            }
        };

        fetchBooks();
    }, []);

    // ✅ Fonction pour créer un book
    const handleCreateBook = async () => {
        if (!newBookName) {
            alert("Veuillez entrer un nom pour le book.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté.");
            return;
        }

        try {
            const response = await fetch(
                `https://faittourner-production.up.railway.app/api/books`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: newBookName }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setBooks([...books, { id: data.bookId, name: newBookName }]);
                setNewBookName("");
                setShowModal(false);
            } else {
                alert(`❌ Erreur : ${data.error}`);
            }
        } catch (error) {
            console.error("❌ Erreur lors de la création du book :", error);
            alert("Erreur serveur.");
        }
    };

    return (
        <div className="home-container">
            <h2>Bonjour, {name}</h2>

            {/* ✅ Bouton pour ouvrir la modale */}
            <button
                className="create-book-btn"
                onClick={() => setShowModal(true)}
            >
                Créer un nouveau book
            </button>

            <h3>📚 Mes Books :</h3>
            <div className="books-list">
                {books.length > 0 ? (
                    books.map((b) => (
                        <NavLink
                            key={b.id}
                            to={`/book/${b.id}`}
                            className="book-link"
                        >
                            {b.name}
                        </NavLink>
                    ))
                ) : (
                    <p className="no-books">
                        ❌ Vous n'avez aucun book actuellement
                    </p>
                )}
            </div>

            {/* ✅ Modale de création */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Créer un book</h3>
                        <input
                            type="text"
                            placeholder="Nom du book"
                            value={newBookName}
                            onChange={(e) => setNewBookName(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button
                                onClick={handleCreateBook}
                                className="create-btn"
                            >
                                Valider
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="cancel-btn"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
