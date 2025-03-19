import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/book";
import authRoutes from "./routes/auth";

dotenv.config(); // Charge les variables d'environnement

const app = express();

// Middleware
app.use(cors()); // Autorise CORS
app.use(express.json()); // Analyse JSON

// Routes
app.use("/api", bookRoutes);
app.use("/api", authRoutes);
console.log("✅ Routes d'authentification chargées !");


// Définition du port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur: http://localhost:${PORT} ✅`);
});
