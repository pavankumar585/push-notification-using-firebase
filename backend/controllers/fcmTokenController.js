const { FcmToken } = require("../models/fcmToken");

async function createFcmToken(req, res) {
  const fcmToken = await FcmToken.create(req.body);

  res.status(201).json({ status: true, data: fcmToken });
}

module.exports.createFcmToken = createFcmToken;
