/**
 * 📘 Composant `Book`
 *
 * 🔍 Objectif :
 * Ce composant est responsable de l'affichage **d'un album photo** (appelé "book").
 * Il gère la **récupération des données du book**, **l'affichage des images**, ainsi que
 * les **modales d'ajout** et de **partage** du book.
 *
 * ---
 *
 * ⚙️ Fonctionnalités principales :
 * - 🔁 **Récupère les données du book** (titre + images) à partir de l'`API`.
 * - 📤 **Permet d'ajouter des images** via une modale `UploadModal`.
 * - 📩 **Permet de partager le book** avec d'autres utilisateurs via `InviteModal`.
 * - 🔍 Affiche les images du book, avec possibilité de les voir en **plein écran** (`ImageModal`).
 * - 🔄 Affiche en **grille** ou **liste** grâce à `isGridView`.
 * - 🧪 Gère les **états de chargement** (`isLoadingBook`, `isLoadingPictures`).
 *
 * ---
 *
 * 🧠 Comportement :
 * - Si `id` est fourni via `props`, il est utilisé, sinon le composant utilise `useParams()`.
 * - Les appels API nécessitent un token présent dans le `localStorage`.
 * - Les erreurs sont loggées dans la console.
 * - Le **switch de vue** permet à l’utilisateur de changer l’affichage des images.
 *
 * ---
 *
 * 🧱 Composants utilisés :
 * - `Loader` : indicateur de chargement
 * - `ImageModal` : modale de visualisation d'image en plein écran
 * - `InviteModal` : modale d'invitation d'utilisateur
 * - `UploadModal` : modale d'ajout d'image
 *
 */

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../component/Loader";
import ImageModal from "../component/modals/ImageModal";
import InviteModal from "../component/modals/InviteModal";
import UploadModal from "../component/modals/UploadModal";
import { getEnvApiUrl } from "../utils/getEnvApiUrl";

interface Props {
    id?: string;
}

interface Book {
    id: string;
    name: string;
}

interface Picture {
    picture_id: string;
    picture_name: string;
    path: string;
    tags: string | null;
}

export default function Book({ id }: Props) {
    const API_URL = getEnvApiUrl();
    const routeParams = useParams<{ id: string }>();
    const bookId = id || routeParams.id;

    // États du composant
    const [book, setBook] = useState<Book | null>(null);
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [isLoadingPictures, setIsLoadingPictures] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null
    );
    const [isGridView, setIsGridView] = useState(true);

    // 📥 Récupération des données du book au chargement
    useEffect(() => {
        const fetchBook = async () => {
            const token = localStorage.getItem("token");
            if (!token || !bookId) return;

            try {
                const response = await fetch(`${API_URL}/api/books/${bookId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok)
                    throw new Error(`Erreur HTTP ${response.status}`);

                const data = await response.json();
                setBook(data.book);
                setPictures(data.pictures || []);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération :", error);
            } finally {
                setIsLoadingBook(false);
                setTimeout(() => setIsLoadingPictures(false), 2000);
            }
        };

        fetchBook();
    }, [bookId]);

    // 🔁 Rafraîchit les images d'un book (utilisé après upload)
    const refreshBookPictures = async () => {
        const token = localStorage.getItem("token");
        if (!token || !bookId) return;

        try {
            const response = await fetch(`${API_URL}/api/books/${bookId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setPictures(data.pictures || []);
        } catch (err) {
            console.error("Erreur lors du rafraîchissement des images :", err);
        }
    };

    // 📤 Gestion de l'upload d'image via formulaire
    const handleUpload = async (files: File[]) => {
        const token = localStorage.getItem("token");
        if (!token || !bookId) throw new Error("Utilisateur non connecté.");

        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        formData.forEach((value, key) => {
            console.log(`FormData key=${key}, value=`, value);
        });

        const response = await fetch(`${API_URL}/api/upload/${bookId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Erreur inconnue");

        const uploadedPictures = Array.isArray(data.pictures)
            ? data.pictures.map((pic: any) => ({
                  picture_id: pic.picture_id || Date.now(),
                  picture_name: pic.name,
                  path: pic.path,
                  tags: null,
              }))
            : [];

        if (uploadedPictures.length > 0) {
            setPictures((prev) => [...prev, ...uploadedPictures]);
            await refreshBookPictures();
        } else {
            throw new Error("Aucune image n'a été enregistrée.");
        }
    };

    if (isLoadingBook) return <Loader text="Chargement du book" />;

    return (
        <div className="book-container">
            <h2>{book?.name}</h2>

            {/* 🔁 Bouton de switch de vue grille/liste */}
            <div className="toggle-container">
                <label>
                    {isGridView ? "Vue grille" : "Affichage normal"}
                    <div className="switch">
                        <input
                            type="checkbox"
                            checked={isGridView}
                            onChange={() => setIsGridView(!isGridView)}
                        />
                        <span className="slider" />
                    </div>
                </label>
            </div>

            {/* 📤 Bouton pour ajouter des images */}
            <div className="upload-section">
                <button
                    className="button"
                    onClick={() => setShowUploadModal(true)}
                >
                    Ajouter des images
                </button>
            </div>

            {/* 📩 Bouton pour inviter un utilisateur */}
            <button
                onClick={() => setShowInviteModal(true)}
                style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "10px",
                }}
            >
                Partager le book
            </button>

            {/* 📤 Modale d'upload d'image */}
            {showUploadModal && (
                <UploadModal
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUpload}
                />
            )}

            {/* 📩 Modale d'invitation */}
            {showInviteModal && bookId && (
                <InviteModal
                    bookId={bookId}
                    onClose={() => setShowInviteModal(false)}
                />
            )}

            {/* 🖼️ Liste des images (vue grille ou liste) */}
            <div
                className={isGridView ? "image-grid" : "image-list"}
                style={{
                    display: "flex",
                    flexDirection: isGridView ? "row" : "column",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >
                {isLoadingPictures ? (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            marginTop: "2rem",
                        }}
                    >
                        <Loader text="Chargement des images" />
                    </div>
                ) : pictures.length > 0 ? (
                    pictures.map((picture) => (
                        <div
                            key={picture.picture_id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                                borderRadius: "6px",
                                width: isGridView ? "calc(25% - 10px)" : "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    aspectRatio: isGridView ? "1 / 1" : "auto",
                                    overflow: "hidden",
                                    borderRadius: "4px",
                                }}
                            >
                                <img
                                    src={`${API_URL}${picture.path}`}
                                    alt={picture.picture_name}
                                    onClick={() =>
                                        setSelectedImageIndex(
                                            pictures.findIndex(
                                                (p) =>
                                                    p.picture_id ===
                                                    picture.picture_id
                                            )
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        display: "block",
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{`Le book ${
                        book?.name || ""
                    } ne contient aucune image`}</p>
                )}

                {/* 🔍 Modale de visualisation plein écran */}
                {selectedImageIndex !== null && (
                    <ImageModal
                        images={pictures.map((p) => `${API_URL}${p.path}`)}
                        currentIndex={selectedImageIndex}
                        onClose={() => setSelectedImageIndex(null)}
                        onPrev={() =>
                            setSelectedImageIndex((prev) =>
                                prev === 0
                                    ? pictures.length - 1
                                    : (prev ?? 0) - 1
                            )
                        }
                        onNext={() =>
                            setSelectedImageIndex((prev) =>
                                prev === pictures.length - 1
                                    ? 0
                                    : (prev ?? 0) + 1
                            )
                        }
                    />
                )}
            </div>
        </div>
    );
}
