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

const PORT = parseInt(process.env.PORT || "2000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur Express écoute sur le port ${PORT}`);
});
