const db = require("../db");
const { hashPassword } = require("./common.handlers");
const { verifyToken } = require("./token.handlers");

module.exports = {
  getUsers: async () => {
    const data = await db.query("SELECT * FROM users");
    const users = data.rows;

    // Hidding Password from users
    // users.map((user) => (user.password = "Hidden"));

    return users;
  },
  getUser: async (id) => {
    const data = await db.query("SELECT * FROM users WHERE id=$1", [id]);
    const user = data.rows[0];

    // Hidding User Password
    // user.password = undefined;

    return user;
  },
  createUser: async (username, password, name, age, address, phone_no) => {
    try {
      const hashedPassword = await hashPassword(password);
      const data = await db.query(
        "INSERT INTO users (username, password, name, age, address, phone_no) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ",
        [username, hashedPassword, name, age, address, phone_no]
      );
      const user = data.rows[0];
      return user;
    } catch (error) {
      return { message: error.message };
    }
  },
  checkUserLoggedIn: async (req, res, next) => {
    const ACCESS_TOKEN = req.headers.authorization;

    if (ACCESS_TOKEN) {
      const verify = await verifyToken(ACCESS_TOKEN);
      if (verify) {
        req.user_id = verify.user_id;
        req.username = verify.username;
        return next();
      }
    }

    return res.status(401).json({ message: "unauthorized" });
  },
};
