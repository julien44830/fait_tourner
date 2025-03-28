"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
// @ts-ignore
const { Strategy: GoogleTokenStrategy } = require("passport-google-token");
// --- Stratégie avec redirection
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateUserFromGoogle(profile);
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
}));
// --- Stratégie avec token
passport_1.default.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    const user = await findOrCreateUserFromGoogle(profile);
    return done(null, user);
}));
async function findOrCreateUserFromGoogle(profile) {
    return {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value || "no-email@example.com",
    };
}
