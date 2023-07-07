const mongoose = require("mongoose");
const Joi = require("joi");

const announcementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1024,
    },
  },
  { timestamps: true }
);

function validateAnnouncement(announcement) {
  const schema = Joi.object({
    user: Joi.objectId(),
    description: Joi.string().required().min(10).max(1024),
  });

  return schema.validate(announcement);
}

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports.Announcement = Announcement;
module.exports.validate = validateAnnouncement
