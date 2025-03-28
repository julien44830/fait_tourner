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
const dbconfig_1 = require("./dbconfig");
require("./service/passport");
dotenv_1.default.config();
console.log("✅ Variables d'environnement chargées.");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://www.pictevent.fr",
    credentials: true,
}));
app.use(express_1.default.json());
const startServer = async () => {
    try {
        await (0, dbconfig_1.getConnection)();
        app.use("/api", book_1.default);
        app.use("/api", auth_1.default);
        app.use("/api", share_1.default);
        app.use("/api", upload_1.default);
        app.use("/uploads", express_1.default.static("uploads"));
        const PORT = process.env.PORT || 4000;
        console.log(`👉 process.env.PORT = ${PORT}`);
        app.listen(PORT, () => {
            console.log(`🚀 Serveur start ✅ sur le port ${PORT}`);
        });
    }
    catch (err) {
        console.error("⛔ Le serveur ne démarre pas à cause d'une erreur DB.", err);
    }
};
startServer();
