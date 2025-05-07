import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { handleUpload } from "../controllers/upload.controller";

export const uploadRouter = Router();

uploadRouter.post(
  "/upload/:bookId",
  verifyToken,
  handleUpload
);
