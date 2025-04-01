import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

type PictureWithResizedUrl = Picture & { resized_url: string };

// 🔧 Fonction utilitaire pour générer l'URL redimensionnée
const getResizedImageUrl = (bookId: string, fileName: string) =>
    `https://faittourner-production.up.railway.app/api/image/${bookId}/${fileName}`;

export default function Book() {
    const { id: bookId } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [pictures, setPictures] = useState<PictureWithResizedUrl[]>([]);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isGridView, setIsGridView] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // 📥 Chargement du book et des images
    useEffect(() => {
        const fetchBook = async () => {
            const token = localStorage.getItem("token");
            if (!token || !bookId) return;

            try {
                const response = await fetch(
                    `https://faittourner-production.up.railway.app/api/book/${bookId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();

                setBook(data.book);
                setPictures(
                    (data.pictures || []).map((pic: Picture) => ({
                        ...pic,
                        resized_url: getResizedImageUrl(
                            bookId,
                            pic.picture_name
                        ),
                    }))
                );
            } catch (error) {
                console.error(
                    "❌ Erreur lors de la récupération du book :",
                    error
                );
            }
        };

        fetchBook();
    }, [bookId]);

    // 📤 Envoi d'invitation par email
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
            setMessage(
                response.ok
                    ? "✅ Invitation envoyée avec succès !"
                    : data.error || "❌ Erreur lors de l'envoi de l'invitation."
            );

            if (response.ok) {
                setTimeout(() => {
                    setEmail("");
                    setMessage("");
                    setShowModal(false);
                }, 2500);
            }
        } catch {
            setMessage("❌ Erreur serveur.");
        }
    };

    // 📦 Gestion sélection fichiers
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const filesArray = Array.from(files);
        if (filesArray.length > 10) {
            alert("❌ Vous ne pouvez sélectionner que 10 images maximum.");
            return;
        }

        setSelectedFiles(filesArray);
    };

    // 🚀 Upload des images
    const handleUpload = async () => {
        if (!book?.id || selectedFiles.length === 0) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté.");
            return;
        }

        const uploadedPictures: PictureWithResizedUrl[] = [];

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append("images", file);

            try {
                const res = await fetch(
                    `https://faittourner-production.up.railway.app/api/upload/${book.id}`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    uploadedPictures.push({
                        picture_id: data.picture_id || Date.now(),
                        picture_name: file.name,
                        path: data.path,
                        tags: null,
                        resized_url: getResizedImageUrl(book.id, file.name),
                    });
                } else {
                    alert(`❌ Erreur pour ${file.name} : ${data.error}`);
                }
            } catch (err) {
                console.error("❌ Upload error :", err);
            }
        }

        setPictures((prev) => [...prev, ...uploadedPictures]);
        setSelectedFiles([]);
    };

    const getImageSize = () => {
        const width = window.innerWidth;
        if (width < 600) return 300;
        if (width < 1024) return 600;
        return 1000;
    };

    if (!book) return <h1>Chargement...</h1>;

    return (
        <div className="book-container">
            <h2>{book.name}</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                <button onClick={handleUpload}>Envoyer les images</button>
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
                {pictures.map((picture) => (
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
                                src={`${
                                    picture.resized_url
                                }?w=${getImageSize()}`}
                                alt={picture.picture_name}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <p style={{ marginTop: "5px", textAlign: "center" }}>
                            {picture.picture_name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
