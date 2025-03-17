import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement

const app = express();

// Middleware
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Permet d'analyser le JSON dans les requêtes

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur mon serveur Express 🚀" });
});

// Définition du port (depuis .env ou valeur par défaut)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`  ➜  Serveur: http://localhost:${PORT} ✅`);
});
