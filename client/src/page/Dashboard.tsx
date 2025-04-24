/**
 * 📊 Composant `Dashboard`
 *
 * 🎯 Objectif :
 * Ce composant est le **point central de l’espace utilisateur authentifié** sur la version desktop.
 * Il permet à l’utilisateur de visualiser ses **books (albums photo)**, d’en créer, supprimer,
 * et de **gérer son compte (déconnexion ou suppression)**.
 *
 * ---
 *
 * ⚙️ Fonctionnalités :
 * - 📚 Récupère tous les books de l'utilisateur via l'API `/api/books`
 * - ➕ Permet de créer un book (modale `CreateBookModal`)
 * - ❌ Permet de supprimer un book (modale `ConfirmModal`)
 * - ⚠️ Permet d'envoyer une demande de suppression de compte (modale `DeleteAccountModal`)
 * - 🔀 Redirige automatiquement en mobile vers `/book/:id` au lieu de charger le composant inline
 * - 🖥️ Affichage conditionnel en fonction de la largeur d'écran (mobile vs desktop)
 *
 * ---
 *
 * 🧱 Composants utilisés :
 * - `Book` : affichage des images d’un book sélectionné
 * - `CreateBookModal` : formulaire de création de book
 * - `ConfirmModal` : confirmation de suppression d’un book
 * - `DeleteAccountModal` : confirmation de suppression de compte
 *
 * ---
 *
 * 🔐 Prérequis :
 * - Le token d’authentification doit être présent dans le `localStorage`.
 * - En cas d’absence de token → redirection vers `/connexion`.
 *
 * 🧪 États principaux :
 * - `books` : liste des books récupérés
 * - `selectedBookId` : book actuellement sélectionné
 * - `userName` : nom de l’utilisateur récupéré du localStorage
 * - `showCreateModal`, `showDeleteModal`, `showAccountModal` : affichage conditionnel des modales
 *
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Book from "./Book";
import ConfirmModal from "../component/modals/ConfirmModal";
import DeleteAccountModal from "../component/modals/DeleteAccountModal";
import CreateBookModal from "../component/modals/CreateBookModal";
import { useAuth } from "../context/AuthContext";
import { getEnvApiUrl } from "../utils/getEnvApiUrl";

interface BookType {
    id: string;
    name: string;
}

export default function Dashboard() {
    const API_URL = getEnvApiUrl(); // État des books et de la sélection
    const [books, setBooks] = useState<BookType[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

    // État utilisateur et vue
    const [userName, setUserName] = useState<string>("");
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    // État de la création de book
    const [showCreateModal, setShowCreateModal] = useState(false);

    // État de la suppression de book
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<BookType | null>(null);

    // État de la suppression de compte
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [message, setMessage] = useState("");

    const { logout } = useAuth();
    const navigate = useNavigate();

    // 📊 Détection du redimensionnement pour adapter le rendu
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 📚 Récupération des books utilisateur au chargement
    useEffect(() => {
        const fetchBooks = async () => {
            const token = localStorage.getItem("token");
            const storedName = localStorage.getItem("name") || "Utilisateur";
            setUserName(storedName);

            if (!token) return navigate("/connexion");

            try {
                const res = await fetch(`${API_URL}/api/books`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
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

    // ➕ Création d'un nouveau book
    const handleCreateBook = async (bookName: string) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Vous devez être connecté.");

        const response = await fetch(`${API_URL}/api/books`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: bookName }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erreur serveur");
        }

        setBooks((prev) => [...prev, { id: data.bookId, name: bookName }]);
    };

    // ❌ Suppression d'un book
    const handleDeleteBook = async (bookId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Vous devez être connecté.");

        try {
            const response = await fetch(`${API_URL}/api/books/${bookId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Erreur serveur");
            }

            setBooks((prev) => prev.filter((b) => b.id !== bookId));
            if (selectedBookId === bookId) setSelectedBookId(null);
        } catch (error) {
            console.error("Erreur suppression :", error);
            alert("Erreur lors de la suppression du book.");
        }
    };

    // ⚠️ Demande de suppression de compte utilisateur
    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Vous devez être connecté.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/request-delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setMessage(data.message);

            setTimeout(() => {
                setShowAccountModal(false);
                setMessage("");
            }, 3000);
        } catch (error) {
            console.error("Erreur demande suppression :", error);
            setMessage("Erreur lors de l'envoi de la demande.");
        }
    };

    return (
        <>
            <div className="dashboard-container">
                {/* 🌐 Sidebar avec liste des books */}
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

                    {/* 📅 Footer uniquement en desktop */}
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

                {/* 🔍 Affichage du book ou message */}
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

            {/* 🖋️ Modale de création de book */}
            {showCreateModal && (
                <CreateBookModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateBook}
                />
            )}

            {/* ❌ Modale de confirmation de suppression de book */}
            {showDeleteModal && bookToDelete && (
                <ConfirmModal
                    isOpen={true}
                    title="Supprimer ce book"
                    message={`Voulez-vous vraiment supprimer "${bookToDelete.name}" ?`}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setBookToDelete(null);
                    }}
                    onConfirm={async () => {
                        await handleDeleteBook(bookToDelete.id);
                        setShowDeleteModal(false);
                        setBookToDelete(null);
                    }}
                    confirmLabel="Supprimer"
                    cancelLabel="Annuler"
                />
            )}

            {/* ⚠️ Modale de suppression de compte */}
            <DeleteAccountModal
                isOpen={showAccountModal}
                onClose={() => {
                    setShowAccountModal(false);
                    setMessage("");
                }}
                onConfirm={handleConfirmDelete}
                message={message}
            />
        </>
    );
}
