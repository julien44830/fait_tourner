import { Router } from "express";
import { inviteToBook } from "../controllers/share.controller";
import { verifyToken } from "../middlewares/auth.middleware";

export const shareRouter = Router();

shareRouter.post("/invite", verifyToken, inviteToBook);
