const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports.Notification = Notification;
