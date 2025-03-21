import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/book";
import authRoutes from "./routes/auth";
import share from "./routes/share";
import uploadRoutes from "./routes/upload";

dotenv.config(); // Charge les variables d'environnement

const app = express();

// Middleware
app.use(cors({ origin: "https://fait-tourner.vercel.app" }));

app.use(express.json()); // Analyse JSON

// Routes
app.use("/api", bookRoutes);
app.use("/api", authRoutes);
app.use("/api", share);
app.use("/api", uploadRoutes);
app.use("/uploads", express.static("uploads"));



// Définition du port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur start ✅`);
});
