const { User } = require("../models/user");
const bcrypt = require("bcrypt");

async function getUser(req, res) {
  let user = await User.findById(req.user._id);
  
  user = user.toObject();
  delete user.password;

  res.json({ status: true, date: user });
};

async function getAllUsers(req, res) {
  const users = await User.find().select("-password");
  res.json({ status: true, data: users });
}

async function getOneUser(req, res) {
  const user = await User.findById(req.params.id).select("-password");
  if(!user) return res.status(404).json({ status: false, message: "User not found" });

  res.json({ status: true, data: user });
}

async function createUser(req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ status: false, message: "User already exist" });

  user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  user = user.toObject();
  delete user.password;

  res.status(201).json({ status: true, user });
}

async function updateUser(req, res) {
  res.json({ status: true, message: "data looks good" })
}

async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if(!user) return res.status(404).json({ status: false, message: "User not found" });

  res.json({ status: true, message: "User deleted successfully" });
}

module.exports.getUser = getUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getOneUser = getOneUser
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;