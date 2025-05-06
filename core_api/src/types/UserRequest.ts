import { Request } from "express";

// ✅ Définir l'interface du User
export interface AuthenticatedUser {
  userId: string;
  email?: string;
}

// ✅ Définir une Request avec utilisateur authentifié
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
