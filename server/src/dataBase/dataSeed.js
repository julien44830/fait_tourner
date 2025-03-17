const mysql = require("mysql2/promise");

// 🔧 Configuration de la connexion MySQL
const dbConfig = {
    host: "localhost", // 🔧 Modifier si nécessaire
    user: "root", // 🔧 Modifier si nécessaire
    password: "0000", // 🔧 Ajouter le mot de passe MySQL
    database: "fait_tourner_db",
};

async function resetDatabase() {
    const connection = await mysql.createConnection(dbConfig);

    console.log("🔄 Réinitialisation de la base de données...");

    try {
        await connection.beginTransaction();

        // 🗑 Supprimer les données et réinitialiser AUTO_INCREMENT
        const tables = [
            "picture_tag",
            "tag",
            "picture",
            "users_book",
            "book",
            "user",
        ];
        for (const table of tables) {
            await connection.execute(`DELETE FROM ${table}`);
            await connection.execute(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
        }

        console.log("✅ Tables vidées et AUTO_INCREMENT réinitialisé.");

        // 👤 Insérer des utilisateurs
        await connection.execute(
            `INSERT INTO user (email, name, password, is_super_user) VALUES 
       ('admin@example.com', 'gaëlle', 'hashedpassword1', TRUE),
       ('user1@example.com', 'nemo ', 'hashedpassword2', FALSE),
       ('user2@example.com', 'vijay ', 'hashedpassword3', FALSE);`
        );

        // 📚 Insérer des books
        await connection.execute(
            `INSERT INTO book (name) VALUES 
       ('Baptême de Lucas'),
       ('Voyage en Espagne');`
        );

        // 🔗 Associer les utilisateurs aux books
        await connection.execute(
            `INSERT INTO users_book (user_id, book_id, role) VALUES 
       (1, 1, 'creator'), -- Admin crée "Baptême de Lucas"
       (2, 1, 'member'),  -- User One rejoint
       (3, 2, 'creator'); -- User Two crée "Voyage en Espagne"`
        );

        // 🖼 Insérer des images
        await connection.execute(
            `INSERT INTO picture (user_id, book_id, is_private, name, path) VALUES 
       (2, 1, FALSE, 'bapteme_photo1.jpg', '/uploads/bapteme_photo1.jpg'),
       (2, 1, FALSE, 'bapteme_photo2.jpg', '/uploads/bapteme_photo2.jpg'),
       (3, 2, FALSE, 'voyage_photo1.jpg', '/uploads/voyage_photo1.jpg');`
        );

        // 🏷 Insérer des tags
        await connection.execute(
            `INSERT INTO tag (name) VALUES 
       ('Famille'),
       ('Cérémonie'),
       ('Voyage');`
        );

        // 🔗 Associer les tags aux images
        await connection.execute(
            `INSERT INTO picture_tag (picture_id, tag_id) VALUES 
       (1, 1), -- bapteme_photo1.jpg -> Famille
       (1, 2), -- bapteme_photo1.jpg -> Cérémonie
       (3, 3); -- voyage_photo1.jpg -> Voyage`
        );

        await connection.commit();
        console.log(
            "🎉 Base de données réinitialisée et données insérées avec succès !"
        );
    } catch (error) {
        await connection.rollback();
        console.error("❌ Erreur lors de la réinitialisation :", error);
    } finally {
        await connection.end();
    }
}

// 🚀 Exécuter le script
resetDatabase();
