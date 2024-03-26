const userModel = require('../models/userModel');
const courseModel = require('../models/courseModel');
const categoryModel = require('../models/categoryModel');

// import the image uploader function
const { uploadImageToCloudinary } = require('../utils/imageUploader')
require('dotenv').config();
// HANDLER FUNCTION
// CreateCOurse handler function
exports.createCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        //* Fetch the data
        const { courseName, description, WhatYouWillLearn, price, tag, category, status, instructions } = req.body;

        //* Get the thumbnail photo
        const thumbnail = req.files.thumbnailImage;

        //* validation
        if (!courseName || !description || !WhatYouWillLearn || !price || !tag || !thumbnail || !category) {
            return res.status(400).json({
                status: 'fail',
                message: 'Enter all the fields'
            })
        }

        //* Validate if the instructor is from the valid user or not list or not 
        const instructorDeatils = await userModel.findById(userId, {
            accountType: "Instructor"
        });
        //TODO: Verify that userId and instructorDetails._id are same or different? -> WE are getting the same user id and then checking where that user id as instructor id is same or not. Which is not required. As both the id's are same.

        if (!status || status === undefined) {
            status = "Draft";
        }
        // console.log('Instructor Details: ', instructorDeatils)

        if (!instructorDeatils) {
            return res.status(404).json({
                status: 'fail',
                message: 'Instructor details not found!'
            })
        }

        //* Check given tag is valid or not
        const categoryDetails = await categoryModel.findOne(category);
        if (!categoryDetails) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category details not found!'
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
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instrcutions: instrcutions
        })

        //* Add the new course to the user schema of instructor
        const userData = await userModel.findByIdAndUpdate(
            { _id: instructorDeatils._id },
            { $push: { courses: newCourse._id } },
            { new: true }
        )

        //* Update the Category schema
        await categoryModel.findByIdAndUpdate(
            { _id: category },
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
exports.getAllCourses = async (req, res) => {
    try {

        const courses = await courseModel.find(
            {},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentEnrolled: true
            })
            .populate({
                path: 'instructor',
            })
            .exec()

        if (!courses) {
            return res.status(404).json({
                status: 'fail',
                message: 'Course not found!'
            })
        }

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

// Get a single course handle function
exports.getCourseDetails = async (req, res) => {
    try {
        const courseId = req.body.courseId;

        if (!courseId) {
            return res.status(404).send("Course Id is missing!")
        }
        const course = await courseModel.findById(courseId)
            .populate({
                path: 'instructor',
                populate: {
                    path: 'additionalDetails'
                }
            })
            .populate('category')
            .populate('ratingAndReviews')
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })
            .exec()

        if (!course) {
            return res.status(404).json({
                status: 'fail',
                message: 'Course not found!'
            })
        }

        //* Return response 
        res.status(200).json({
            status: 'success',
            course
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