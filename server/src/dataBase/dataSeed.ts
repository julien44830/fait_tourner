import { getConnection } from "../dbconfig";

async function resetDatabase() {
    console.log("🔄 Réinitialisation de la base de données...");

    const connection = await getConnection();

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
            ('user2@example.com', 'vijay ', 'hashedpassword3', FALSE),
            ('user3@example.com', 'le branky ', 'hashedpassword3', FALSE);`
        );

        // 📚 Insérer des books
        await connection.execute(
            `INSERT INTO book (name) VALUES 
            ('Baptême de morgan'),
            ('Voyage en Espagne');`
        );

        // 🔗 Associer les utilisateurs aux books
        await connection.execute(
            `INSERT INTO users_book (user_id, book_id, role) VALUES 
          (1, 1, 'creator'),  -- gaëlle crée "Baptême de morgan"
          (2, 1, 'member'),   -- nemo rejoint "Baptême de morgan"
          (3, 2, 'creator'),  -- vijay crée "Voyage en Espagne"
          (4, 2, 'member');   -- le branky rejoint "Voyage en Espagne"`
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
            (1, 2), -- bapteme_photo2.jpg -> Cérémonie
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
        await connection.end(); // 🚀 Fermer la connexion proprement
    }
}

// 🚀 Exécuter le script
resetDatabase();
