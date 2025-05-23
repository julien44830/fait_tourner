import mysql from 'mysql2/promise';

export const getConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
        });

        console.log("✅ Connexion à la base de données réussie !");
        return connection;
    } catch (err) {
        console.error("⛔ Erreur lors de la connexion à la base de données :", err);
        throw err;
    }
};
