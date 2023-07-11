const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { validate } = require("../models/otp");
const validator = require("../middleware/validator");
const authReset = require("../middleware/authReset");
const forgotPasswordController = require("../controllers/forgotPasswordController");

router
    .route("/")
    .post([validator(validateEmail)], forgotPasswordController.sendVerificationEmail);

router
  .route("/verify")
  .post([validator(validate)], forgotPasswordController.verifyEmail);

router
  .route("/reset")
  .post([validator(validatePassword), authReset], forgotPasswordController.resetPassword);

function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
  });

  return schema.validate(email);
}

function validatePassword(password) {
  const schema = Joi.object({
    newPassword: Joi.string().required().min(5).max(50).trim(),
    confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")),
  });

  return schema.validate(password);
}

module.exports = router;
