import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, AuthenticatedUser } from "../types/UserRequest";


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



/**
 * Middleware pour vérifier le token JWT
 * et injecter l'utilisateur dans la requête.
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Token manquant ou invalide." });
      return
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser;

      if (!decoded.userId) {
        res.status(401).json({ error: "Token invalide : userId manquant." });
        return
      }

      // Cast correct ici uniquement
      (req as AuthenticatedRequest).user = {
        userId: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (err) {
      res.status(403).json({ error: "Token invalide ou expiré." });
      return
    }
  };
}
