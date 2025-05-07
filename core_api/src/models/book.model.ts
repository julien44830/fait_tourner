import { getConnection } from "../db/dbconfig";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Interfaces utiles
interface BookRow extends RowDataPacket {
  id: string;
  name: string;
  owner_id: string;
}

interface PictureRow extends RowDataPacket {
  picture_id: string;
  picture_name: string;
  path: string;
  tags: string | null;
}

// 📌 Vérifie si un book existe par ID UUID
export const findBookById = async (bookId: string): Promise<BookRow | null> => {
  const connection = await getConnection();
  const [rows] = await connection.execute<RowDataPacket[]>(
    "SELECT owner_id FROM book WHERE id = ?",
    [bookId]
  );
  return (rows as BookRow[])[0] || null;
};

// 📌 Ajoute un utilisateur à un book
export const addUserToBook = async (
  userId: string,
  bookId: string
): Promise<boolean> => {
  const connection = await getConnection();
  const [result] = await connection.execute<ResultSetHeader>(
    "INSERT INTO users_book (user_id, book_id, role) VALUES (?, ?, 'viewer')",
    [userId, bookId]
  );
  return result.affectedRows > 0;
};

// 📌 Crée un nouveau book
export const createBook = async (
  bookId: string,
  title: string,
  owner_id: string
): Promise<void> => {
  const connection = await getConnection();

  await connection.execute(
    "INSERT INTO book (id, name, owner_id) VALUES (?, ?, ?)",
    [bookId, title, owner_id]
  );

  await connection.execute(
    "INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES (?, ?, ?, ?)",
    [owner_id, bookId, true, "owner"]
  );
};

// 📌 Récupère les infos détaillées d’un book
export const getBookDetails = async (bookId: string): Promise<{
  id: string;
  name: string;
  owner_id: string;
  authorName: string;
  pictures: PictureRow[];
} | null> => {
  const connection = await getConnection();

  const [bookRows] = await connection.execute<RowDataPacket[]>(
    `
    SELECT b.*, u.name as authorName
    FROM book b
    JOIN user u ON b.owner_id = u.id
    WHERE b.id = ?
    `,
    [bookId]
  );

  if (!bookRows.length) return null;

  const [pictures] = await connection.execute<RowDataPacket[]>(
    `
    SELECT p.id AS picture_id, p.name AS picture_name, p.path,
           JSON_ARRAYAGG(t.name) AS tags
    FROM picture p
    LEFT JOIN picture_tag pt ON p.id = pt.picture_id
    LEFT JOIN tag t ON pt.tag_id = t.id
    WHERE p.book_id = ?
    GROUP BY p.id
    `,
    [bookId]
  );

  return {
    ...(bookRows[0] as BookRow & { authorName: string }),
    pictures: pictures as PictureRow[],
  };
};

// 📌 Récupère tous les books liés à un utilisateur
export const getAllBooks = async (userId: string): Promise<BookRow[]> => {
  const connection = await getConnection();
  const [books] = await connection.execute<RowDataPacket[]>(
    `
    SELECT b.*
    FROM book b
    JOIN users_book ub ON ub.book_id = b.id
    WHERE ub.user_id = ?
    `,
    [userId]
  );

  return books as BookRow[];
};
