import { useEffect, useState } from "react";
import BookHome from "../component/BookHome";

interface Book {
    id: number;
    name: string;
}

export default function Home() {
    // ✅ useState doit être dans le composant
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        fetch(`http://localhost:4000/api/books`) // Appel API Backend
            .then((response) => response.json())
            .then((data) => setBook(data))
            .catch((error) =>
                console.error("Erreur lors de la récupération du book :", error)
            );
    }, []);

    if (!book) return <h1>Chargement...</h1>;

    return (
        <div>
            <h2>coucou</h2>
            <BookHome book={book} />
        </div>
    );
}
