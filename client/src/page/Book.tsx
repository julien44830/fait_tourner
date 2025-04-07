import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../component/Loader"; // ✅ à adapter selon ton arborescence
import ImageModal from "../component/ImageModal"; // ✅ à adapter selon ton arborescence

interface Book {
    id: string;
    name: string;
}

interface Picture {
    picture_id: number;
    picture_name: string;
    path: string;
    tags: string | null;
}

export default function Book() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [isLoadingPictures, setIsLoadingPictures] = useState(true);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isGridView, setIsGridView] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null
    );

    useEffect(() => {
        const fetchBook = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé.");
                return;
            }

            try {
                const response = await fetch(
                    `https://faittourner-production.up.railway.app/api/book/${id}`,
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

                setBook(data.book);
                setIsLoadingBook(false);

                setPictures(data.pictures || []);

                // ✅ Délai volontaire de 1 seconde pour le loader
                setTimeout(() => {
                    setIsLoadingPictures(false);
                }, 2000); // ← ici tu peux ajuster (1000ms = 1s)
            } catch (error) {
                console.error("❌ Erreur lors de la récupération :", error);
                setIsLoadingPictures(false); // on stoppe quand même
            }
        };

        if (id) fetchBook();
    }, [id]);
    const handleShare = async () => {
        if (!email || !book?.id) {
            setMessage("Email ou ID du book manquant.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://faittourner-production.up.railway.app/api/invite`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email, bookId: book.id }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Invitation envoyée avec succès !");
                setTimeout(() => {
                    setEmail("");
                    setMessage("");
                    setShowModal(false);
                }, 2500);
            } else {
                setMessage(data.error || "❌ Erreur lors de l'envoi.");
            }
        } catch {
            setMessage("❌ Erreur serveur.");
        }
    };

    const MAX_FILES = 10;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            if (filesArray.length > MAX_FILES) {
                alert(`❌ Maximum ${MAX_FILES} images.`);
                return;
            }
            setSelectedFiles(filesArray);
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Sélectionnez au moins une image.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Connectez-vous pour envoyer des images.");
            return;
        }

        const uploadedPictures: Picture[] = [];

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append("images", file);

            try {
                const response = await fetch(
                    `https://faittourner-production.up.railway.app/api/upload/${id}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    uploadedPictures.push({
                        picture_id: data.picture_id || Date.now(),
                        picture_name: file.name,
                        path: data.path,
                        tags: null,
                    });
                } else {
                    alert(`❌ Erreur pour ${file.name} : ${data.error}`);
                }
            } catch (error) {
                alert(`Erreur serveur pour le fichier ${file.name}`);
            }
        }

        setPictures((prev) => [...prev, ...uploadedPictures]);
        setSelectedFiles([]);
    };

    // 🕒 Affichage loader global uniquement si le BOOK n'est pas prêt
    if (isLoadingBook) return <Loader text="Chargement du book" />;

    return (
        <div className="book-container">
            <h2>{book?.name}</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                <button
                    className="button"
                    onClick={handleUpload}
                >
                    Envoyer les images
                </button>
                {selectedFiles.length > 0 && (
                    <p>{selectedFiles.length} fichier(s) sélectionné(s)</p>
                )}
            </div>

            <button
                onClick={() => setIsGridView(!isGridView)}
                style={{
                    marginBottom: "10px",
                    padding: "6px 12px",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                {isGridView ? "🔍 Affichage normal" : "🖼️ Vue grille"}
            </button>

            <button
                onClick={() => setShowModal(true)}
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

            {showModal && (
                <div className="modal">
                    <h3>Inviter un utilisateur</h3>
                    <input
                        type="email"
                        placeholder="Email de l'utilisateur"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleShare}>Envoyer l'invitation</button>
                    <button onClick={() => setShowModal(false)}>Annuler</button>
                    {message && <p>{message}</p>}
                </div>
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
                                    src={`https://faittourner-production.up.railway.app${picture.path}`}
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
                                        objectFit: isGridView
                                            ? "cover"
                                            : "contain",
                                        cursor: "pointer",
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune image pour ce book.</p>
                )}
                {selectedImageIndex !== null && (
                    <ImageModal
                        images={pictures.map(
                            (p) =>
                                `https://faittourner-production.up.railway.app${p.path}`
                        )}
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
