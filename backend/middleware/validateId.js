const mongoose = require("mongoose");

function validateId(req, res, next) {
  const isValidId = mongoose.isValidObjectId(req.params.id);
  if (!isValidId) return res.status(400).json({ status: false, message: "invalid mongo id" });

  next();
}

module.exports = validateId;
