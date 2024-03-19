const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    confirmPassowrd: {
        type: String,
        // required: true,
        default: undefined
    },
    image: {
        type: String,
    },
    acountType: {
        type: String,
        enum: ['Admin', 'Student', 'Instructor']
    },
    token: {
        type: String,
        default: undefined
    },
    token_link: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date
    },
    additionalDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    }],
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress"
    }],
})

module.exports = mongoose.model('User', userSchema);