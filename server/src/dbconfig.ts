import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const getConnection = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL n'est pas défini dans les variables d'environnement");
    }
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    if (!connection) throw new Error("Connexion à la BDD échouée");
    return connection;
};