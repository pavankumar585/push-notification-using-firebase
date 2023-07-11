const mongoose = require("mongoose");
const Joi = require("joi");

const fcmTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
    unique: true,
  },
  fcmToken: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
});

function validateFcmToken(fcmToken) {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
    fcmToken: Joi.string().required().min(10).max(255).trim(),
  });

  return schema.validate(fcmToken);
}

const FcmToken = mongoose.model("FcmToken", fcmTokenSchema);

module.exports.FcmToken = FcmToken;
module.exports.validate = validateFcmToken;
