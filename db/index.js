// For Testing Checks beforeAll, beforeEach, afterEach, afterAll functions
require("dotenv").config();

// const connectionString = process.env.CONNECTION_STRING
//   ? process.env.CONNECTION_STRING
//   : undefined;

const connectionString = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : undefined;

const poolObject = connectionString
  ? { connectionString, ssl: true }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database:
        process.env.NODE_ENV == "test"
          ? process.env.DB_TEST
          : process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    };

const Pool = require("pg").Pool;
// const pool = new Pool({
//   connectionString: connectionString,
// });
const pool = new Pool(poolObject);

module.exports = pool;
