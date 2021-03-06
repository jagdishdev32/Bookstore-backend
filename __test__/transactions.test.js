process.env.NODE_ENV = "test";
const db = require("../db");
const app = require("../app");
const request = require("supertest");

const {
  getBook,
  createBook,
  generateToken,
  hashPassword,
  getAllBookTransactions,
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

  // Creating Book_Transactions table
  await db.query(`
		CREATE TABLE book_transactions (
			id SERIAL,
			book_id INT NOT NULL,
			user_id INT NOT NULL,
			transaction_date DATE DEFAULT NOW(),
			quantity INT NOT NULL,
      PRIMARY KEY(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(book_id) REFERENCES books(id)
		)
	`);
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

  // Creating Dynamic Demo Transactions
  await db.query(`
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 4
  }, ${Auth.user.id}, 2);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 7
  }, ${Auth.user.id}, 4);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 5
  }, ${Auth.user.id}, 4);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 2
  }, ${Auth.user.id}, 3);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 1
  }, ${Auth.user.id}, 3);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 3
  }, ${Auth.user.id}, 3);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 6
  }, ${Auth.user.id}, 5);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 2
  }, ${Auth.user.id}, 2);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 7
  }, ${Auth.user.id}, 1);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 3
  }, ${Auth.user.id}, 5);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 7
  }, ${Auth.user.id}, 2);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 2
  }, ${Auth.user.id}, 2);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 7
  }, ${Auth.user.id}, 4);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 4
  }, ${Auth.user.id}, 4);
  insert into book_transactions (book_id, user_id, quantity) values (${
    Auth.user.id * 15 - 3
  }, ${Auth.user.id}, 5);
  `);
});

afterEach(async () => {
  await db.query("DELETE FROM book_transactions");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM books");
  await db.query("DELETE FROM employes");
});

afterAll(async () => {
  await db.query("DROP TABLE book_transactions");
  await db.query("DROP TABLE books");
  await db.query("DROP TABLE employes");
  await db.query("DROP TABLE users");
  return db.end();
});

// Get all transactions
describe("GET /transactions", () => {
  test("request with employee token & response returns with the list of all transactions", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", Auth.employee.token);

    expect(response.body.length).toBe(15);
    expect(response.statusCode).toBe(200);
  });
});

// Get No Transactions as normal user
describe("GET /transactions", () => {
  test("request with user token & response returns with message unauthorized", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", Auth.user.token);

    expect(response.body.message).toBe("unauthorized");
    expect(response.statusCode).toBe(401);
  });
});

// Get all purchases of user
describe("GET /transactions/purchase", () => {
  test("request with user token, response returns with all users transactions", async () => {
    const response = await request(app)
      .get("/transactions/purchase")
      .set("Authorization", Auth.user.token);

    expect(response.body.length).toBe(15);
    expect(response.statusCode).toBe(200);
  });
});

// Get all purchases of user with employee token
describe("GET /transactions/purchase", () => {
  test("request with employee token and user id, response returns with all users transactions", async () => {
    const response = await request(app)
      .get("/transactions/purchase")
      .send({ user_id: Auth.user.id })
      .set("Authorization", Auth.employee.token);

    expect(response.body.length).toBe(15);
    expect(response.statusCode).toBe(200);
  });
});

// Get all purchases of user with employee token without sending user id
describe("GET /transactions/purchase", () => {
  test("request with employee token and user id, response returns with all users transactions", async () => {
    const response = await request(app)
      .get("/transactions/purchase")
      .set("Authorization", Auth.employee.token);

    expect(response.body.message).toBe("no user_id");
    expect(response.statusCode).toBe(400);
  });
});

// Create New Transaction
describe("POST /transactions/purchase/:id", () => {
  test("requests with user token and data, response return with new purchase transaction", async () => {
    const newBook = await createBook("newBook", "jd", 300, 200);

    const response = await request(app)
      .post(`/transactions/purchase/${newBook.id}`)
      .set("Authorization", Auth.user.token);

    expect(response.body.message).toBe("transaction & sales update complete");
    expect(response.body.transaction.book_id).toBe(newBook.id);
    expect(response.statusCode).toBe(201);

    // Make Sure transaction is complete
    const transactions = await getAllBookTransactions();
    expect(transactions.length).toBe(16);
    expect(transactions[15].id).toBe(response.body.transaction.id);

    // Make Sure Sales Increased of new book
    const book = await getBook(newBook.id);
    expect(book.sales).toBe(1);
  });
});

// Create transaction with employee return error
describe("POST /transactions/purchase/:id", () => {
  test("requests with user token and data, response return with new purchase transaction", async () => {
    const newBook = await createBook("newBook", "jd", 300, 200);
    const response = await request(app)
      .post(`/transactions/purchase/${newBook.id}`)
      .set("Authorization", Auth.employee.token);

    expect(response.body.message).toBe("unauthorized");
    expect(response.statusCode).toBe(401);

    // Make Sure transaction is not created
    const transactions = await getAllBookTransactions();
    expect(transactions.length).toBe(15);
  });
});
