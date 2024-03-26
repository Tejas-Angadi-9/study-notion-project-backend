const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        requird: true
    },
    otp: {
        type: String,
        requird: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

const { mailSender } = require('../utils/mailSender')
const emailTemp = require('../mail/templates/emailVerificationTemplate')

otpSchema.pre('save', async function (next) {
    // const body = `<h2> OTP: ${this.otp} </h2>`
    console.log(this.email)
    await mailSender(this.email, 'Verification Email', emailTemp(this.otp))
    // await mailSender(this.email, "Veification Email", body)
    console.log("Hello from middleware")
    next();
})

module.exports = mongoose.model('OTP', otpSchema)