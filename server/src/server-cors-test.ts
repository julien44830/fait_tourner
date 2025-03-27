import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Middleware CORS simple
app.use(cors({
  origin: "https://fait-tourner.vercel.app",
  credentials: true,
}));

app.use(express.json());

// ✅ Route de test
app.options("*", cors()); // préflight
app.get("/", (req, res) => {
  res.json({ message: "API opérationnelle 🚀" });
});
app.post("/api/login", (req, res) => {
  res.json({ message: "Login OK" });
});

const PORT = parseInt(process.env.PORT || "4000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur Express écoute sur le port ${PORT}`);
});

