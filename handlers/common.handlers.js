const bcrypt = require("bcrypt");

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
};
