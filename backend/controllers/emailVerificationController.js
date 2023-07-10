const pug = require("pug");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { User } = require("../models/user");
const generateOtp = require("../utils/generateOtp");
const { Otp } = require("../models/otp");
const sendMail = require("../utils/sendMail");

async function sendVerificationEmail(req, res) {
  const otp = generateOtp();
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ status: false, message: "Invalid email" });

  if (user.isVerified) return res.status(400).json({ status: false, message: "Email has already been verified" });

  await Otp.deleteOne({ email });

  const compiledFunction = pug.compileFile("./views/templates/emailVerification.pug");
  const template = compiledFunction({ otp });

  const mailOptions = {
    from: `Yours Truly Pavan <${process.env.AUTH_EMAIL}>`,
    to: email,
    subject: "Email Verification",
    html: template,
  };

  const newOtp = new Otp({ email, otp });
  newOtp.otp = await bcrypt.hash(newOtp.otp, 10);
  await newOtp.save();

  await sendMail(mailOptions);
  res.json({ status: true, message: "Otp sent successfully" });
}

async function verifyEmail(req, res) {
  const { email, otp } = req.body;

  let user = await User.findOne({ email });
  if(!user) return res.status(400).json({ status: false, message: "Invalid email" });

  if(user.isVerified) return res.status(400).json({ status: false, message: "Email has already been verified" });

  const matchedOtp = await Otp.findOne({ email });
  if(!matchedOtp) return res.status(404).json({ status: false, message: "No otp record found" });

  const isExpired = moment(matchedOtp.expiresIn).isBefore(moment());
  if(isExpired) {
    await Otp.deleteOne({ email });
    return res.status(400).json({ status: false, message: "Code has expired. Request for new one" });
  }

  const isValidOtp = await bcrypt.compare(otp, matchedOtp.otp);
  if(!isValidOtp) return res.status(400).json({ status: false, message: "Invalid code passed. Check your inbox" });

  await Otp.deleteOne({ email });
  await User.updateOne({ email }, { $set: { isVerified: true } });
  user = await User.findOne({ email }).select("-password");

  const token = user.genAuthToken();

  res.setHeader("Authorization", `Bearer ${token}`);
  res.json({ status: true, data: user });
}

module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.verifyEmail = verifyEmail;
