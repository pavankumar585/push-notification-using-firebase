const pug = require("pug");
const moment = require("moment");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const sendMail = require("../utils/sendMail");
const generateOtp = require("../utils/generateOtp");
const { Otp } = require("../models/otp");

async function getUser(req, res) {
  let user = await User.findById(req.user._id).select("-password");

  res.json({ status: true, date: user });
}

async function getAllUsers(req, res) {
  const users = await User.find().select("-password");
  res.json({ status: true, data: users });
}

async function getOneUser(req, res) {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ status: false, message: "User not found" });

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
  const { email } = req.user;
  const { name, password, email: newEmail } = req.body;

  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ status: false, message: "Invalid token" });

  if (name) {
    await User.updateOne({ email }, { $set: { name } });
    res.json({ status: true, message: "Name updated successfully" });
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });
    res.json({ status: true, message: "Password updated successfully" });
  }

  if (newEmail) {
    const otp = generateOtp();

    await Otp.deleteOne({ email: newEmail });

    const compiledFunction = pug.compileFile("./views/templates/changeEmail.pug");
    const template = compiledFunction({ otp });

    const mailOptions = {
      from: `Yours Truly Pavan <${process.env.AUTH_EMAIL}>`,
      to: newEmail,
      subject: "Change Email",
      html: template,
    };

    const newOtp = new Otp({ email: newEmail, otp });
    newOtp.otp = await bcrypt.hash(newOtp.otp, 10);
    await newOtp.save();

    await sendMail(mailOptions);
    res.json({ status: true, message: "Otp sent successfully" });
  }
}

async function changeEmail(req, res) {
  const { email } = req.user;
  const { email: newEmail, otp } = req.body;

  const matchedOtp = await Otp.findOne({ email: newEmail });
  if (!matchedOtp) return res.status(404).json({ status: false, message: "No otp record found" });

  const isExpired = moment(matchedOtp.expiresIn).isBefore(moment());
  if (isExpired) {
    await Otp.deleteOne({ email: newEmail });
    return res.status(400).json({ status: false, message: "Code has expired. Request for new one",});
  }

  const isValidOtp = await bcrypt.compare(otp, matchedOtp.otp);
  if (!isValidOtp) return res.status(400).json({ status: false,message: "Invalid code passed. Check your inbox",});

  await Otp.deleteOne({ email: newEmail });
  await User.updateOne({ email }, { $set: { email: newEmail } });

  const user = await User.findOne({ email: newEmail }).select("-password");

  const token = user.genAuthToken();

  res.setHeader("Authorization", `Bearer ${token}`);
  res.json({ status: true, data: user });
}

async function deleteUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ status: false, message: "User not found" });

  const isSuperAdmin = user.roles.includes("superAdmin");
  if(isSuperAdmin) return res.status(403).json({ status: false, message: "Access denied" });

  await user.deleteOne()

  res.json({ status: true, message: "User deleted successfully" });
}

async function upgradeUserToAdmin(req, res) {}

async function downgradeAdminToUser(req, res) {}

module.exports.getUser = getUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getOneUser = getOneUser;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.changeEmail = changeEmail;
module.exports.upgradeUserToAdmin = upgradeUserToAdmin;
module.exports.downgradeAdminToUser = downgradeAdminToUser;
