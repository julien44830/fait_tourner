-- Table des utilisateurs
CREATE TABLE user (
    id VARCHAR(36) NOT NULL PRIMARY KEY, -- UUID
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255)
);

-- Table des books (albums)
CREATE TABLE book (
    id VARCHAR(36) NOT NULL PRIMARY KEY, -- UUID
    name VARCHAR(255) NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Table de liaison entre utilisateurs et books
CREATE TABLE users_book (
    user_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    is_owner BOOLEAN DEFAULT FALSE,
    role ENUM('owner', 'editor', 'viewer') DEFAULT 'viewer',
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
);

-- Table des images
CREATE TABLE picture (
    id VARCHAR(36) NOT NULL PRIMARY KEY, -- UUID pour uniformiser
    user_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    filter VARCHAR(36),
    create_at TIMESTAMP NULL,
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
);

-- Table des filtres
CREATE TABLE filter (
    id VARCHAR(36) NOT NULL PRIMARY KEY, -- UUID
    name VARCHAR(255) NOT NULL
);

-- Table des tags
CREATE TABLE tag (
    id VARCHAR(36) NOT NULL PRIMARY KEY, -- UUID
    name VARCHAR(255) NOT NULL
);

-- Liaison images/tags
CREATE TABLE picture_tag (
    picture_id VARCHAR(36) NOT NULL,
    tag_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (picture_id, tag_id),
    FOREIGN KEY (picture_id) REFERENCES picture(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);



-- -- Suppression de la base existante (attention ⚠️)
-- DROP DATABASE IF EXISTS fait_tourner_db;

-- -- Création de la base de données
-- CREATE DATABASE fait_tourner_db;
-- USE fait_tourner_db;

-- -- Table des utilisateurs
-- CREATE TABLE user (
--     id VARCHAR(30) NOT NULL PRIMARY KEY,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     name VARCHAR(255) NOT NULL,
--     password VARCHAR(255)
-- );

-- -- Table des books (albums)
-- CREATE TABLE book (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     owner_id VARCHAR(30) NOT NULL,
--     FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE
-- );

-- -- Table de liaison entre utilisateurs et books
-- CREATE TABLE users_book (
--     user_id VARCHAR(30) NOT NULL,
--     book_id INT NOT NULL,
--     is_owner BOOLEAN DEFAULT FALSE,
--     role ENUM('owner', 'editor', 'viewer') DEFAULT 'viewer',
--     PRIMARY KEY (user_id, book_id),
--     FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
--     FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
-- );

-- -- Table des images
-- CREATE TABLE picture (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id  VARCHAR(30) NOT NULL,
--     book_id INT NOT NULL,
--     is_private BOOLEAN DEFAULT FALSE,
--     filter INT,
--     create_at TIMESTAMP NULL,
--     date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     name VARCHAR(255) NOT NULL,
--     path VARCHAR(255) NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
--     FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
-- );

-- -- Table des filtres
-- CREATE TABLE filter (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );

-- -- Table des tags
-- CREATE TABLE tag (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );

-- -- Liaison images/tags
-- CREATE TABLE picture_tag (
--     picture_id INT NOT NULL,
--     tag_id INT NOT NULL,
--     PRIMARY KEY (picture_id, tag_id),
--     FOREIGN KEY (picture_id) REFERENCES picture(id) ON DELETE CASCADE,
--     FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
-- );

-- DROP TABLE IF EXISTS picture_tag;
-- DROP TABLE IF EXISTS tag;
-- DROP TABLE IF EXISTS picture;
-- DROP TABLE IF EXISTS users_book;
-- DROP TABLE IF EXISTS book;
-- DROP TABLE IF EXISTS user;
-- DROP TABLE IF EXISTS filter;
