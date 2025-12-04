// src/utils/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendContactEmail({ name, email, phone, message }) {
  const mailOptions = {
    from: `${name} <${email}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: `Contact form message from ${name}`,
    text: `
New contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
    `,
    html: `
      <h3>New contact form submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
