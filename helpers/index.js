require("dotenv").config();
const nodemailer = require("nodemailer");
const sendMail = async (email, title = "Email from Task app", body) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  var mailOptions = {
    from: "shahtanmay13@gmail.com",
    to: email,
    subject: title,
    html: body,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendMail;
