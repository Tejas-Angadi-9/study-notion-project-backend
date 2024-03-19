const userModel = require('../models/userModel');
const courseModel = require('../models/courseModel');
const tagModel = require('../models/tagsModel');

// import the image uploader function
const { uploadImageToCloudinary } = require('../utils/imageUploader')
require('dotenv').config();
// HANDLER FUNCTION
// CreateCOurse handler function
exports.createCourse = async (req, res) => {
    try {
        //* Fetch the data
        const { courseName, description, WhatYouWillLearn, price, tag } = req.body;

        //* Get the thumbnail photo
        const thumbnail = req.files.thumbnail;
        //* validation
        if (!courseName || !description || !WhatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                status: 'fail',
                message: 'Enter all the fields'
            })
        }

        //* Validate if the instructor is from the valid user or not list or not 
        const userId = req.user.id;
        const instructorDeatils = await userModel.findById(userId);
        //TODO: Verify that userId and instructorDetails._id are same or different? -> WE are getting the same user id and then checking where that user id as instructor id is same or not. Which is not required. As both the id's are same.

        // console.log('Instructor Details: ', instructorDeatils)

        // if (!instructorDeatils) {
        //     return res.status(404).json({
        //         status: 'fail',
        //         message: 'Instructor details not found!'
        //     })
        // }

        //* Check given tag is valid or not
        const tagDetails = await tagModel.findOne({ _id: tag });
        if (!tagDetails) {
            return res.status(404).json({
                status: 'fail',
                message: 'Tag details not found!'
            })
        }

        //* upload thumbnail image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        //* Create an entry of new course
        const newCourse = await courseModel.create({
            courseName,
            description,
            instructor: instructorDeatils._id,
            WhatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        //* Add the new course to the user schema of instructor
        const userData = await userModel.findByIdAndUpdate(
            { _id: instructorDeatils._id },
            { $push: { courses: newCourse._id } },
            { new: true }
        )

        //* Update the tag schema
        await tagModel.findByIdAndUpdate(
            { _id: tagDetails._id },
            { $push: { course: newCourse._id } },
            { new: true }
        )

        //* Return response
        res.status(201).json({
            status: 'success',
            userData,
            message: 'Created a new course'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to create a new course',
            message: err.message,
        })
    }
}

// Get all courses handle function
exports.getCourses = async (req, res) => {
    try {
        console.log('REQ.USER ', req.user)
        const courses = await courseModel.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentEnrolled: true
        })
            .populate('instructor', {
                firstName: true,
                lastName: true
            }).exec()
        // .populate({
        //     path: 'tag',
        //     populate: {
        //         path: 'course',
        //     }
        // })
        // .exec()

        //* Return response 
        res.status(200).json({
            status: 'success',
            results: courses.length,
            courses
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to get all the courses',
            message: err.message,
        })
    }
}