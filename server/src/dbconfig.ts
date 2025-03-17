import mysql from "mysql2/promise";

// 🔧 Configuration de la connexion MySQL
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "0000",
    database: "fait_tourner_db",
};

// Fonction pour obtenir une connexion MySQL
export async function getConnection() {
    return await mysql.createConnection(dbConfig);
}
