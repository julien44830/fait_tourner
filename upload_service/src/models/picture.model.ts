import { getConnection } from "../db/dbconfig";

/**
 * 💾 Insère une image dans la table `picture`
 * 
 * @param pictureId - UUID de l'image
 * @param originalName - Nom original du fichier
 * @param imagePath - Chemin du fichier
 * @param bookId - UUID du book associé
 * @param userId - UUID de l'utilisateur uploader
 * @param filterId - (optionnel) UUID du filtre appliqué
 * @param createAt - (optionnel) Date de création manuelle
 */
export const insertPicture = async (
  pictureId: string,
  originalName: string,
  imagePath: string,
  bookId: string,
  userId: string,
  filterId: string | null = null,
  createAt: Date | null = null
): Promise<void> => {
  const connection = await getConnection();

  await connection.execute(
    `INSERT INTO picture (id, name, path, book_id, user_id, is_private, filter, create_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pictureId,
      originalName,
      imagePath,
      bookId,
      userId,
      false, // Par défaut, is_private est FALSE
      filterId,
      createAt,
    ]
  );

  connection.release(); // 🔥 Toujours libérer la connexion
};
