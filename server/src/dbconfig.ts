import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// 🔧 Configuration de la connexion MySQL
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Fonction pour obtenir une connexion MySQL
export async function getConnection() {
    return await mysql.createConnection(dbConfig);
}
