const { validate, FcmToken } = require("../models/fcmToken");

async function createFcmToken(req, res) {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const fcmToken = await FcmToken.create(req.body);

    res.status(201).json({ status: true, data: fcmToken });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message })
  }
}

module.exports.createFcmToken = createFcmToken;
