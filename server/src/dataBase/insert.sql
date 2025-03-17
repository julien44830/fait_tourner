-- Insertion de quelques utilisateurs
INSERT INTO user (email, name, password, is_super_user) VALUES
('admin@example.com', 'Admin', 'hashedpassword1', TRUE),
('user1@example.com', 'User One', 'hashedpassword2', FALSE),
('user2@example.com', 'User Two', 'hashedpassword3', FALSE);

-- Insertion de quelques books
INSERT INTO book (name) VALUES
('Baptême de Lucas'),
('Voyage en Espagne');

-- Association des utilisateurs aux books
INSERT INTO users_book (user_id, book_id, role) VALUES
(1, 1, 'creator'), -- Admin crée le book "Baptême de Lucas"
(2, 1, 'member'),  -- User One rejoint "Baptême de Lucas"
(3, 2, 'creator'); -- User Two crée "Voyage en Espagne"

-- Insertion de quelques images
INSERT INTO picture (user_id, book_id, is_private, name, path) VALUES
(2, 1, FALSE, 'bapteme_photo1.jpg', "/uploads/bapteme_photo1.jpg"),
(2, 1, TRUE, 'bapteme_photo2.jpg', "/uploads/bapteme_photo2.jpg"),
(3, 2, FALSE, 'voyage_photo1.jpg', "/uploads/voyage_photo1.jpg");

-- Insertion de quelques tags
INSERT INTO tag (name) VALUES
('Famille'),
('Cérémonie'),
('Voyage');

-- Association des tags aux images
INSERT INTO picture_tag (picture_id, tag_id) VALUES
(1, 1), -- "bapteme_photo1.jpg" reçoit le tag "Famille"
(1, 2), -- "bapteme_photo1.jpg" reçoit le tag "Cérémonie"
(3, 3); -- "voyage_photo1.jpg" reçoit le tag "Voyage"
