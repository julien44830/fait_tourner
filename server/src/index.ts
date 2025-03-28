import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

console.log("🚨 Démarrage de l'application Express");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
console.log("🌍 PORT reçu via process.env:", process.env.PORT);


app.get("/", (_req, res) => {
  console.log("✅ Route GET / appelée");
  res.json({ message: "Hello depuis Railway ✅" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur Express écoute sur le port ${PORT}`);
});
