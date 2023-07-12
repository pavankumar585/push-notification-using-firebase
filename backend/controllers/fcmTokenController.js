const { FcmToken } = require("../models/fcmToken");

async function createFcmToken(req, res) {
  const { email } = req.user;
  const { fcmToken } = req.body;

  const recordExisted = await FcmToken.findOne({ email });
  if(recordExisted) {
    const token = await FcmToken.findOneAndUpdate({ email }, { $set: { fcmToken } }, { new: true });
    return res.json({ status: true, data: token });
  }
  
  const token = await FcmToken.create({ email, fcmToken });

  res.status(201).json({ status: true, data: token });
}

module.exports.createFcmToken = createFcmToken;
