// upload_service/src/controllers/book.controller.ts
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { createBook } from "../models/book.model";
import { getConnection } from "../db/dbconfig";

export const createBookController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.userId || req.user?.id;
    const { title } = req.body;

    if (!title || !userId) {
      res.status(400).json({ error: "Titre ou utilisateur manquant." });
      return;
    }

    const bookId = uuidv4();

    const connection = await getConnection();
    await createBook(connection, bookId, title, userId);

    res.status(201).json({ message: "Book créé avec succès", bookId });
  } catch (error) {
    console.error("❌ Erreur lors de la création du book :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
