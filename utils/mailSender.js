const nodemailer = require('nodemailer');
require('dotenv').config();

exports.mailSender = async (mail, subject, body) => {
    //* Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    })

    //* Send Mail
    let info = await transporter.sendMail({
        from: 'StudyNotion | Tejas Angadi',
        to: mail,
        subject: subject,
        html: body
    })

    //* Mail sent successfully!
    console.log("Mail sent successfully!\nInfo: ", info);
}