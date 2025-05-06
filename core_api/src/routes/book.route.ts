import { Router, RequestHandler } from "express";
import {
  createBookController,
  deleteBookController,
  getBookController,
  getAllBooksController
} from "../controllers/book.controller";
// import { authMiddleware } from "../middlewares/auth.middleware";
import { verifyToken } from "../middlewares/auth.middleware";


export const bookRouter = Router();

bookRouter.post("/", verifyToken, createBookController);
bookRouter.get("/", verifyToken, getAllBooksController); // ✅ plus de cast
bookRouter.get("/:id", verifyToken, getBookController);  // ✅
bookRouter.delete("/:id", verifyToken, deleteBookController); // ✅


