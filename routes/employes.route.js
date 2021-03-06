const router = require("express").Router();
const db = require("../db");
const {
  createEmployee,
  checkNotIncludeBadCharaters,
  verifyPassword,
  generateToken,
} = require("../handlers");

// METH		GET	/employes/
// DESC		Get all employes
// ACCESS	public
router.get("/", (req, res) => {
  return res.status(200).json({ message: "employes here" });
});

const EMPLOYEE_REGISTRATION_ENABLED =
  process.env.EMPLOYEE_REGISTRATION_ENABLED || false;

// METH		POST /employes/register
// DESC		Register employes
// ACCESS	public
// CONDITION  Check if enabled in Env file
if (EMPLOYEE_REGISTRATION_ENABLED == "true") {
  console.log("Employes Registration Enabled");
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
}
// METH		POST /employes/login
// DESC		Login employes (return access token and employee)
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

    // If employee exists
    if (employee.length > 0) {
      const passMatch = await verifyPassword(password, employee[0].password);
      // If password is correct
      if (passMatch) {
        const token = await generateToken(
          {
            username: employee[0].username,
            employee_id: employee[0].id,
          },
          "employee"
        );
        return res.status(200).json({ access_token: token });
      }
    }
  }

  return res.status(400).json({ message: "Invalid Details" });
});

module.exports = router;
