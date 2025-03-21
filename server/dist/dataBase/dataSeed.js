"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbconfig_1 = require("../dbconfig");
async function resetDatabase() {
    console.log("🔄 Réinitialisation de la base de données...");
    const connection = await (0, dbconfig_1.getConnection)();
    try {
        await connection.beginTransaction();
        // 🗑 Supprimer les données et réinitialiser AUTO_INCREMENT proprement
        const tables = [
            "picture_tag",
            "tag",
            "picture",
            "users_book",
            "book",
            "user",
        ];
        for (const table of tables) {
            await connection.execute(`SET FOREIGN_KEY_CHECKS = 0`);
            await connection.execute(`TRUNCATE TABLE ${table}`);
            await connection.execute(`SET FOREIGN_KEY_CHECKS = 1`);
        }
        console.log("✅ Tables vidées et AUTO_INCREMENT réinitialisé.");
        // 👤 Insérer des utilisateurs
        await connection.execute(`INSERT INTO user (email, name, password) VALUES 
            ('gaelle@example.com', 'gaëlle', '$argon2id$v=19$m=65536,t=3,p=4$WY4Nfj2m3efAzfEWq0hxFw$DTA3qGP682n4DKgkro3Tdd0bOELKEUhEDfh6XzAUvbo'),
            ('nemo@example.com', 'nemo', '$argon2id$v=19$m=65536,t=3,p=4$WY4Nfj2m3efAzfEWq0hxFw$DTA3qGP682n4DKgkro3Tdd0bOELKEUhEDfh6XzAUvbo'),
            ('vijay@example.com', 'vijay', '$argon2id$v=19$m=65536,t=3,p=4$WY4Nfj2m3efAzfEWq0hxFw$DTA3qGP682n4DKgkro3Tdd0bOELKEUhEDfh6XzAUvbo'),
            ('le_branky@example.com', 'le branky', '$argon2id$v=19$m=65536,t=3,p=4$WY4Nfj2m3efAzfEWq0hxFw$DTA3qGP682n4DKgkro3Tdd0bOELKEUhEDfh6XzAUvbo');`);
        // 📚 Insérer des books avec `owner_id`
        await connection.execute(`INSERT INTO book (name, owner_id) VALUES 
            ('Baptême de Morgan', 1),  -- 🔥 Gaëlle est propriétaire
            ('Voyage en Espagne', 3);  -- 🔥 Vijay est propriétaire`);
        // 🔗 Associer les utilisateurs aux books avec `is_owner` et `role`
        await connection.execute(`INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES 
          (1, 1, TRUE, 'owner'),   -- Gaëlle est propriétaire du "Baptême de Morgan"
          (2, 1, FALSE, 'editor'), -- Nemo a un accès éditeur à "Baptême de Morgan"
          (3, 2, TRUE, 'owner'),   -- Vijay est propriétaire de "Voyage en Espagne"
          (4, 2, FALSE, 'viewer'); -- Le Branky est en simple viewer`);
        // 🖼 Insérer des images associées aux books
        await connection.execute(`INSERT INTO picture (user_id, book_id, is_private, name, path) VALUES 
            (2, 1, FALSE, 'bapteme_photo1.jpg', '/uploads/bapteme_photo1.jpg'),
            (2, 1, FALSE, 'bapteme_photo2.jpg', '/uploads/bapteme_photo2.jpg'),
            (3, 2, FALSE, 'voyage_photo1.jpg', '/uploads/voyage_photo1.jpg');`);
        // 🏷 Insérer des tags
        await connection.execute(`INSERT INTO tag (name) VALUES 
            ('Famille'),
            ('Cérémonie'),
            ('Voyage');`);
        // 🔗 Associer les tags aux images avec les bons IDs
        await connection.execute(`INSERT INTO picture_tag (picture_id, tag_id) VALUES 
            (1, 1), -- bapteme_photo1.jpg -> Famille
            (1, 2), -- bapteme_photo2.jpg -> Cérémonie
            (3, 3); -- voyage_photo1.jpg -> Voyage`);
        await connection.commit();
        console.log("🎉 Base de données réinitialisée et données insérées avec succès !");
    }
    catch (error) {
        await connection.rollback();
        console.error("❌ Erreur lors de la réinitialisation :", error);
    }
    finally {
        await connection.end(); // 🚀 Fermer la connexion proprement
    }
}
// 🚀 Exécuter le script
resetDatabase();
