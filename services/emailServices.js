const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

const sendFormSubmissionNotification = (formData) => {
  const { name, email, subject, phoneNumber, message } = formData;

  const notificationSubject = "New Form Submission";
  const notificationText = `
    New form submission received:
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    Phone Number: ${phoneNumber}
    Message: ${message}
  `;

  return sendEmail(
    process.env.EMAIL_USER,
    notificationSubject,
    notificationText
  );
};

module.exports = {
  sendEmail,
  sendFormSubmissionNotification,
};
