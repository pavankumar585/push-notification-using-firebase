const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validator = require("../middleware/validator"); 
const validateId = require("../middleware/validateId"); 
const { validate } = require("../models/announcement");
const admin = require("../middleware/admin");
const announcementcontroller = require("../controllers/announcementController");

router
  .route("/:id")
  .put([validateId, validator(validate), auth, admin], announcementcontroller.updateAnnouncement) 
  .delete([validateId, auth, admin], announcementcontroller.deleteAnnouncement);

router
  .route("/")
  .get([auth], announcementcontroller.getAnnouncements)
  .post([validator(validate), auth, admin], announcementcontroller.createAnnouncement);

module.exports = router;
