import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../component/Loader";
import ImageModal from "../component/ImageModal";

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
    const [uploadMessage, setUploadMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isGridView, setIsGridView] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null
    );
    const [showUploadModal, setShowUploadModal] = useState(false);

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

                setTimeout(() => {
                    setIsLoadingPictures(false);
                }, 2000);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération :", error);
                setIsLoadingPictures(false);
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

    const handleRemoveSelectedFile = (indexToRemove: number) => {
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleUpload = async () => {
        setUploadMessage("");

        if (selectedFiles.length === 0) {
            setUploadMessage("Veuillez sélectionner au moins une image.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setUploadMessage(
                "Vous devez être connecté pour envoyer des images."
            );
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

                if (response.ok && data.path) {
                    uploadedPictures.push({
                        picture_id: data.picture_id || Date.now(),
                        picture_name: file.name,
                        path: data.path,
                        tags: null,
                    });
                } else {
                    setUploadMessage(
                        (prev) =>
                            prev +
                            `\n❌ Erreur pour ${file.name} : ${data.error}`
                    );
                }
            } catch (error) {
                setUploadMessage(
                    (prev) =>
                        prev +
                        `\n❌ Erreur serveur pour le fichier ${file.name}`
                );
            }
        }

        setPictures((prev) => [...prev, ...uploadedPictures]);
        setSelectedFiles([]);
        setShowUploadModal(false);
        await refreshBookPictures();
    };
    const refreshBookPictures = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await fetch(
                `https://faittourner-production.up.railway.app/api/book/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setPictures(data.pictures || []);
        } catch (err) {
            console.error("Erreur lors du rafraîchissement des images :", err);
        }
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
            </div>

            {showUploadModal && (
                <div className="modal-overlay">
                    <div className="modal ">
                        <h3>Ajouter des images</h3>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        {selectedFiles.length > 0 && (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        marginTop: "10px",
                                    }}
                                >
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            style={{ position: "relative" }}
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`preview-${index}`}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "6px",
                                                    border: "1px solid #ccc",
                                                }}
                                            />
                                            <button
                                                onClick={() =>
                                                    handleRemoveSelectedFile(
                                                        index
                                                    )
                                                }
                                                style={{
                                                    position: "absolute",
                                                    top: "-8px",
                                                    right: "-8px",
                                                    backgroundColor: "#ff4d4d",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    color: "white",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {uploadMessage && (
                            <p style={{ marginTop: "10px", color: "#c00" }}>
                                {uploadMessage}
                            </p>
                        )}
                        <div className="modal-buttons">
                            <button
                                onClick={handleUpload}
                                className="create-btn"
                            >
                                Envoyer
                            </button>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFiles([]);
                                }}
                                className="cancel-btn"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Inviter un utilisateur</h3>
                        <input
                            type="email"
                            placeholder="Email de l'utilisateur"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {message && (
                            <p style={{ marginTop: "10px" }}>{message}</p>
                        )}
                        <div className="modal-buttons">
                            <button
                                className="create-btn"
                                onClick={handleShare}
                            >
                                Envoyer l'invitation
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
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
