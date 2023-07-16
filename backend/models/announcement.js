const mongoose = require("mongoose");
const Joi = require("joi");

const announcementSchema = new mongoose.Schema(
  {
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
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1024,
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

function validateAnnouncement(announcement) {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(100).trim(),
    description: Joi.string().required().min(10).max(1024).trim(),
  });

  return schema.validate(announcement);
}

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports.Announcement = Announcement;
module.exports.validate = validateAnnouncement;
