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

async function findOrCreateUserFromGoogle(profile: Profile): Promise<User> {
  return {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails?.[0]?.value || "no-email@example.com",
  };
}
