const mongoose = require("mongoose");
const moment = require("moment");
const Joi = require("joi");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 6,
  },
  expiresIn: {
    type: Date,
    default: moment().add(30, "seconds"),
  },
});

const Otp = mongoose.model("Otp", otpSchema);

function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().email().required().min(10).max(50),
  });

  return schema.validate(email);
}

module.exports.validate = validateEmail;
module.exports.Otp = Otp;
