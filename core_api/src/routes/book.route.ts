import { Router, RequestHandler } from "express";
import {
  createBookController,
  deleteBookController,
  getBookController,
  getAllBooksController
} from "../controllers/book.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { verifyToken } from "../middlewares/auth.middleware";


export const bookRouter = Router();

bookRouter.post("/", verifyToken, authMiddleware, createBookController as RequestHandler);
bookRouter.get("/", verifyToken, authMiddleware, getAllBooksController as RequestHandler);
bookRouter.get("/:id", verifyToken, authMiddleware, getBookController as RequestHandler);
bookRouter.delete("/:id", verifyToken, authMiddleware, deleteBookController as RequestHandler);

