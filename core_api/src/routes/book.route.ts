import { Router } from "express";
import {
  createBookController,
  deleteBookController,
  getBookController,
  getAllBooksController
} from "../controllers/book.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { verifyToken } from "../middlewares/auth.middleware";


export const bookRouter = Router();

bookRouter.post("/", verifyToken, authMiddleware, createBookController);
bookRouter.get("/", verifyToken, authMiddleware, getAllBooksController);
bookRouter.get("/:id", verifyToken, authMiddleware, getBookController);
bookRouter.delete("/:id", verifyToken, authMiddleware, deleteBookController);

