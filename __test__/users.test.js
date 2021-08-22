process.env.NODE_ENV = "test";
const db = require("../db");
const app = require("../app");
const request = require("supertest");

const { hashPassword, getUsers } = require("../handlers");

beforeAll(async () => {
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
  const hashedPassword = await hashPassword("secret");
  await db.query(
    "INSERT INTO users (username, password, name) VALUES ($1, $2, $3)",
    ["testuser", hashedPassword, "testname"]
  );
});

afterEach(async () => {
  await db.query("DELETE FROM users");
});

afterAll(async () => {
  await db.query("DROP TABLE users");
  return db.end();
});

// User Home Page
describe("GET /users/", () => {
  test("request response with message (users here)", async () => {
    const response = await request(app).get("/users/");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("users here");
  });
});

// Register User
describe("POST /users/register", () => {
  test("request response with message and user", async () => {
    const response = await request(app).post("/users/register").send({
      username: "newUser",
      password: "password",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User Registered...");
    expect(response.body.user.username).toBe("newUser");

    // Make Sure User Added
    const users = await getUsers();

    expect(users.length).toBe(2);
    expect(users[1].username).toBe("newUser");
  });
});

// Register User With Existing User Name
describe("POST /users/register", () => {
  test("request response with error message", async () => {
    const newUser = await request(app).post("/users/register").send({
      username: "newUser",
      password: "password",
    });

    expect(newUser.statusCode).toBe(201);
    expect(newUser.body.message).toBe("User Registered...");
    expect(newUser.body.user.username).toBe("newUser");

    const anotherUser = await request(app).post("/users/register").send({
      username: "newUser",
      password: "password",
    });

    expect(anotherUser.statusCode).toBe(400);
    expect(anotherUser.body.message);

    // Make Sure User Was Not Added
    const users = await getUsers();

    expect(users.length).toBe(2);
    expect(users[1].username).toBe("newUser");
  });
});

// Login Route With Correct Details
describe("POST /users/login", () => {
  test("request with correct credentials and response return access token", async () => {
    // Creating User For test
    const newUser = await request(app).post("/users/register").send({
      username: "newUser",
      password: "password",
    });

    expect(newUser.statusCode).toBe(201);
    expect(newUser.body.message).toBe("User Registered...");
    expect(newUser.body.user.username).toBe("newUser");

    // Make Sure User Added
    const users = await getUsers();
    expect(users.length).toBe(2);
    expect(users[1].username).toBe("newUser");

    const response = await request(app).post("/users/login").send({
      username: "newUser",
      password: "password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.access_token).toBeDefined();
    expect(response.body.message).toBeUndefined();
  });
});

// Login Route With Wrong Details
describe("POST /users/login", () => {
  test("request with wrong credentials and response return message invalid details", async () => {
    // Creating User For test
    const newUser = await request(app).post("/users/register").send({
      username: "newUser",
      password: "password",
    });

    expect(newUser.statusCode).toBe(201);
    expect(newUser.body.message).toBe("User Registered...");
    expect(newUser.body.user.username).toBe("newUser");

    // Make Sure User Added
    const users = await getUsers();
    expect(users.length).toBe(2);
    expect(users[1].username).toBe("newUser");

    const response = await request(app).post("/users/login").send({
      username: "newUser",
      password: "passworda",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid Details");
    expect(response.body.access_token).toBeUndefined();
  });
});
