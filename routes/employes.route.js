const router = require("express").Router();
const db = require("../db");
const {
  createEmployee,
  checkNotIncludeBadCharaters,
  verifyPassword,
  generateToken,
} = require("../handlers");

// METH		GET	/employee/
// DESC		Get all employes
// ACCESS	public
router.get("/", (req, res) => {
  return res.status(200).json({ message: "employes here" });
});

// METH		POST /employee/register
// DESC		Register employee
// ACCESS	public
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const employee = await createEmployee(username, password);

  //   Error Handling
  if (employee.message) {
    return res.status(400).json({ message: employee.message });
  }

  return res.status(201).json({
    message: "employee Registered...",
    employee: { ...employee, password: undefined },
  });
});

// METH		POST /employee/login
// DESC		Login employee (return access token and employee)
// ACCESS	public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    username &&
    password &&
    checkNotIncludeBadCharaters(username) &&
    checkNotIncludeBadCharaters(password)
  ) {
    const data = await db.query("SELECT * FROM employes WHERE username=$1", [
      username,
    ]);

    const employee = data.rows;

    // //TEST
    // return res.json({ employee, username, password });

    // If employee exists
    if (employee.length > 0) {
      const passMatch = await verifyPassword(password, employee[0].password);
      // If password is correct
      if (passMatch) {
        const token = await generateToken({
          username: employee[0].username,
          employee_id: employee[0].id,
        });
        return res.status(200).json({ access_token: token });
      }
    }
  }

  return res.status(400).json({ message: "Invalid Details" });
});

module.exports = router;
