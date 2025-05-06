import express from "express";
import dotenv from "dotenv";
import path from "path";
import uploadRoutes from "./routes/upload.route";

dotenv.config();

const app = express();

// 🔥 Parse des données multipart
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛠️ Route d'upload (POST /upload)
app.use("/upload", uploadRoutes);

// 📂 Servir statiquement tout ce qui est dans /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// // 📩 Logger chaque requête
// app.use((req, res, next) => {
//   console.log("📩 Requête reçue dans upload_service :", req.method, req.url);
//   next();
// });

// 🚨 CAPTURER les requêtes "nues" qui arrivent après le pathRewrite
app.use(express.static(path.join(__dirname, "../uploads")));
// 👉 très important : ça sert pour gérer les GET simples comme `/d6453a27-2d29-4faf-....png`

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`📤 Upload service lancé sur le port ${PORT}`);
});
