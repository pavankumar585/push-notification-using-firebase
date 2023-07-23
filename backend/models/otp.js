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
    maxlength: 255,
  },
  expiresIn: {
    type: Date,
    default: function () {
      return moment().add(30, "seconds");
    },
  },
  token: String,
});

const Otp = mongoose.model("Otp", otpSchema);

function validateOtp(otp) {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
    otp: Joi.string().required().min(4).max(6).trim(),
  });

  return schema.validate(otp);
}

module.exports.validate = validateOtp;
module.exports.Otp = Otp;
