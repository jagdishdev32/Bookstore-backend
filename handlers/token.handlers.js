const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const EMPLOYEE_ACCESS_TOKEN_SECRET = process.env.EMPLOYEE_ACCESS_TOKEN_SECRET;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "1h";

module.exports = {
  generateToken: async (data, owner = "user") => {
    let token;
    if (owner == "employee") {
      token = await jwt.sign(data, EMPLOYEE_ACCESS_TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRES_IN,
      });
    } else {
      token = await jwt.sign(data, ACCESS_TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRES_IN,
      });
    }
    return token;
  },
  verifyToken: async (token, owner = "user") => {
    try {
      if (owner == "employee") {
        const verify = await jwt.verify(token, EMPLOYEE_ACCESS_TOKEN_SECRET);
        return verify;
      } else {
        const verify = await jwt.verify(token, ACCESS_TOKEN_SECRET);
        return verify;
      }
    } catch (error) {
      return false;
    }
  },
};
