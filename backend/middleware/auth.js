const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];

  if (!token) return res.status(401).json({ status: false, message: "Access denied. No token Provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      return res.status(400).json({status: false, expired: true, message: "Token has expired" });

    res.status(400).json({ status: false, message: "Invalid token" });
  }
}

module.exports = auth;
