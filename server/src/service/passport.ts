import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

// @ts-ignore
const { Strategy: GoogleTokenStrategy } = require("passport-google-token");

// --- Stratégie avec redirection
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUserFromGoogle(profile);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// --- Stratégie avec token
passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    async (accessToken: any, refreshToken: any, profile: Profile, done: (err: null, user: User) => void) => {
      const user = await findOrCreateUserFromGoogle(profile);
      return done(null, user);
    }
  )
);

interface User {
  id: string;
  name: string;
  email: string;
}

import { getConnection } from "../dbconfig"; // adapte le chemin selon ton projet

async function findOrCreateUserFromGoogle(profile: Profile): Promise<User> {
  const id = profile.id;
  const email = profile.emails?.[0]?.value || "no-email@example.com";
  const name = profile.displayName;

  const connection = await getConnection();

  // 🔍 Vérifie si l'utilisateur existe déjà en base
  const [rows]: any = await connection.execute(
    "SELECT * FROM user WHERE id = ?",
    [id]
  );

  if (rows.length > 0) {
    return rows[0]; // ✅ Utilisateur trouvé
  }

  // 🧪 Création de l'utilisateur
  await connection.execute(
    "INSERT INTO user (id, email, name, password) VALUES (?, ?, ?, ?)",
    [id, email, name, "google"] // on met un mot de passe factice pour les comptes Google
  );

  return {
    id,
    email,
    name,
  };
}

