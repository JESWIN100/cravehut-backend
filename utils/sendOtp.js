import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login OTP',
    text: `Your OTP for login is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(message);
};
