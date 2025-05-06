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

// ✅ Supprime plusieurs images de la base
export const deletePicturesByIds = async (pictureIds: string[], userId: string, bookId: string, isOwner: boolean) => {
  const connection = await getConnection();

  // Si l'utilisateur est propriétaire : peut supprimer toutes les images du book
  // Sinon : ne peut supprimer que les siennes
  const query = isOwner
    ? `DELETE FROM picture WHERE id IN (?) AND book_id = ?`
    : `DELETE FROM picture WHERE id IN (?) AND book_id = ? AND user_id = ?`;

  const params = isOwner ? [pictureIds, bookId] : [pictureIds, bookId, userId];

  await connection.execute(query, params);
};

