const express = require("express");
const app = express();
require("dotenv").config();
require("./config/db")();
const error = require("./middleware/error");
const fcmTokens = require("./routes/fcmTokens");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/fcmTokens", fcmTokens);

app.use(error)

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
