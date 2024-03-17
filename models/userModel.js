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
    // confirmPassowrd: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    image: {
        type: String,
    },
    acountType: {
        type: String,
        enum: ['Admin', 'Student', 'Instructor']
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
    token: {
        type: String,
        default: undefined
    }
})

module.exports = mongoose.model('User', userSchema);