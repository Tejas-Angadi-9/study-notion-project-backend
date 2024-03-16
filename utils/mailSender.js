const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        //* Create the transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        //* Send the mail
        let info = await transporter.sendMail({
            from: `Study-Notion - Tejas Angadi`,
            to: email,
            subject: title,
            html: body
        })

        //* Mail sent successfully!
        console.log("Email sent successfully! ", info)
    }
    catch (err) {
        console.log("Failed to send the mail ", err.message)
    }
}

module.exports = mailSender;