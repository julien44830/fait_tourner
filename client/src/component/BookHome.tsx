import React from "react"; // Assure-toi d'importer React

interface Book {
    id: number;
    name: string;
}

interface BookHomeProps {
    book: Book;
}

const BookHome: React.FC<BookHomeProps> = ({ book }) => {
    console.log("%c⧭", "color: #00e600", book.name);

    return (
        <button>
            <p>{book[0].name}</p>
        </button>
    );
};

export default BookHome;
