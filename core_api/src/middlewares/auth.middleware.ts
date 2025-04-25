import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const SECRET_KEY = process.env.SECRET_KEY as string;
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(403).json({ error: "Accès refusé. Token manquant." });
    return
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide." });
  }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const SECRET_KEY = process.env.SECRET_KEY as string;
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Accès refusé, token manquant" });
    return
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY!) as { userId: string, email: string };
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (err) {
    console.error("❌ Token invalide :", err);
    res.status(403).json({ error: "Token invalide" });
  }
};
