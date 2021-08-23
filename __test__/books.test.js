process.env.NODE_ENV = "test";
const db = require("../db");
const app = require("../app");
const request = require("supertest");

const {
  getBooks,
  generateToken,
  hashPassword,
  getBook,
} = require("../handlers");

const Auth = {};

beforeAll(async () => {
  // Creating Books Table
  await db.query(
    `CREATE TABLE books (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL UNIQUE,
		author TEXT NOT NULL,
		sales INT DEFAULT 0,
		quantity INT NOT NULL,
    price INT NOT NULL
		)`
  );

  // Creating Employee Table
  await db.query(
    `CREATE TABLE employes (
		id SERIAL PRIMARY KEY,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL UNIQUE
		)`
  );

  // Creating User Table
  await db.query(
    `CREATE TABLE users (
		id SERIAL PRIMARY KEY,
		name TEXT,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL UNIQUE,
		age INT,
		address TEXT,
		phone_no INT
		)`
  );
});

beforeEach(async () => {
  // Inserting demo books data
  await db.query(`
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
  `);

  const hashedPassword = await hashPassword("secret");

  // Inserting employee
  const employeeData = await db.query(
    "INSERT INTO employes (username, password) VALUES ($1, $2) RETURNING *",
    ["testemployee", hashedPassword]
  );

  // Generating Employee Token
  const employeeToken = await generateToken(
    {
      username: employeeData.rows[0].username,
      employee_id: employeeData.rows[0].id,
    },
    "employee"
  );

  // Storing Employee Token
  const employee = employeeData.rows[0];
  Auth.employee = employee;
  Auth.employee.token = employeeToken;

  // Inserting user
  const userData = await db.query(
    "INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING *",
    ["testuser", hashedPassword, "testname"]
  );

  // Generating Employee Token
  const userToken = await generateToken(
    {
      username: userData.rows[0].username,
      user_id: userData.rows[0].id,
    },
    "user"
  );

  // Storing Employee Token
  const user = userData.rows[0];
  Auth.user = user;
  Auth.user.token = userToken;
});

afterEach(async () => {
  await db.query("DELETE FROM books");
  await db.query("DELETE FROM employes");
  await db.query("DELETE FROM users");
});

afterAll(async () => {
  await db.query("DROP TABLE books");
  await db.query("DROP TABLE employes");
  await db.query("DROP TABLE users");
  return db.end();
});

// Get all Books If req as user
describe("GET /books", () => {
  test("request with user token & response returns with the list of all books", async () => {
    const response = await request(app)
      .get("/books")
      .set("Authorization", Auth.user.token);

    expect(response.body.length).toBe(15);
    expect(response.statusCode).toBe(200);
  });
});

// Get all Books If req as employee
describe("GET /books", () => {
  test("request with employee token & response returns with the list of all books", async () => {
    const response = await request(app)
      .get("/books")
      .set("Authorization", Auth.employee.token);

    expect(response.body.length).toBe(15);
    expect(response.statusCode).toBe(200);
  });
});

// Get all books return error login with invalid token
describe("GET /books", () => {
  test("request with invalid token & response returns message error", async () => {
    const response = await request(app)
      .get("/books")
      .set("Authorization", "lasdfjlkj");

    expect(response.body.message).toBe("unauthorized");
    expect(response.statusCode).toBe(401);
  });
});

// Create New Book
describe("POST /books", () => {
  test("response return with message and new book", async () => {
    const response = await request(app)
      .post("/books")
      .set("Authorization", Auth.employee.token)
      // .set("Authorization", Auth.user.token)
      // .set("Authorization", "lasdjflkjs")
      .send({
        name: "newBook",
        author: "jd",
        quantity: 200,
        price: 100,
      });

    expect(response.body.message).toBe("Book Registered...");
    expect(response.body.book.name).toBe("newBook");
    expect(response.body.book.author).toBe("jd");
    expect(response.body.book.quantity).toBe(200);
    expect(response.body.book.price).toBe(100);
    expect(response.statusCode).toBe(201);

    // Make Sure no. books increased
    const books = await getBooks();
    expect(books.length).toBe(16);
    expect(books[15].name).toBe("newBook");
  });
});

// Trying Creating Book with user token
describe("POST /books", () => {
  test("request with user token, response return with message unauthorized", async () => {
    const response = await request(app)
      .post("/books")
      // .set("Authorization", Auth.employee.token)
      .set("Authorization", Auth.user.token)
      // .set("Authorization", "lasdjflkjs")
      .send({
        name: "newBook",
        author: "jd",
        quantity: 200,
        price: 100,
      });

    expect(response.body.message).toBe("unauthorized");
    expect(response.statusCode).toBe(401);

    // Make Sure no. books remain same
    const books = await getBooks();
    expect(books.length).toBe(15);
  });
});

// Search Book by name
describe("GET /books/search/:name", () => {
  test("request with user token, response return with list of books which includes s in name", async () => {
    // Searching book by name na
    const response = await request(app)
      .get("/books/search/s")
      .set("Authorization", Auth.user.token);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(7);
  });
});

// Updating Book
describe("POST /books:id", () => {
  test("response return with message and updated book", async () => {
    const newBook = await request(app)
      .post("/books")
      .set("Authorization", Auth.employee.token)
      .send({
        name: "newBook",
        author: "jd",
        quantity: 200,
        price: 100,
      });

    expect(newBook.body.message).toBe("Book Registered...");

    const response = await request(app)
      .post(`/books/${newBook.body.book.id}`)
      .set("Authorization", Auth.employee.token)
      .send({
        name: "New Name",
        author: "jd sir",
        quantity: 211,
        price: 200,
      });

    expect(response.body.message).toBe("updated..");
    expect(response.body.book.name).toBe("New Name");
    expect(response.statusCode).toBe(201);

    const checkBook = await getBook(newBook.body.book.id);
    expect(checkBook.name).toBe("New Name");
  });
});

// Book Delete
describe("DELETE /books/:id", () => {
  test("response return with message deleted and book", async () => {
    const newBook = await request(app)
      .post("/books")
      .set("Authorization", Auth.employee.token)
      .send({
        name: "newBook",
        author: "jd",
        quantity: 200,
        price: 100,
      });

    expect(newBook.body.message).toBe("Book Registered...");

    const response = await request(app)
      .delete(`/books/${newBook.body.book.id}`)
      .set("Authorization", Auth.employee.token);

    expect(response.body.message).toBe("deleted");
    expect(response.body.book.name).toBe("newBook");

    // Making sure book is deleted
    const books = await getBooks();
    expect(books.length).toBe(15);
  });
});
