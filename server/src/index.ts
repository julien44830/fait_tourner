import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/book";
import authRoutes from "./routes/auth";
import share from "./routes/share";
import uploadRoutes from "./routes/upload";
import { getConnection } from "./dbconfig";
import "./service/passport";

dotenv.config();
console.log("✅ Variables d'environnement chargées.");

const app = express();

// Middleware manuel pour CORS (utile en cas de bug avec preflight)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://fait-tourner.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Middleware officiel CORS
app.use(
  cors({
    origin: "https://fait-tourner.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Important : gérer les requêtes OPTIONS
app.options("*", cors());

// JSON parser
app.use(express.json());

const startServer = async () => {
  try {
    await getConnection();
    app.use("/api", bookRoutes);
    app.use("/api", authRoutes);
    app.use("/api", share);
    app.use("/api", uploadRoutes);
    app.use("/uploads", express.static("uploads"));

    const PORT = process.env.PORT;
    console.log("👉 process.env.PORT =", process.env.PORT);
    if (!PORT) {
      throw new Error("❌ La variable d'environnement PORT est manquante !");
    }
    app.listen(PORT, () => {
      console.log(`🚀 Serveur start ✅ sur le port ${PORT}`);
    });
  } catch (err: unknown) {
    console.error("⛔ Le serveur ne démarre pas à cause d'une erreur DB.", err);
  }
};

startServer();
