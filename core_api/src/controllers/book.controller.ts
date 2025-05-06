// 📚 Contrôleur pour la gestion des books

import { RequestHandler, Response } from "express";
import { AuthenticatedRequest } from "../types/UserRequest";
import { v4 as uuidv4 } from "uuid";
import { createBook, findBookById, getBookDetails, getAllBooks } from "../models/book.model";
import { getConnection } from "../db/dbconfig";

/**
 * 📚 Crée un nouveau book
 */
export const createBookController: RequestHandler = async (req, res) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user ?? {};
    const { title } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Utilisateur non connecté." });
      return;
    }

    if (!title) {
      res.status(400).json({ error: "Titre du book manquant." });
      return;
    }

    const bookId = uuidv4();
    await createBook(bookId, title, userId);

    res.status(201).json({ message: "Book créé avec succès", bookId });
  } catch (error) {
    console.error("❌ Erreur lors de la création du book :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

/**
 * 🧹 Supprime un book
 */
export const deleteBookController: RequestHandler = async (req, res) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user ?? {};
    const bookId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: "Utilisateur non connecté." });
      return;
    }

    const book = await findBookById(bookId);
    if (!book) {
      res.status(404).json({ error: "Book introuvable." });
      return;
    }

    if (String(book.owner_id) !== String(userId)) {
      res.status(403).json({ error: "Vous n'êtes pas l’auteur du book." });
      return;
    }

    const connection = await getConnection();
    await connection.execute("DELETE FROM book WHERE id = ?", [bookId]);

    res.json({ message: "Book supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du book :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

/**
 * 📚 Récupère tous les books de l'utilisateur connecté
 */
export const getAllBooksController: RequestHandler = async (req, res) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user ?? {};

    if (!userId) {
      res.status(401).json({ error: "Utilisateur non connecté." });
      return;
    }

    const books = await getAllBooks(userId);
    res.status(200).json({ books });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des books :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

/**
 * 🔍 Récupère les détails d'un book
 */
export const getBookController: RequestHandler = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await getBookDetails(bookId);

    if (!book) {
      res.status(404).json({ error: "Book non trouvé." });
      return;
    }

    res.json(book);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du book :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
