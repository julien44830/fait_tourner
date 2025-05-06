import { Router } from "express";
import { deletePicturesController } from "../controllers/picture.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/delete", verifyToken, deletePicturesController);

export default router;
