const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
require("dotenv").config();
require("./config/db")();
require("express-async-errors");
const error = require("./middleware/error");
const fcmTokens = require("./routes/fcmTokens");
const users = require("./routes/users");
const auth = require("./routes/auth");
const emailVerification = require("./routes/emailVerification");
const forgotPassword = require("./routes/forgotPassword");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/api/fcm-tokens", fcmTokens);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/email-verification", emailVerification);
app.use("/api/forgot-password", forgotPassword);
app.use(error);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
