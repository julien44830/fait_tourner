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

app.use(
  cors({
    origin: "https://fait-tourner.vercel.app",
    credentials: true,
  })
);

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
    console.log(`👉 process.env.PORT = ${PORT}`);
    app.listen(PORT, () => {
      console.log(`🚀 Serveur start ✅ sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("⛔ Le serveur ne démarre pas à cause d'une erreur DB.", err);
  }
};

startServer();
