const { Announcement } = require("../models/announcement");
const { Notification } = require("../models/notification");
const { sendNotification } = require("../config/firebase");
const { FcmToken } = require("../models/fcmToken");

async function getAnnouncements(req, res) {
  const announcements = await Announcement.find();

  res.json({ status: true, data: announcements });
}

async function createAnnouncement(req, res) {
  const { email } = req.user;

  const announcement = await Announcement.create({ email, ...req.body });

  const fcmTokens = await FcmToken.find({ email: { $ne: email } });

  const tokens = fcmTokens.map((token) => token.fcmToken);

  if(tokens.length > 0) {
    const body = {
      title: "New Announcement Created",
      message: `User ${email} created an announcemet`,
    };

    const emails = fcmTokens.map((fcmToken) => fcmToken.email);

    await Promise.all(emails.map((email) => Notification.create({ email, ...body })));

    await sendNotification(body, tokens);
  }

  res.json({ status: true, data: announcement });
}

async function updateAnnouncement(req, res) {
  const { email } = req.user;
  const { title, description } = req.body;

  let announcement = await Announcement.findById(req.params.id);
  if(!announcement) return res.status(404).json({ status: false, message: "Announcement not found" });

  if(email !== announcement.email) return res.status(403).json({ status: false, message: "Access denied" });

  announcement = await Announcement.findOneAndUpdate({ _id: req.params.id }, { $set: { email, title, description } }, { new: true });

  const fcmTokens = await FcmToken.find({ email: { $ne: email } });

  const tokens = fcmTokens.map((token) => token.fcmToken);

  if(tokens.length > 0) {
    const body = {
      title: "Announcement updated",
      message: `User ${email} updated an announcemet`,
    };

    const emails = fcmTokens.map((fcmToken) => fcmToken.email);

    await Promise.all(emails.map((email) => Notification.create({ email, ...body })));

    await sendNotification(body, tokens);
  }

  res.json({ status: true, data: announcement });
}

async function deleteAnnouncement(req, res) {
  const { email, roles } = req.user;

  const announcement = await Announcement.findById(req.params.id);
  if(!announcement) return res.status(404).json({ status: false, message: "Announcement not found" });

  if(email !== announcement.email && !roles.includes("superAdmin")) return res.status(403).json({ status: false, message: "Access denied" });
  
  await announcement.deleteOne();

  const fcmTokens = await FcmToken.find({ email: { $ne: email } });

  const tokens = fcmTokens.map((token) => token.fcmToken);

  if(tokens.length > 0) {
    const body = {
      title: "Announcement Deleted",
      message: `User ${email} deleted an announcemet`,
    };

    const emails = fcmTokens.map((fcmToken) => fcmToken.email);

    await Promise.all(emails.map((email) => Notification.create({ email, ...body })));

    await sendNotification(body, tokens);
  }

  res.json({ status: true, message: "Announcement deleted successfully" })
}

module.exports.getAnnouncements = getAnnouncements;
module.exports.createAnnouncement = createAnnouncement;
module.exports.updateAnnouncement = updateAnnouncement;
module.exports.deleteAnnouncement = deleteAnnouncement;
