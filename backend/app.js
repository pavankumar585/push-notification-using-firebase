const express = require("express");
const app = express();
require("dotenv").config()
require("./config/db")();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
