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
  res.send("API OK");
});
app.post("/api/login", (req, res) => {
  res.json({ message: "Login OK" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express écoute sur le port ${PORT}`);
});
