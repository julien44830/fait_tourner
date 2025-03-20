import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Assure-toi d'importer React

interface Book {
    id: number;
    name: string;
}

export default function Home() {
    // ✅ Stocker les books et le nom de l'utilisateur dans des états
    const [books, setBooks] = useState<Book[]>([]);
    const [name, setName] = useState<string | null>("");

    useEffect(() => {
        const fetchBooks = async () => {
            const token = localStorage.getItem("token");
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
                            Authorization: `Bearer ${token}`, // 🔥 Ajout du token
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }

                const data = await response.json();
                setBooks(data);
                setName(data.name);
            } catch (error) {
                console.error(
                    "❌ Erreur lors de la récupération des books :",
                    error
                );
            }
        };

        fetchBooks();
    }, []);

    // ✅ Gestion de l'affichage
    if (!books) return <p>Chargement...</p>;

    return (
        <div>
            <h2>Bonjour, {name ? name : "Utilisateur"}</h2>
            <br />
            <button>Créer un nouveau book</button>
            <br />
            <h3>📚 Mes Books :</h3>
            {books.length > 0 ? (
                books.map((b) => (
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
