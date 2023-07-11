const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
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
    roles: {
      type: [String],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.methods.genAuthToken = function () {
  const privateKey = process.env.JWT_PRIVATE_KEY;
  const { _id, email, roles } = this;

  return jwt.sign({ _id, email, roles }, privateKey, { expiresIn: "5d" });
};

userSchema.methods.genResetToken = function () {
  const privateKey = process.env.JWT_PRIVATE_KEY2;

  return jwt.sign({ email: this.email }, privateKey, { expiresIn: "1d" });
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(4).max(50).trim(),
    email: Joi.string().required().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
    password: Joi.string().required().min(5).max(50).trim(),
  });

  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.validate = validateUser;
