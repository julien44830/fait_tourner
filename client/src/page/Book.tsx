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

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedPictureIds, setSelectedPictureIds] = useState<string[]>([]);

    const togglePictureSelection = (id: string) => {
        setSelectedPictureIds((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const cancelSelection = () => {
        setSelectionMode(false);
        setSelectedPictureIds([]);
    };

    const confirmDeletion = async () => {
        const token = localStorage.getItem("token");
        if (!token || !bookId || selectedPictureIds.length === 0) return;

        try {
            const response = await fetch(`${API_URL}/api/pictures/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    pictureIds: selectedPictureIds,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erreur API : ", data.error);
                return;
            }

            await refreshBookPictures();
            cancelSelection();
        } catch (err) {
            console.error("Erreur lors de la suppression des images :", err);
        }
    };

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
        console.log("book : ", book);
        console.log("picture :", pictures);

        fetchBook();
    }, [bookId]);

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

    const handleUpload = async (files: File[]) => {
        const token = localStorage.getItem("token");
        if (!token || !bookId) throw new Error("Utilisateur non connecté.");

        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        const response = await fetch(`${API_URL}/api/upload/${bookId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Erreur inconnue");

        await refreshBookPictures();
    };

    if (isLoadingBook) return <Loader text="Chargement du book" />;

    return (
        <div className="book-container">
            <h2>{book?.name}</h2>

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

            <div className="upload-section">
                <button
                    className="button"
                    onClick={() => setShowUploadModal(true)}
                >
                    Ajouter des images
                </button>
                <button
                    style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "5px 10px",
                        marginLeft: "10px",
                    }}
                    onClick={() => setShowInviteModal(true)}
                >
                    Partager le book
                </button>
                <button
                    style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 10px",
                        marginLeft: "10px",
                    }}
                    onClick={() => setSelectionMode(true)}
                >
                    🗑 Supprimer des images
                </button>
            </div>

            {selectionMode && (
                <div style={{ margin: "10px 0" }}>
                    <p>
                        Mode sélection activé – {selectedPictureIds.length}{" "}
                        image(s) sélectionnée(s)
                    </p>
                    <button
                        onClick={confirmDeletion}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            marginRight: "10px",
                        }}
                    >
                        ✅ Valider la suppression
                    </button>
                    <button
                        onClick={cancelSelection}
                        style={{ backgroundColor: "green", color: "white" }}
                    >
                        ❌ Annuler
                    </button>
                </div>
            )}

            {showUploadModal && (
                <UploadModal
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUpload}
                />
            )}

            {showInviteModal && bookId && (
                <InviteModal
                    bookId={bookId}
                    onClose={() => setShowInviteModal(false)}
                />
            )}

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
                    pictures.map((picture, index) => (
                        <div
                            key={picture.picture_id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                                borderRadius: "6px",
                                width: isGridView ? "calc(25% - 10px)" : "100%",
                                boxSizing: "border-box",
                                position: "relative",
                                opacity:
                                    selectionMode &&
                                    !selectedPictureIds.includes(
                                        picture.picture_id
                                    )
                                        ? 0.5
                                        : 1,
                                filter:
                                    selectionMode &&
                                    !selectedPictureIds.includes(
                                        picture.picture_id
                                    )
                                        ? "grayscale(100%)"
                                        : "none",
                            }}
                            onClick={() => {
                                if (selectionMode)
                                    togglePictureSelection(picture.picture_id);
                                else setSelectedImageIndex(index);
                            }}
                        >
                            {selectionMode && (
                                <input
                                    type="checkbox"
                                    checked={selectedPictureIds.includes(
                                        picture.picture_id
                                    )}
                                    onChange={() =>
                                        togglePictureSelection(
                                            picture.picture_id
                                        )
                                    }
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        zIndex: 10,
                                    }}
                                />
                            )}
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
