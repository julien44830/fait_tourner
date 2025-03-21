import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/book";
import authRoutes from "./routes/auth";
import share from "./routes/share";
import uploadRoutes from "./routes/upload";
import { getConnection } from "./dbconfig"; // Import de la connexion DB


dotenv.config(); // Charge les variables d'environnement
console.log("✅ Variables d'environnement chargées.");

const app = express();

// Middleware
app.use(cors({ origin: "https://fait-tourner.vercel.app" }));
app.use(express.json()); // Analyse JSON

// Fonction pour démarrer le serveur après la connexion à la DB
const startServer = async () => {
  try {
    await getConnection();

    // Routes
    app.use("/api", bookRoutes);
    app.use("/api", authRoutes);
    app.use("/api", share);
    app.use("/api", uploadRoutes);
    app.use("/uploads", express.static("uploads"));

    // Définition du port
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur start ✅ sur le port ${PORT}`);
    });

  } catch (err: unknown) {  // 🔥 Correction du typage de `err`
    console.error("⛔ Le serveur ne démarre pas à cause d'une erreur DB.", err);
  }
};

// 🔥 Lancement du serveur
startServer();
