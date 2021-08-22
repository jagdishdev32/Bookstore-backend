process.env.NODE_ENV = "test";
const db = require("../db");
const app = require("../app");
const request = require("supertest");

const { hashPassword, getEmployes, createEmployee } = require("../handlers");

const Auth = {};

beforeAll(async () => {
  await db.query(
    `CREATE TABLE employes (
		id SERIAL PRIMARY KEY,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL UNIQUE
		)`
  );
  console.log("Created Table");
});

beforeEach(async () => {
  const hashedPassword = await hashPassword("secret");
  await db.query("INSERT INTO employes (username, password) VALUES ($1, $2)", [
    "testemployee",
    hashedPassword,
  ]);
});

afterEach(async () => {
  await db.query("DELETE FROM employes");
});

afterAll(async () => {
  await db.query("DROP TABLE employes");
  return db.end();
});

// employee Home Page
describe("GET /employes/", () => {
  test("request response with message (employes here)", async () => {
    const response = await request(app).get("/employes/");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("employes here");
  });
});

// Login Route With Correct Details
describe("POST /employes/login", () => {
  test("request with correct credentials and response return access token", async () => {
    // Creating employee For test
    const newEmployee = await createEmployee("newEmployee", "password");

    // Make Sure employee Added
    const employes = await getEmployes();
    expect(employes.length).toBe(2);
    expect(employes[1].username).toBe("newEmployee");

    const response = await request(app).post("/employes/login").send({
      username: "newEmployee",
      password: "password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.access_token).toBeDefined();
    expect(response.body.message).toBeUndefined();
  });
});

// Login Route With Wrong Details
describe("POST /employes/login", () => {
  test("request with wrong credentials and response return message invalid details", async () => {
    // Creating employee For test
    const newEmployee = await createEmployee("newEmployee", "password");

    // Make Sure employee Added
    const employes = await getEmployes();
    expect(employes.length).toBe(2);
    expect(employes[1].username).toBe("newEmployee");

    const response = await request(app).post("/employes/login").send({
      username: "newEmployee",
      password: "passworda",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid Details");
    expect(response.body.access_token).toBeUndefined();
  });
});
