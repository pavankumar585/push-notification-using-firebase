const jwt = require("jsonwebtoken");

async function authReset(req, res, next) {
  const authorization = req.headers["x-reset-password-token"];
  const token = authorization && authorization.split(" ")[1];

  if (!token) return res.status(401).json({ status: false, message: "Access denied. No token Provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY2);
    req.user = decoded;
    req.user.token = token;

    next();
  } catch (error) {
    res.status(400).json({ status: false, message: "Invalid token" });
  }
}

module.exports = authReset;