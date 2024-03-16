const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    otp: {
        type: Number
    }
})

module.exports = mongoose.model('OTP', otpSchema)