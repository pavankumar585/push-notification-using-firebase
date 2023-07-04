const mongoose = require("mongoose");

async function db() {
  try {
    const db = process.env.MONGO_URI;

    await mongoose.connect(db);
    console.log(`Connected to ${db}...`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = db;
