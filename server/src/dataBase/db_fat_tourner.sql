-- -- Création de la base de données
-- CREATE DATABASE IF NOT EXISTS fait_tourner_db;
-- USE fait_tourner_db;

-- -- Table des utilisateurs
-- CREATE TABLE user (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     name VARCHAR(255) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     is_super_user BOOLEAN DEFAULT FALSE
-- );

-- -- Table des books (albums)
-- CREATE TABLE book (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );

-- -- Table de liaison entre utilisateurs et books (gestion des rôles)
-- CREATE TABLE users_book (
--     user_id INT NOT NULL,
--     book_id INT NOT NULL,
--     role VARCHAR(10) DEFAULT 'member',
--     PRIMARY KEY (user_id, book_id),
--     FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
--     FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
-- );

-- -- Table des images
-- CREATE TABLE picture (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     book_id INT NOT NULL,
--     is_private BOOLEAN DEFAULT FALSE,
--     filter INT,
--     create_at TIMESTAMP  ,
--     date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     name VARCHAR(255) NOT NULL,
--     path VARCHAR(255) NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
--     FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
-- );

-- -- Table des filtres pour les images
-- CREATE TABLE filter (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );

-- -- Table des tags pour catégoriser les images
-- CREATE TABLE tag (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );

-- -- Table de liaison entre images et tags (many-to-many)
-- CREATE TABLE picture_tag (
--     picture_id INT NOT NULL,
--     tag_id INT NOT NULL,
--     PRIMARY KEY (picture_id, tag_id),
--     FOREIGN KEY (picture_id) REFERENCES picture(id) ON DELETE CASCADE,
--     FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
-- );


-- Création de la base de données
CREATE DATABASE IF NOT EXISTS fait_tourner_db;
USE fait_tourner_db;

-- Table des utilisateurs
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table des books (albums)
CREATE TABLE book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL, -- 🔥 Ajout du propriétaire du book
    FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Table de liaison entre utilisateurs et books (gestion des rôles)
CREATE TABLE users_book (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    is_owner BOOLEAN DEFAULT FALSE, -- 🔥 Ajout pour identifier le créateur
    role ENUM('owner', 'editor', 'viewer') DEFAULT 'viewer', -- 🔥 Ajout de rôles
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
);

-- Table des images
CREATE TABLE picture (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    filter INT,
    create_at TIMESTAMP NULL,
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
);

-- Table des filtres pour les images
CREATE TABLE filter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table des tags pour catégoriser les images
CREATE TABLE tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table de liaison entre images et tags (many-to-many)
CREATE TABLE picture_tag (
    picture_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (picture_id, tag_id),
    FOREIGN KEY (picture_id) REFERENCES picture(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);
