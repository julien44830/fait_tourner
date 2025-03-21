import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement

const migrate = async () => {
  try {
    console.log("🚀 Connexion à la base de données...");

    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: Number(process.env.MYSQLPORT),
    });

    console.log("✅ Connexion réussie ! Exécution des migrations...");

    // Création de la table `users`
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table 'users' créée.");

    // Création de la table `books`
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Table 'books' créée.");

    console.log("🎉 Migrations terminées !");
    await connection.end();
  } catch (error) {
    console.error("❌ Erreur pendant la migration :", error);
  }
};

migrate();
