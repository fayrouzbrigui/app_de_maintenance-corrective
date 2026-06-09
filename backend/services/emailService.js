const nodemailer = require("nodemailer");
const { notificationEmail } = require("../templates/notificationEmail");

function createTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

async function sendEmail(notification) {
    try {
         const transporter = createTransporter();
        const text = notificationEmail(notification);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ALERT_EMAIL,
            subject: `[${notification.severity.toUpperCase()}] ${notification.type} Alert`,
            text
        });

        console.log("Email sent");
    } catch (err) {
        console.error("Email error:", err.message);
    }
}

module.exports = { sendEmail };