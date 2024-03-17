const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    otp: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

const { mailSender } = require('../utils/mailSender')

otpSchema.pre('save', async function (next) {
    const body = `<h2> OTP: ${this.otp} </h2>`
    await mailSender(this.email, "Veification Email", body)
    next();
})

module.exports = mongoose.model('OTP', otpSchema)