const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const { validate } = require("../models/fcmToken");
const fcmTokenController = require("../controllers/fcmTokenController");

router
  .route("/")
  .post([validator(validate)], fcmTokenController.createFcmToken);

module.exports = router;
