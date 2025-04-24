import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  requestDeleteAccount,
  confirmDeleteAccount,
} from "../controllers/delete.controller";

export const deleteRouter = Router();

deleteRouter.post("/request-delete", verifyToken, requestDeleteAccount);
deleteRouter.get("/confirm-delete", confirmDeleteAccount);
