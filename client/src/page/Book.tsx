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
    resized_url: string; // ✅ ici
}

type PictureWithResizedUrl = Picture & { resized_url: string };

export default function Book() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [pictures, setPictures] = useState<PictureWithResizedUrl[]>([]);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isGridView, setIsGridView] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        const fetchBook = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé, accès refusé.");
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
                setPictures(data.pictures || []);
            } catch (error) {
                console.error(
                    "❌ Erreur lors de la récupération du book :",
                    error
                );
            }
        };

        if (id) fetchBook();
    }, [id]);

    // ✅ Gère l'envoi d'invitation
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
                    body: JSON.stringify({ email, bookId: book?.id }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Invitation envoyée avec succès !");
                // ⏳ Attente de 5 secondes avant de réinitialiser la modale

                console.log("%c⧭", "color: #ffa280", "mail envoyer");
                setTimeout(() => {
                    setEmail(""); // Réinitialise le champ email
                    setMessage(""); // Supprime le message
                    setShowModal(false); // Ferme la modale
                }, 2500);
            } else {
                setMessage(
                    data.error || "❌ Erreur lors de l'envoi de l'invitation."
                );
            }
        } catch (error) {
            setMessage("❌ Erreur serveur.");
        }
    };

    const MAX_FILES = 10;

    // 📦 Gère la sélection des fichiers
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            if (filesArray.length > MAX_FILES) {
                alert(
                    `❌ Vous ne pouvez sélectionner que ${MAX_FILES} images maximum.`
                );
                return;
            }

            setSelectedFiles(filesArray);
        }
    };

    // 🚀 Gère l'upload de toutes les images
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Veuillez sélectionner au moins une image.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté pour envoyer des images.");
            return;
        }

        const uploadedPictures: {
            picture_id: any;
            picture_name: string;
            path: any;
            tags: null;
            resized_url: string;
        }[] = [];

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append("images", file); // 👈 côté backend, on attend "image" même pour plusieurs fichiers

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
                        resized_url: `https://faittourner-production.up.railway.app/api/image/${id}/${file.name}`,
                    });
                } else {
                    alert(`❌ Erreur pour ${file.name} : ${data.error}`);
                }
            } catch (error) {
                console.error(`❌ Erreur serveur pour ${file.name}`, error);
                alert(`Erreur serveur pour le fichier ${file.name}`);
            }
        }

        // 🖼️ Met à jour la liste des images visibles
        setPictures((prev) => [...prev, ...uploadedPictures]);
        setSelectedFiles([]); // 🔄 Reset la sélection après upload
    };

    if (!book) return <h1>Chargement...</h1>;

    const getImageSize = () => {
        const width = window.innerWidth;
        if (width < 600) return 300;
        if (width < 1024) return 600;
        return 1000;
    };

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

                {/* Affichage UX */}
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

            {/* ✅ Bouton pour ouvrir la modal */}
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

            {/* ✅ Modal d'invitation */}
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

            {/* ✅ Affichage des images */}
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
                                aspectRatio: isGridView ? "1 / 1" : "auto", // ✅ carré en grid
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
