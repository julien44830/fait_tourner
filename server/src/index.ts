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

const app = express();

const allowedOrigins = [
  "http://localhost:5173",            // pour le dev local
  "https://www.pictevent.fr",         // prod
];

app.use(cors({
  origin: (origin, callback) => {
    console.log("🌐 Requête CORS depuis :", origin);

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

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur start ✅ sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("⛔ Le serveur ne démarre pas à cause d'une erreur DB.", err);
  }
};

startServer();
