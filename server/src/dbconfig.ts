import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config(); // Charge les variables d'environnement


export const getConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE,
            port: Number(process.env.MYSQLPORT),
        });

        console.log("✅ Connexion à la base de données réussie !");
        return connection;
    } catch (err) {
        throw err;
    }
};
