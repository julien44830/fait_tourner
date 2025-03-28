"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
console.log("🚨 Démarrage de l'application Express");
app.get("/", (_req, res) => {
    console.log("✅ Route GET / appelée");
    res.json({ message: "Hello depuis Railway ✅" });
});
const PORT = parseInt(process.env.PORT || "4000", 10);
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur Express écoute sur le port ${PORT}`);
});
