const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { validate } = require("../models/otp");
const validator = require("../middleware/validator");
const emailVerificationController = require("../controllers/emailVerificationController");

router
  .route("/")
  .post([validator(validateEmail)], emailVerificationController.sendVerificationEmail);

router
  .route("/verify")
  .post([validator(validate)], emailVerificationController.verifyEmail);

function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
  });

  return schema.validate(email);
}

module.exports = router;
