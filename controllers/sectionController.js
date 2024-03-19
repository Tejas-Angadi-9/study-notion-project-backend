const sectionModel = require('../models/sectionModel');
const courseModel = require('../models/courseModel');

exports.createSection = async (req, res) => {
    try {
        //* Fetch the data
        const sectionName = req.body.sectionName;
        const courseId = req.params.id;
        //* Validate the details
        if (!sectionName) {
            return res.status(400).json({
                status: 'fail',
                message: 'Fill all the fields'
            })
        }

        //* Check whether the course exists or not 
        const exisitingCourse = await courseModel.findById(courseId);
        if(!exisitingCourse){
            return res.status(404).json({
                status: 'fail',
                message: 'Course not found!'
            })
        }

        //* Store the entry in the db
        const sectionData = await sectionModel.create({ sectionName: sectionName, subSection: null })

        //* push the section id in the course content in courseModel
        const updatedCourse = await courseModel.findOneAndUpdate(
            { _id: courseId },
            { $push: { courseContent: sectionData._id } },
            { new: true }
        )
            .populate('instructor')
            .populate('courseContent')
            .exec()

        //* Send Response
        res.status(201).json({
            status: 'success',
            updatedCourse,
            message: 'New section created'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to create a new section',
            message: err.message,
        })
    }
}

//* Get all the section from a particular course
exports.getSection = async (req, res) => {
    try {
        //* get the course id from req.params.id
        const courseId = req.params.id;
        console.log("Course Id ", courseId)
        //* Check whether that course exisits or not
        const exisitingCourse = await courseModel.findById(courseId, { courseContent: true }).populate('courseContent').exec()
        if (!exisitingCourse) {
            return res.status(404).json({
                status: 'fail',
                message: 'Course not found!'
            })
        }
        //* Get all the sections from that course
        const sections = exisitingCourse.courseContent

        //* Send Success response
        res.status(200).json({
            status: "success",
            results: sections.length,
            sections
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: "Failed to get all the sections from the course",
            message: err.message
        })
    }
}

//* Update the section from a particular course
exports.updateSection = async (req, res) => {
    try {
        //* Fetch the data to be updated and the ID of the course and the section from the req.params as courseId & sectionId respectively
        const sectionName = req.body.sectionName;
        const courseId = req.params.courseId;
        const sectionId = req.params.sectionId;

        //* Validate these fetched data
        if (!sectionName) {
            return res.status(400).json({
                status: 'fail',
                message: "Enter the section name to be updated"
            })
        }

        //* Check whether the course exists or not
        const exisitingCourse = await courseModel.findOne({ _id: courseId, courseContent: sectionId });
        if (!exisitingCourse) {
            return res.status(404).json({
                status: 'fail',
                message: "Invalid course/section"
            })
        }

        //* Update the section with the data to be updated and store in the DB
        const updatedSection = await sectionModel.findByIdAndUpdate(
            { _id: sectionId },
            { sectionName: sectionName },
            { new: true }
        )

        //* Send response
        res.status(200).json({
            status: 'success',
            section: updatedSection,
            message: 'Section updated successfully!'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to update the section',
            message: err.message,
        })
    }
}

//* Delete the section from a particular course
exports.deleteSection = async (req, res) => {
    try {
        //* Get the courseID and the sectionID from the req.params
        const courseId = req.params.courseId;
        const sectionId = req.params.sectionId;

        //* Check whether the section exists from that particular course or not
        const exisitingCourse = await courseModel.findOne({ _id: courseId, courseContent: sectionId });
        if (!exisitingCourse) {
            return res.status(404).json({
                status: 'fail',
                message: "Invalid course/section"
            })
        }

        //* Delete the section
        await sectionModel.findByIdAndDelete(sectionId);

        //* Pull the deleted object ID of the section from the courseContent in courseModel
        const updatedCourse = await courseModel.findOneAndUpdate(
            { _id: courseId },
            { $pull: { courseContent: sectionId } },
            { new: true }
        )
        //* Send Response
        res.status(204).json({
            status: 'success',
            section: updatedCourse,
            message: 'Section deleted successfully!'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to delete the section',
            message: err.message,
        })
    }
}
