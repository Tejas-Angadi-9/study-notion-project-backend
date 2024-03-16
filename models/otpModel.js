const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    otp: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

module.exports = mongoose.model('OTP', otpSchema)