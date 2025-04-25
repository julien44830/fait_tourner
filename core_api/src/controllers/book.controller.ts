import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { createBook, findBookById, getBookDetails, getAllBooks } from "../models/book.model";
import { findUserById, isUserInBook } from "../models/user.model";
import { getConnection } from "../db/dbconfig";



// 📚 Crée un nouveau book
export const createBookController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.userId || (req.user as unknown as { userId: string })?.userId;
    const { title } = req.body;

    if (!title || !userId) {
      res.status(400).json({ error: "Titre ou utilisateur manquant." });
      return
    }

    const bookId = uuidv4();
    await createBook(bookId, title, userId);

    res.status(201).json({ message: "Book créé avec succès", bookId });
  } catch (error) {
    console.error("❌ Erreur lors de la création du book :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// 🧹 Supprime un book (uniquement si l'utilisateur est l’auteur)
export const deleteBookController = async (req: Request, res: Response): Promise<void> => {
  try {

    const bookId = req.params.id;
    const userId = req.body.userId || (req.user as { id: string })?.id;

    const book = await findBookById(bookId);

    if (!book) {
      res.status(404).json({ error: "Book introuvable." });
      return
    }

    if (book.owner_id !== userId) {
      res.status(403).json({ error: "Vous n'êtes pas l’auteur du book." });
      return
    }

    const connection = await getConnection();
    await connection.execute("DELETE FROM book WHERE id = ?", [bookId]);

    res.json({ message: "Book supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du book :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

//réccupérer tous les books

export const getAllBooksController = async (req: Request, res: Response): Promise<void> => {
  try {
    const [books] = await getAllBooks()
    res.status(200).json(books);
  } catch (error) {
    console.error("❌ Erreur récupération books :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔍 Détail d’un book
export const getBookController = async (req: Request, res: Response): Promise<void> => {
  const bookId = req.params.id;
  const book = await getBookDetails(bookId);

  try {

    if (!book) {
      res.status(404).json({ error: "Book non trouvé." });
      return
    }

    res.json(book);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du book :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
