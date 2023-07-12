const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

router
  .route("/")
  .get([auth], notificationController.getNotifications)
  .post([auth], notificationController.updateNotifications);

module.exports = router;
