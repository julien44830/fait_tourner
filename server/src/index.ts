// src/index.ts
import dotenv from "dotenv";
// import "./types/express";
dotenv.config();

import app from "./app";
import { getConnection } from "./db/dbconfig";
import "./service/passport"; // configure Passport

// ✅ Vérification des variables d'environnement
const requiredEnvs = ["SECRET_KEY", "PORT", "FRONT_BASE_URL"];
requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Variable d'environnement manquante : ${key}`);
  }
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await getConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Serveur start ✅ sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("⛔ Le serveur ne démarre pas à cause d'une erreur DB.", err);
  }
};

startServer();
