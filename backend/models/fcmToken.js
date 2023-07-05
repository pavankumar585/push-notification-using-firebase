const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const fcmTokenSchema = new mongoose.Schema({
  user_id: {
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
    user_id: Joi.objectId(),
    fcmToken: Joi.string().required().min(10).max(255),
  });

  return schema.validate(fcmToken);
}

const FcmToken = mongoose.model("FcmToken", fcmTokenSchema);

module.exports.FcmToken = FcmToken;
module.exports.validate = validateFcmToken;
