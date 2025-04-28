import { getConnection } from "../db/dbconfig";

export const hasAccessToBook = async (userId: string, bookId: string) => {
  const connection = await getConnection();
  const [rows]: any = await connection.execute(
    `SELECT * FROM users_book WHERE user_id = ? AND book_id = ?`,
    [userId, bookId]
  );
  return rows.length > 0;
};

export const insertPicture = async (
  id: string,
  name: string,
  path: string,
  bookId: string,
  userId: string
) => {
  const connection = await getConnection();
  await connection.execute(
    `INSERT INTO picture (id, name, path, book_id, user_id, is_private) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, path, bookId, userId, false]
  );
};
