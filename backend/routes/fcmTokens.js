const express = require("express");
const router = express.Router();
const fcmTokenController = require("../controllers/fcmTokenController");

router.route("/").post(fcmTokenController.createFcmToken);

module.exports = router;
