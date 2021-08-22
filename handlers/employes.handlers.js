const db = require("../db");
const { hashPassword } = require("./common.handlers");

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
};
