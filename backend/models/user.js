const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  roles: [
    {
      type: String,
      default: "user",
    },
  ],
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(4).max(50),
    email: Joi.string().required().email().min(10).max(50),
    password: Joi.string().required().min(5).max(50),
  });

  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.validate = validateUser;
