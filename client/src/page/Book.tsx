import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Book {
    id: string;
    name: string;
}

export default function Book() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    useEffect(() => {
        const fetchBook = async () => {
            const token = localStorage.getItem("token"); // 🔥 Récupère le token
            if (!token) {
                console.error("❌ Aucun token trouvé, accès refusé.");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:4000/api/books/${id}`, // Utilise l'ID de l'URL
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`, // 🔥 Ajoute le token d'authentification
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }

                const data = await response.json();
                setBook(data);
            } catch (error) {
                console.error(
                    "❌ Erreur lors de la récupération du book :",
                    error
                );
            }
        };

        if (id) fetchBook(); // ⚠️ Vérifie que `id` est défini avant d'appeler l'API
    }, [id]); // ⚡ Re-fetch si `id` change
    console.log("%c⧭", "color: #e50000", book);

    const handleShare = () => {
        console.log("ici on partage le books");
    };

    if (book === null) return <h1>Vous n'avez aucun book actuellement</h1>;
    if (!book) return <h1>Chargement...</h1>;
    return (
        <div>
            <button
                onClick={handleShare}
                style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                partager le book
            </button>
            {book.map((picture) => (
                <div key={picture.picture_id}>
                    <img
                        src={picture.path}
                        alt={picture.picture_name}
                        width={200}
                    />
                    <p>Nom : {picture.picture_name}</p>
                    <p>Tags : {picture.tags || "Aucun tag"}</p>
                    <p>chemin : {picture.path}</p>
                </div>
            ))}
        </div>
    );
}
