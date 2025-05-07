// ✅ Nouveau service : deletePicturesWithFiles
// core_api/src/services/deletePicturesWithFiles.ts
import { deletePicturesByIds } from "../models/picture.model";
import { findBookById } from "../models/book.model";
import { deleteImagesOnUploadService } from "./deleteImagesOnUploadService";

interface DeletePicturesOptions {
  userId: string;
  bookId: string;
  pictureIds: string[];
  imagePaths: string[];
}

export const deletePicturesWithFiles = async ({
  userId,
  bookId,
  pictureIds,
  imagePaths,
}: DeletePicturesOptions): Promise<void> => {
  // 🔎 Vérifie que le book existe
  const book = await findBookById(bookId);
  if (!book) {
    throw new Error("Book introuvable.");
  }

  // 👤 Vérifie si l'utilisateur est le propriétaire
  const isOwner = book.owner_id === userId;

  // 🗑️ Supprime les fichiers côté upload_service
  const uploadResponse = await deleteImagesOnUploadService(bookId, imagePaths);
  if (!uploadResponse.success) {
    throw new Error("Erreur upload_service lors de la suppression des images.");
  }

  // 🧼 Supprime les entrées de la base
  await deletePicturesByIds(pictureIds, userId, bookId, isOwner);
};
