const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("../middleware/validator");
const authController = require("../controllers/authController");

router.route("/").post([validator(validateAuth)], authController.auth);

function validateAuth(auth) {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
    password: Joi.string().required().min(5).max(50).trim(),
  });

  return schema.validate(auth);
}

module.exports = router;
