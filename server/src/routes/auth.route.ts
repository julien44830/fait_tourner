import { Router } from "express";
import { login, register, loginWithGoogle } from "../controllers/auth.controller";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const authRouter = Router();

// Route pour la connexion
authRouter.post("/login", login);

// Route pour l’inscription
authRouter.post("/register", register);

// 🔐 Google Token route
interface GoogleTokenRequest extends Request {
  body: {
    token: string;
  };
}

authRouter.post(
  "/auth/google/token",
  (req: GoogleTokenRequest, res: Response, next: NextFunction) => {
    req.query.access_token = req.body.token;
    next();
  },
  passport.authenticate("google-token", { session: false }),
  loginWithGoogle
);
