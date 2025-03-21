"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getConnection = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL n'est pas défini dans les variables d'environnement");
    }
    const connection = await promise_1.default.createConnection(process.env.DATABASE_URL);
    if (!connection)
        throw new Error("Connexion à la BDD échouée");
    return connection;
};
exports.getConnection = getConnection;
