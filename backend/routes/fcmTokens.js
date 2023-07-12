const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");
const { validate } = require("../models/fcmToken");
const fcmTokenController = require("../controllers/fcmTokenController");

router
  .route("/")
  .post([validator(validate), auth], fcmTokenController.createFcmToken);

module.exports = router;
