import { getConnection } from "../db/dbconfig";

// Vérifie si l'utilisateur a accès à un book
export const checkBookAccess = async (userId: string, bookId: string): Promise<boolean> => {
  const connection = await getConnection();
  const [result]: any = await connection.execute(
    "SELECT * FROM users_book WHERE user_id = ? AND book_id = ?",
    [userId, bookId]
  );
  return result.length > 0;
};

// Insère une image dans la table `picture`
export const insertPicture = async (
  id: string,
  name: string,
  path: string,
  bookId: string,
  userId: string,
  isPrivate: boolean = false
): Promise<void> => {
  const connection = await getConnection();
  await connection.execute(
    `INSERT INTO picture (id, name, path, book_id, user_id, is_private)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, path, bookId, userId, isPrivate]
  );
};
