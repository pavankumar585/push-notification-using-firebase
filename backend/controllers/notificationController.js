const { Notification } = require("../models/notification");

async function getNotifications(req, res) {
  const { email } = req.user;

  const notifications = await Notification.find({ email });

  res.json({ status: true, data: notifications });
}

async function updateNotifications(req, res) {
  const { email } = req.user;

  await Notification.updateMany({ email }, { $set: { isRead: true } });

  res.json({ status: true, message: "Updated successfully" });
}

module.exports.getNotifications = getNotifications;
module.exports.updateNotifications = updateNotifications;
