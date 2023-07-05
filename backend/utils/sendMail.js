const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.AUTH_EMAIL,
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    refreshToken: process.env.AUTH_REFRESH_TOKEN,
  },
});

async function sendMail(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendMail;
