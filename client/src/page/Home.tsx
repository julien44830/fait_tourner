import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Assure-toi d'importer React
import BookHome from "../component/BookHome";

interface Book {
    id: number;
    name: string;
}

export default function Home() {
    // ✅ useState doit être dans le composant
    const [book, setBooks] = useState<Book[]>([]);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        setName(localStorage.getItem("name"));
        console.log("Token stocké :", localStorage.getItem("token"));

        const fetchBooks = async () => {
            const token = localStorage.getItem("token"); // Vérifie que le token est bien stocké
            if (!token) {
                console.error("❌ Aucun token trouvé, accès refusé.");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:4000/api/books",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`, // Ajout du token
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log("%c⧭", "color: #0088cc", data);
                setBooks(data);
            } catch (error) {
                console.error(
                    "❌ Erreur lors de la récupération des books :",
                    error
                );
            }
        };

        fetchBooks();
    }, []);

    if (!book) return <h1>Chargement...</h1>;
    console.log("%c⧭", "color: #d90000", book);

    return (
        <div>
            <h2>Bonjour, {localStorage.getItem("name")}</h2>
            <br />
            <button>Créer un nouveau book</button>
            <br />
            <h3>📚 Mes Books :</h3>
            {Array.isArray(book) && book.length > 0 ? (
                book.map((b) => (
                    <NavLink
                        key={b.id}
                        to={`/book/${b.id}`}
                    >
                        {b.name}
                    </NavLink>
                ))
            ) : (
                <p>❌ Vous n'avez aucun book actuellement</p>
            )}
        </div>
    );
}
