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

export default function Book() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // Stocke le fichier sélectionné

    useEffect(() => {
        const fetchBook = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé, accès refusé.");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:4000/api/books/${id}`,
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
                console.log("📂 Book récupéré :", data);

                setBook(data.book); // ✅ Utilise data.book
                setPictures(data.pictures); // ✅ Utilise data.pictures
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
        if (!email) {
            setMessage("Veuillez entrer un email.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:4000/api/invite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email, bookId: book?.id }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Invitation envoyée avec succès !");
            } else {
                setMessage(
                    data.error || "❌ Erreur lors de l'envoi de l'invitation."
                );
            }
        } catch (error) {
            setMessage("❌ Erreur serveur.");
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Veuillez sélectionner une image.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté pour envoyer une image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch(
                `http://localhost:4000/api/upload/${id}`,
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
                alert("✅ Image envoyée avec succès !");
                setPictures([
                    ...pictures,
                    { name: selectedFile.name, path: data.path },
                ]); // Mise à jour des images affichées
            } else {
                alert(`❌ Erreur : ${data.error}`);
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'upload :", error);
            alert("Erreur serveur.");
        }
    };

    if (!book) return <h1>Chargement...</h1>;

    return (
        <div className="book-container">
            <h2>{book.name}</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button onClick={handleUpload}>Envoyer l'image</button>
            </div>

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
            {pictures.length > 0 ? (
                pictures.map((picture) => (
                    <div
                        key={picture.picture_id}
                        className="image-grid"
                    >
                        <div className="image-card">
                            <img
                                src={`http://localhost:4000/uploads/${id}/${picture.picture_name}`}
                                alt={picture.picture_name}
                                width={200}
                            />
                        </div>
                    </div>
                ))
            ) : (
                <p>Aucune image dans ce book.</p>
            )}
        </div>
    );
}
