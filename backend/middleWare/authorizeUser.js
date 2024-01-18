const jwt = require("jsonwebtoken");
require("dotenv").config();
const { TOKEN_KEY } = process.env;
exports.authurizer = (req, res, next) => {
  try {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];

      const decode = jwt.verify(token, TOKEN_KEY);
      req.user = decode;
      return next(); 
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.log(error);
  }
};
