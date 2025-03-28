"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const getConnection = async () => {
    try {
        const connection = await promise_1.default.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
        });
        console.log("✅ Connexion à la base de données réussie !");
        return connection;
    }
    catch (err) {
        console.error("⛔ Erreur lors de la connexion à la base de données :", err);
        throw err;
    }
};
exports.getConnection = getConnection;
