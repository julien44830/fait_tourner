import { getConnection } from "../db/dbconfig";

// 📌 Trouve un utilisateur par email
export const findUserByEmail = async (email: string) => {
  const connection = await getConnection();
  const [users]: any = await connection.execute(
    "SELECT id, name, password, email FROM user WHERE email = ?",
    [email]
  );
  return users[0]; // undefined si aucun résultat
};

// 📌 Crée un nouvel utilisateur avec un UUID
export const createUser = async (id: string, name: string, email: string, hashedPassword: string) => {
  const connection = await getConnection();
  const [result]: any = await connection.execute(
    "INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)",
    [id, name, email, hashedPassword]
  );
  return result;
};

// 📌 Récupère les infos d’un utilisateur par son ID UUID
export const findUserById = async (id: string) => {
  const connection = await getConnection();
  const [users]: any = await connection.execute(
    "SELECT id, name, email FROM user WHERE id = ?",
    [id]
  );
  return users[0];
};

// 📌 Vérifie si un utilisateur appartient à un book (utile pour contrôle d’accès)
export const isUserInBook = async (userId: string, bookId: string) => {
  const connection = await getConnection();
  const [result]: any = await connection.execute(
    "SELECT * FROM users_book WHERE user_id = ? AND book_id = ?",
    [userId, bookId]
  );
  return result.length > 0;
};
