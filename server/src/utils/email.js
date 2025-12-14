const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmail = ({ subject, to, message }) => new Promise((resolve, reject) => {
    const Transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,     // Using existing env var
            pass: process.env.SMTP_PASSWORD   // Using existing env var
        }
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: to,
        subject: subject,
        html: message,
        text: message // Fallback
    };

    Transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending email:", err);
            reject(err);
        } else {
            console.log("Email sent:", info.response);
            resolve(true);
        }
    });
});

module.exports = sendEmail;
