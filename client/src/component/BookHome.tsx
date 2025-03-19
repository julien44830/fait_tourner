import React from "react";
import { NavLink } from "react-router-dom"; // Assure-toi d'importer React

interface Book {
    id: number;
    name: string;
}

interface BookHomeProps {
    book: Book;
}

const BookHome: React.FC<BookHomeProps> = ({ book }) => {
    return (
        <NavLink to={`/book/${book[0].id}`}>
            <button>
                <p>{book[0].name}</p>
            </button>
        </NavLink>
    );
};

export default BookHome;
