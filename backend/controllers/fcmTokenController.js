const { FcmToken } = require("../models/fcmToken");

async function createFcmToken(req, res) {
  const { email, fcmToken: token } = req.body;
  
  const fcmToken = await FcmToken.create({ email, fcmToken: token });

  res.status(201).json({ status: true, data: fcmToken });
}

module.exports.createFcmToken = createFcmToken;
