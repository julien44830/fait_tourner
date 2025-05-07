import express from "express";
import dotenv from "dotenv";
import mailRoutes from "./routes/mailer.route";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/mail", mailRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`📬 Mail service actif sur le port ${PORT}`);
});
