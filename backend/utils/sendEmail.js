const nodemailer = require("nodemailer");

exports.sendEmail = async ({ ...input }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  console.log(input.message);
  const messageOptions = {
    from: process.env.SMTP_EMAIL,
    to: input.to,
    text: input.message,
    subject: input.subject,
  };

  await transporter.sendMail(messageOptions);
};
