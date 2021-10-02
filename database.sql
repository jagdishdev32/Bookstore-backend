CREATE DATABASE demodb

-- \c demodb

-- Creating TAbles

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	author TEXT NOT NULL,
	sales INT DEFAULT 0,
	quantity INT NOT NULL,
	price INT NOT NULL
);

CREATE TABLE employes (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL UNIQUE
);


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL UNIQUE,
  age INT,
  address TEXT,
  phone_no INT
);


CREATE TABLE book_transactions (
	id SERIAL,
	book_id INT NOT NULL,
	user_id INT NOT NULL,
	transaction_date DATE DEFAULT NOW(),
	quantity INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(book_id) REFERENCES books(id)
);


INSERT INTO books (name, author, quantity, price) VALUES ('Slender Oat', 'Justin Allsebrook', 123, 372);
INSERT INTO books (name, author, quantity, price) VALUES ('Dwarf Century Plant', 'Stinky Tabard', 134, 288);
INSERT INTO books (name, author, quantity, price) VALUES ('Bryum Moss', 'Adriaens Skelcher', 136, 758);
INSERT INTO books (name, author, quantity, price) VALUES ('Monnina', 'Lilah Babington', 142, 300);
INSERT INTO books (name, author, quantity, price) VALUES ('Mexican Oak', 'Philip Dunkersley', 141, 267);
INSERT INTO books (name, author, quantity, price) VALUES ('Closedhead Sedge', 'Leyla Capener', 165, 788);
INSERT INTO books (name, author, quantity, price) VALUES ('Colicroot', 'Dolly cornhill', 177, 959);
INSERT INTO books (name, author, quantity, price) VALUES ('Gulf Spikemoss', 'Aldon Mackett', 186, 288);
INSERT INTO books (name, author, quantity, price) VALUES ('Dot Lichen', 'Florencia Floris', 136, 620);
INSERT INTO books (name, author, quantity, price) VALUES ('Desert Foxglove', 'Killy Le Count', 120, 769);
INSERT INTO books (name, author, quantity, price) VALUES ('Aquacatillo', 'Hugo Ianizzi', 161, 317);
INSERT INTO books (name, author, quantity, price) VALUES ('Waxflower Shinleaf', 'Melisandra Prattington', 143, 661);
INSERT INTO books (name, author, quantity, price) VALUES ('Torrey''s Saltbush', 'Leslie Adair', 117, 459);
INSERT INTO books (name, author, quantity, price) VALUES ('Hybrid Willow', 'Franni Dobrowski', 151, 402);
INSERT INTO books (name, author, quantity, price) VALUES ('Longflower Alumroot', 'Phebe Vanyashkin', 189, 350);


INSERT INTO book_transactions (book_id, user_id, quantity) values ( 4, 1, 2);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 7, 1, 4);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 5, 1, 4);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 2, 1, 3);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 1, 1, 3);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 3, 1, 3);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 6, 1, 5);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 2, 1, 2);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 7, 1, 1);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 3, 1, 5);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 7, 1, 2);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 2, 1, 2);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 7, 1, 4);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 4, 1, 4);
INSERT INTO book_transactions (book_id, user_id, quantity) values ( 3, 1, 5);