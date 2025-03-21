"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const book_1 = __importDefault(require("./routes/book"));
const auth_1 = __importDefault(require("./routes/auth"));
const share_1 = __importDefault(require("./routes/share"));
const upload_1 = __importDefault(require("./routes/upload"));
dotenv_1.default.config(); // Charge les variables d'environnement
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Autorise CORS
app.use(express_1.default.json()); // Analyse JSON
// Routes
app.use("/api", book_1.default);
app.use("/api", auth_1.default);
app.use("/api", share_1.default);
app.use("/api", upload_1.default);
app.use("/uploads", express_1.default.static("uploads"));
// Définition du port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur start ✅`);
});
