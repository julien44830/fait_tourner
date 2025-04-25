import express from "express";
import dotenv from "dotenv";
import path from "path";
import uploadRoutes from "./routes/upload.route";

dotenv.config();

const app = express();

// 🔥 NÉCESSAIRE pour parse les données multipart et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Servir les fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 🛠️ Route d’upload
app.use("/upload", uploadRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`📤 Upload service lancé sur le port ${PORT}`);
});
