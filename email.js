//email.js
const nodemailer = require('nodemailer');

const emailConfig = {
  from: 'danbis664@gmail.com',
  to: 'bisina06@gmail.com',
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
    text: `${emailConfig.text} ${post.text}. See video here: ${post.video}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


module.exports = sendVideoPostEmail;
