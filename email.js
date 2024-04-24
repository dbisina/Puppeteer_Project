const nodemailer = require('nodemailer');

const emailConfig = {
  from: 'danbis664@gmail.com', // Replace with your email address
  to: 'bisina06@gmail.com', // Replace with recipient email address
  subject: 'New post with video from Coindesk',
  text: 'New post with video:',
};

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'lenny.shields62@ethereal.email',
    pass: 'NkdsvEBPEsKqNfuPVh',
  },
});

async function sendVideoPostEmail(post) {
  const mailOptions = {
    ...emailConfig,
    text: `${emailConfig.text} ${post.text}`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendVideoPostEmail;
