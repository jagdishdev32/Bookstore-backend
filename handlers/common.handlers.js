const bcrypt = require("bcrypt");

const { verifyToken } = require("./token.handlers");

module.exports = {
  hashPassword: async (password, salt = 1) => {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },
  verifyPassword: async (password, hashedPassword) => {
    try {
      const verify = await bcrypt.compare(password, hashedPassword);
      return verify;
    } catch (error) {
      return false;
      // return { message: error.message}
    }
  },
  checkNotIncludeBadCharaters: async (word) => {
    const badChars = ["/", "|", "-", "--", "'", '"', "//"];
    for (let i = 0; i < badChars.length; i++) {
      if (word.includes(badChars[i])) {
        return false;
      }
    }
    return true;
  },
  checkAnyLoggedIn: async (req, res, next) => {
    const ACCESS_TOKEN = req.headers.authorization;

    if (ACCESS_TOKEN) {
      // Checking For Employee
      const employeeVerify = await verifyToken(ACCESS_TOKEN, "employee");
      if (employeeVerify) {
        req.employee_id = employeeVerify.employee_id;
        req.username = employeeVerify.username;
        return next();
      }
      // Checking For User
      const userVerify = await verifyToken(ACCESS_TOKEN);
      if (userVerify) {
        req.user_id = userVerify.user_id;
        req.username = userVerify.username;
        return next();
      }
    }

    return res.status(401).json({ message: "unauthorized" });
  },
};
