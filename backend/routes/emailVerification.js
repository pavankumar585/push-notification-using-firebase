const Joi = require("joi");
const express = require("express");
const router = express.Router();
const emailVerificationController = require("../controllers/emailVerificationController");
const { validate } = require("../models/otp");
const validator = require("../middleware/validator");

router
  .route("/")
  .post([validator(validateEmail)], emailVerificationController.sendVerificationEmail);

router
  .route("/verify")
  .post([validator(validate)], emailVerificationController.verifyEmail);

function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
  });

  return schema.validate(email);
}

module.exports = router;
