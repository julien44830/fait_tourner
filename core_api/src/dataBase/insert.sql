-- Insertion de quelques utilisateurs
INSERT INTO user (email, name, password) VALUES
('gaëlle@example.com', 'gaëlle', 'hashedpassword1'),
('nemo@example.com', 'nemo', 'hashedpassword2'),
('vijay@example.com', 'vijay', 'hashedpassword3'),
('branky@example.com', 'branky', 'hashedpassword3');

-- Insertion de quelques books avec leur créateur
INSERT INTO book (name, owner_id) VALUES
('Baptême de Lucas', 1),  -- 🔥 Gaëlle est la propriétaire du book
('Voyage en Espagne', 3); -- 🔥 Vijay est le propriétaire du book

-- Association des utilisateurs aux books dans users_book
INSERT INTO users_book (user_id, book_id, is_owner, role) VALUES
(1, 1, TRUE, 'owner'),   -- 🔥 Gaëlle est la créatrice (owner) de "Baptême de Lucas"
(2, 1, FALSE, 'editor'), -- Nemo a un accès éditeur à "Baptême de Lucas"
(3, 2, TRUE, 'owner');   -- 🔥 Vijay est le créateur (owner) de "Voyage en Espagne"

-- Insertion de quelques images associées aux books
INSERT INTO picture (user_id, book_id, is_private, name, path) VALUES
(2, 1, true, 'bapteme_photo1.jpg', "/uploads/bapteme_photo1.jpg"),
(2, 1, false, 'bapteme_photo2.jpg', "/uploads/bapteme_photo2.jpg"),
(3, 2, true, 'voyage_photo1.jpg', "/uploads/voyage_photo1.jpg");

-- Insertion de quelques tags
INSERT INTO tag (name) VALUES
('Famille'),
('Cérémonie'),
('Voyage');

-- Association des tags aux images avec des IDs cohérents
INSERT INTO picture_tag (picture_id, tag_id) VALUES
(1, 1), -- "bapteme_photo1.jpg" reçoit le tag "Famille"
(1, 2), -- "bapteme_photo1.jpg" reçoit le tag "Cérémonie"
(3, 3); -- "voyage_photo1.jpg" reçoit le tag "Voyage"
