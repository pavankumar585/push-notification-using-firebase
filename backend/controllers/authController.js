const bcrypt = require("bcrypt");
const { User } = require("../models/user");

async function auth(req, res) {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ status: false, message: "Invalid email or password" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ status: false, message: "Invalid email or password" });

  const token = user.genAuthToken();

  await User.updateOne({ email }, { $set: { token } });

  user = user.toObject();
  delete user.password;

  res.setHeader("Authorization", `Bearer ${token}`);
  res.json({ status: true, data: user });
}

module.exports.auth = auth;
