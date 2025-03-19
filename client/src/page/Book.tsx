export default function Book() {
    useEffect(() => {
        fetch(`http://localhost:4000/api/books/1`) // Appel API Backend
            .then((response) => response.json())
            .then((data) => setBook(data))
            .catch((error) =>
                console.error("Erreur lors de la récupération du book :", error)
            );
    }, []);

    return (
        <div>
            <p>je suis le book des images</p>
            <img
                src=""
                alt=""
            />
            <img
                src=""
                alt=""
            />
            <img
                src=""
                alt=""
            />
        </div>
    );
}
