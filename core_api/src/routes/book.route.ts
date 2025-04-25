import { Router } from "express";
import {
  createBookController,
  deleteBookController,
  getBookController,
  getAllBooksController
} from "../controllers/book.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const bookRouter = Router();

bookRouter.post("/", authMiddleware, createBookController);
bookRouter.get("/", authMiddleware, getAllBooksController);
bookRouter.get("/:id", authMiddleware, getBookController);
bookRouter.delete("/:id", authMiddleware, deleteBookController);
