import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text, html) => {
    try {
      // You can use Gmail, Outlook or any SMTP server
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // or your email service
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });
  
      const mailOptions = {
        from: '"FoodOrder" josephjeswin20@gmail.com', 
        to, 
        subject, 
        text, 
        html, 
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  };
  
