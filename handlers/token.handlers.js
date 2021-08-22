const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports = {
  generateToken: async (data) => {
    const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "1h";
    const token = await jwt.sign(data, ACCESS_TOKEN_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });
    return token;
  },
};
