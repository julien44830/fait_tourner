import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bookRoutes from "./routes/book";
import authRoutes from "./routes/auth";
import share from "./routes/share";
import uploadRoutes from "./routes/upload";
import deleteRouter from "./routes/delete";
import { getConnection } from "./dbconfig";
import "./service/passport";

dotenv.config();

const app = express();

// 🔒 Vérification des variables d'environnement nécessaires
const requiredEnvs = ["SECRET_KEY", "PORT"];
requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Variable d'environnement manquante : ${key}`);
  }
});

const allowedOrigins = [
  "http://localhost:5173",            // pour le dev local
  "http://192.168.1.80:5173",        // pour le dev local sur mobile
  "https://www.pictevent.fr",         // prod
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // autorise Postman/curl etc.
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

const startServer = async () => {
  try {
    await getConnection();

    app.use("/api", bookRoutes);
    app.use("/api", authRoutes);
    app.use("/api", share);
    app.use("/api", uploadRoutes);
    app.use("/uploads", express.static("uploads"));
    app.use("/", deleteRouter);

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur start ✅ sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("⛔ Le serveur ne démarre pas à cause d'une erreur DB.", err);
  }
};

startServer();
