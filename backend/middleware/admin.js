function admin(req, res, next) {
  const isAdmin = req.user.roles.includes("admin");
  if (!isAdmin) return res.status(403).json({ status: false, message: "Access denied" });

  next();
}

module.exports = admin;
