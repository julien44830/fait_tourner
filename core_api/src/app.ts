// src/app.ts

import express from "express";
import cors from "cors";
import { proxyUploadsMiddleware } from "./services/proxyUploads"; // 👈 doit venir AVANT
import { bookRouter } from "./routes/book.route";
import { authRouter } from "./routes/auth.route";
import { shareRouter } from "./routes/share.route";
import { deleteRouter } from "./routes/delete.route";
import { uploadRouter } from "./routes/upload.route";
import pictureRouter from "./routes/picture.route";

const app = express();

// 🌍 CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.80:5173",
  "https://www.pictevent.fr",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// 📦 JSON Parsing
app.use(express.json());

// 📂 PROXY POUR LES UPLOADS - très haut !
app.use("/uploads", proxyUploadsMiddleware);

// 🚀 Ensuite les vraies routes API
app.use("/api/books", bookRouter);
app.use("/api", authRouter);
app.use("/api", shareRouter);
app.use("/api", uploadRouter);
app.use("/api/pictures", pictureRouter);
app.use("/", deleteRouter);

export default app;
