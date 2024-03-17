const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    description: {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    WhatYouWillLearn: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReviews"
    }],
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    studentEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
})

module.exports = mongoose.model('Course', courseSchema);