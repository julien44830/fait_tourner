// src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { bookRouter } from "./routes/book.route";
import { authRouter } from "./routes/auth.route";
import { shareRouter } from "./routes/share.route";
import { deleteRouter } from "./routes/delete.route";
import { uploadRouter } from "./routes/upload.route";

const app = express();

// 🌍 Origines autorisées pour le CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.80:5173",
  "https://www.pictevent.fr",
];

// 🛡️ Middleware CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// 📦 Parsing JSON
app.use(express.json());

// 🚀 Routes
app.use("/api/books", bookRouter);
app.use("/api", authRouter);
app.use("/api", shareRouter);
app.use("/api", uploadRouter);
app.use("/uploads", express.static("uploads"));
app.use("/", deleteRouter);

export default app;
