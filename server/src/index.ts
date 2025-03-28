import express from "express";
const app = express();

app.get("/", (_req, res) => {
  res.json({ message: "Hello depuis Railway ✅" });
});

const PORT = parseInt(process.env.PORT || "4000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur Express écoute sur le port ${PORT}`);
});
