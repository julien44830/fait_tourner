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
        fetch(`http://localhost:4000/api/books/${id}`) // Appel API Backend
            .then((response) => response.json())
            .then((data) => setBook(data))
            .catch((error) =>
                console.error("Erreur lors de la récupération du book :", error)
            );
    }, []);

    console.log("%c⧭", "color: #e50000", book);

    if (!book) return <h1>Chargement...</h1>;
    return (
        <div>
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
