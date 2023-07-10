const pug = require("pug");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { Otp } = require("../models/otp");
const { User } = require("../models/user");
const generateOtp = require("../utils/generateOtp");
const sendMail = require("../utils/sendMail");

async function sendVerificationEmail(req, res) {
  const { email } = req.body;
  const otp = generateOtp();

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ status: false, message: "Invalid email" });

  if (!user.isVerified) return res.status(400).json({ status: false,message: "Email hasn't been verified yet. check your inbox" });

  await Otp.deleteOne({ email });

  const compiledFunction = pug.compileFile("./views/templates/resetPassword.pug");
  const template = compiledFunction({ otp });

  const mailOptions = {
    from: `Yours Truly Pavan ${process.env.AUTH_EMAIL}`,
    to: email,
    subject: "Password Reset",
    html: template,
  };

  const newOtp = new Otp({ email, otp });
  newOtp.otp = await bcrypt.hash(newOtp.otp, 10);
  await newOtp.save()

  await sendMail(mailOptions);
  res.json({ status: true, message: "Otp sent successfully" });
}

async function verifyEmail(req, res) {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ status: false, message: "Invalid email" });

  if(!user.isVerified) return res.status(400).json({ status: false,message: "Email hasn't been verified yet. check your inbox" });

  const matchedOtp = await Otp.findOne({ email });
  if(!matchedOtp) return res.status(404).json({ status: false, message: "No otp record found" });

  const isExpired = moment(matchedOtp.expiresIn).isBefore(moment());
  if(isExpired) {
    await Otp.deleteOne({ email });
    return res.status(400).json({ status: false, message: "Code has expired. Request for new one" })
  } 

  const isValid = await bcrypt.compare(otp, matchedOtp.otp);
  if(!isValid) return res.status(400).json({ status: true, message: "Invalid code passed. Check your inbox" });

  const token = user.genResetToken();

  await Otp.updateOne({ email }, { $set: { token } });

  res.setHeader("x-reset-password-token", `Bearer ${token}`);
  res.json({ status: true, message: "Otp verified successfully" })
}

async function resetPassword(req, res) {
  const { email, token } = req.user;
  const { newPassword } = req.body;

  const matchedOtp = await Otp.findOne({ email });
  if(!matchedOtp) return res.status(400).json({ status: false, message: "No otp record found" });
  
  if(!matchedOtp.token) return res.status(400).json({ status: true, message: "Please verify your otp" });

  if(matchedOtp.token !== token) return res.status(400).json({ status: false, message: "Invalid token" })

  await Otp.deleteOne({ email });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ email }, { $set: { password: hashedPassword } });

  res.json({ status: true, message: "Password changed successfully" });
}

module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.verifyEmail = verifyEmail;
module.exports.resetPassword = resetPassword;
