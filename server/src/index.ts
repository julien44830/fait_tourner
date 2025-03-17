import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/book"; // ✅ Assure-toi que le chemin est correct

dotenv.config(); // Charge les variables d'environnement

const app = express();

// Middleware
app.use(cors()); // Autorise CORS
app.use(express.json()); // Analyse JSON

// Routes
app.use("/api", bookRoutes); // ✅ Charge les routes définies dans book.ts

// Définition du port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur: http://localhost:${PORT} ✅`);
});
