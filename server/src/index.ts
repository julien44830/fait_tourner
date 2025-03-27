import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/book";
import authRoutes from "./routes/auth";
import share from "./routes/share";
import uploadRoutes from "./routes/upload";
import { getConnection } from "./dbconfig";
import "./service/passport";

dotenv.config(); // Charge les variables d'environnement
console.log("✅ Variables d'environnement chargées.");

const app = express();
// app.use(cors({ origin: "https://fait-tourner.vercel.app" }));
app.use(
  cors({
    origin: "https://fait-tourner.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// app.use((req, res, next) => {
//   console.log("🔧 Requête reçue:", req.method, req.path);
//   next();
// });
app.use(express.json()); // Analyse JSON

const startServer = async () => {
  try {
    await getConnection();
    app.use("/api", bookRoutes);
    app.use("/api", authRoutes);
    app.use("/api", share);
    app.use("/api", uploadRoutes);
    app.use("/uploads", express.static("uploads"));
    console.log("✅ authRoutes loaded !");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur start ✅ sur le port ${PORT}`);
    });

  } catch (err: unknown) {
    console.error("⛔ Le serveur ne démarre pas à cause d'une erreur DB.", err);
  }
};

startServer();
