const Pool = require("pg").Pool;
const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.NODE_ENV == "test" ? process.env.DB_TEST : process.env.DB_DATABASE,
	port: process.env.DB_PORT
})

module.exports = pool;