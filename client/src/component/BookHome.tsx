export default function BookHome() {
    const [books, setBooks] = useState([]);
    return (
        <div>
            <p>{books.name}</p>
        </div>
    );
}
