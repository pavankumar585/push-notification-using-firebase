const Joi = require("joi");
const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const validateId = require("../middleware/validateId");
const { validate } = require("../models/user");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router
  .route("/")
  .get(userController.getAllUsers)
  .post([validator(validate)], userController.createUser);

router
  .route("/:id")
  .get([validateId], userController.getOneUser)
  .patch([validateId, validator(validateRequest)], userController.updateUser)
  .delete([validateId], userController.deleteUser);

router.route("/find/me").get([auth], userController.getUser);

function validateRequest(req) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).trim(),
    email: Joi.string().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
    password: Joi.string().min(5).max(50).trim(),
  }).xor("name", "email", "password");

  return schema.validate(req);
}

module.exports = router;
