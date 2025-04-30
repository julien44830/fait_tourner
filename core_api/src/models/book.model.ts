import { getConnection } from "../db/dbconfig";

// 📌 Vérifie si un book existe par ID UUID
export const findBookById = async (bookId: string) => {
  const connection = await getConnection();
  const [books]: any = await connection.execute(
    "SELECT owner_id FROM book WHERE id = ?",
    [bookId]
  );
  return books[0];
};

// 📌 Ajoute un utilisateur à un book
export const addUserToBook = async (userId: string, bookId: string) => {
  const connection = await getConnection();
  const [result]: any = await connection.execute(
    "INSERT INTO users_book (user_id, book_id, role) VALUES (?, ?, 'viewer')",
    [userId, bookId]
  );

  return result.affectedRows > 0;
};



// 📌 Crée un nouveau book
export const createBook = async (bookId: string, title: string, owner_id: string) => {
  const connection = await getConnection();
  const [result]: any = await connection.execute(
    "INSERT INTO book (id, name, owner_id) VALUES (?, ?, ?)",
    [bookId, title, owner_id]
  );
  await connection.execute(
    "INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES (?, ?, ?, ?)",
    [owner_id, bookId, true, "owner"]
  );
  return result;
};

// 📌 Récupère les infos détaillées d’un book
export const getBookDetails = async (bookId: string) => {
  const connection = await getConnection();
  const [book]: any = await connection.execute(
    `SELECT b.*, u.name as authorName
     FROM book b
     JOIN user u ON b.owner_id = u.id
     WHERE b.id = ?`,
    [bookId]
  );

  const [pictures]: any = await connection.execute(
    `SELECT p.id AS picture_id, p.name AS picture_name, p.path,
            JSON_ARRAYAGG(t.name) AS tags
     FROM picture p
     LEFT JOIN picture_tag pt ON p.id = pt.picture_id
     LEFT JOIN tag t ON pt.tag_id = t.id
     WHERE p.book_id = ?
     GROUP BY p.id`,
    [bookId]
  );
  return {
    ...book[0],
    pictures,
  };
};

export const getAllBooks = async (userId: string) => {
  const connection = await getConnection();
  const [books]: any = await connection.execute(
    `
    SELECT b.* 
    FROM book b
    JOIN users_book ub ON ub.book_id = b.id
    WHERE ub.user_id = ?
    `,
    [userId]
  );
  return books;
};
