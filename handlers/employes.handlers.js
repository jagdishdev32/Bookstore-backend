const db = require("../db");
const { hashPassword } = require("./common.handlers");
const { verifyToken } = require("./token.handlers");

module.exports = {
  getEmployes: async () => {
    const data = await db.query("SELECT * FROM employes");
    const employes = data.rows;

    // Hidding Password from employes
    // employes.map((employee) => (employee.password = "Hidden"));

    return employes;
  },
  getEmployee: async (id) => {
    const data = await db.query("SELECT * FROM employes WHERE id=$1", [id]);
    const employee = data.rows[0];

    // Hidding employee Password
    // employee.password = undefined;

    return employee;
  },
  createEmployee: async (username, password) => {
    try {
      const hashedPassword = await hashPassword(password);
      const data = await db.query(
        "INSERT INTO employes (username, password) VALUES ($1, $2) RETURNING * ",
        [username, hashedPassword]
      );
      const employee = data.rows[0];
      return employee;
    } catch (error) {
      return { message: error.message };
    }
  },
  checkEmployeeLoggedIn: async (req, res, next) => {
    const ACCESS_TOKEN = req.headers.authorization;

    if (ACCESS_TOKEN) {
      const verify = await verifyToken(ACCESS_TOKEN, "employee");
      if (verify) {
        req.employee_id = verify.employee_id;
        req.username = verify.username;
        return next();
      }
    }

    return res.status(401).json({ message: "unauthorized" });
  },
};
