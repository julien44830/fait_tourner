import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

console.log('🚨🟢 Ceci est le fichier actif🚨');

console.log("🚨 Démarrage de l'application Express");

app.get("/", (_req, res) => {
  console.log("✅ Route GET / appelée");
  res.json({ message: "Hello depuis Railway ✅" });
});

app.options("*", (_req, res) => {
  res.sendStatus(200); // gérer les preflight
});

app.post("/api/login", (req, res) => {
  console.log("🔐 Requête POST /api/login reçue !");
  res.json({ message: "Login OK ✅" });
});

const PORT = parseInt(process.env.PORT || "2000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur Express écoute sur le port ${PORT}`);
});
