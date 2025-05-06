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
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token manquant ou invalide." });
    return;
  }

  const token = authHeader.split(" ")[1];
  const SECRET_KEY = process.env.SECRET_KEY as string;

  if (!SECRET_KEY) {
    console.error("❌ SECRET_KEY est manquant dans les variables d'environnement.");
    res.status(500).json({ error: "Erreur de configuration du serveur." });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as AuthenticatedUser;

    if (!decoded.userId) {
      res.status(401).json({ error: "Token invalide : userId manquant." });
      return;
    }

    // ✅ Cast correct uniquement ici
    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("❌ Token invalide ou expiré :", err);
    res.status(403).json({ error: "Token invalide ou expiré." });
  }
};
