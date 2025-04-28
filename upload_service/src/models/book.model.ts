export const createBook = async (
  connection: any,
  bookId: string,
  title: string,
  userId: string
): Promise<void> => {
  await connection.execute(
    "INSERT INTO book (id, name, owner_id) VALUES (?, ?, ?)",
    [bookId, title, userId]
  );

  await connection.execute(
    "INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES (?, ?, 1, 'owner')",
    [userId, bookId]
  );
};
