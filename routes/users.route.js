const router = require("express").Router();
const db = require("../db");
const {
  createUser,
  checkNotIncludeBadCharaters,
  verifyPassword,
  generateToken,
} = require("../handlers");

// METH		GET	/user/
// DESC		Get User Route
// ACCESS	public
router.get("/", (req, res) => {
  db.query("SELECT * FROM users")
    .then((users) => {
      return res.status(200).json({ message: "users here", users: users });
    })
    .catch((error) => res.status(200).send({ error: error }));
});

// METH		POST /user/register
// DESC		Register User
// ACCESS	public
router.post("/register", async (req, res) => {
  const { username, password, name, age, address, phone_no } = req.body;

  const user = await createUser(
    username,
    password,
    name,
    age,
    address,
    phone_no
  );

  //   Error Handling
  if (user.message) {
    return res.status(400).json({ message: user.message });
  }

  return res.status(201).json({
    message: "User Registered...",
    user: { ...user, password: undefined },
  });
});

// METH		POST /user/login
// DESC		Login User (return access token and user)
// ACCESS	public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    username &&
    password &&
    checkNotIncludeBadCharaters(username) &&
    checkNotIncludeBadCharaters(password)
  ) {
    const data = await db.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    const user = data.rows;

    // If user exists
    if (user.length > 0) {
      const passMatch = await verifyPassword(password, user[0].password);
      // If password is correct
      if (passMatch) {
        const token = await generateToken(
          {
            username: user[0].username,
            user_id: user[0].id,
          },
          (owner = "user")
        );
        return res.status(200).json({ access_token: token });
      }
    }
  }

  return res.status(400).json({ message: "Invalid Details" });
});

module.exports = router;
