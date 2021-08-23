process.env.NODE_ENV = "test";
const db = require("../db");
const app = require("../app");
const request = require("supertest");

const { getBooks, generateToken, hashPassword } = require("../handlers");

const Auth = {};

beforeAll(async () => {
  // Creating Books Table
  await db.query(
    `CREATE TABLE books (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL UNIQUE,
		author TEXT NOT NULL,
		sales INT DEFAULT 0,
		quantity INT NOT NULL
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
    INSERT INTO books (name, author, quantity) VALUES ('Leitneria pilosa J.A. Schrad. & W.R. Graves', 'sachin', 190);
    INSERT INTO books (name, author, quantity) VALUES ('Amaranthus crispus (Lesp. & Thev.) N. Terracc.', 'nikhil', 115);
    INSERT INTO books (name, author, quantity) VALUES ('Astragalus lentiginosus Douglas ex Hook. var. diphysus (A. Gray) M.E. Jones', 'nitin', 124);
    INSERT INTO books (name, author, quantity) VALUES ('Torenia L.', 'nikhil', 115);
    INSERT INTO books (name, author, quantity) VALUES ('Philadelphus pumilus Rydb. var. ovatus Hu', 'mukesh', 114);
    INSERT INTO books (name, author, quantity) VALUES ('Theobroma mammosum Cuatrec. & Leon', 'nitin', 124);
    INSERT INTO books (name, author, quantity) VALUES ('Malaxis massonii (Ridley) Kuntze', 'sachin', 150);
    INSERT INTO books (name, author, quantity) VALUES ('Cladonia homosekikaica Nuno', 'nikhil', 193);
    INSERT INTO books (name, author, quantity) VALUES ('Banara vanderbiltii Urb.', 'sachin', 199);
    INSERT INTO books (name, author, quantity) VALUES ('Pelargonium odoratissimum (L.) L''Hér. ex Aiton', 'nikhil', 156);
    INSERT INTO books (name, author, quantity) VALUES ('Porophyllum pygmaeum Keil & J. Morefield', 'nikhil', 139);
    INSERT INTO books (name, author, quantity) VALUES ('Annona senegalensis Pers.', 'nikhil', 173);
    INSERT INTO books (name, author, quantity) VALUES ('Eriogonum heermannii Durand & Hilg. var. heermannii', 'sachin', 186);
    INSERT INTO books (name, author, quantity) VALUES ('Ulex europaeus L.', 'sachin', 155);
    INSERT INTO books (name, author, quantity) VALUES ('Allium perdulce S.V. Fraser var. sperryi Ownbey', 'nitin', 171);
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
      });

    expect(response.body.message).toBe("Book Registered...");
    expect(response.body.book.name).toBe("newBook");
    expect(response.body.book.author).toBe("jd");
    expect(response.body.book.quantity).toBe(200);
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
  test("request with user token, response return with list of books which includes na in name", async () => {
    // Searching book by name na
    const response = await request(app)
      .get("/books/search/na")
      .set("Authorization", Auth.user.token);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });
});
