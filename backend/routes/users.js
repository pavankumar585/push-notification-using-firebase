const Joi = require("joi");
const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const validateId = require("../middleware/validateId");
const { validate } = require("../models/user");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const superAdmin = require("../middleware/superAdmin");
const { validate: otpValidate } = require("../models/otp");

router
  .route("/")
  .get([admin], userController.getAllUsers)
  .post([validator(validate)], userController.createUser);

router
  .route("/:id")
  .get([validateId, admin], userController.getOneUser)
  .patch([validateId, validator(validateRequest), auth], userController.updateUser)
  .delete([validateId, superAdmin], userController.deleteUser);

router.route("/find/me").get([auth], userController.getUser);

router
  .route("/find/change-email")
  .post([validator(otpValidate), auth], userController.changeEmail);

function validateRequest(req) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).trim(),
    email: Joi.string().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
    password: Joi.string().min(5).max(50).trim(),
  }).xor("name", "email", "password");

  return schema.validate(req);
}

module.exports = router;
