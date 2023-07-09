const mongoose = require("mongoose");
const Joi = require("joi");

const fcmTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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
    user: Joi.objectId(),
    fcmToken: Joi.string().required().min(10).max(255).trim(),
  });

  return schema.validate(fcmToken);
}

const FcmToken = mongoose.model("FcmToken", fcmTokenSchema);

module.exports.FcmToken = FcmToken;
module.exports.validate = validateFcmToken;
