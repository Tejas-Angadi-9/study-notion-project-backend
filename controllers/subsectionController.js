const sectionModel = require('../models/sectionModel');
const subSectionModel = require('../models/subSectionModel');

const { uploadImageToCloudinary } = require('../utils/imageUploader')

require('dotenv').config();
//* Create a subsection
exports.createSubSection = async (req, res) => {
    try {
        //* Fetch the data such as title, timeDuration, description and sectionId from req.body
        const { title, timeDuration, description, sectionId } = req.body;

        //* Get the video file from the req.files
        const videoFile = req.files.videoFile;

        //* validate the data
        if (!title || !timeDuration || !description || !sectionId || !videoFile) {
            return res.status(400).json({
                status: 'fail',
                message: 'Fill all the fields'
            })
        }

        //* Check whether the section is valid or not ? 
        const exisitingSection = await sectionModel.findById(sectionId);
        if (!exisitingSection) {
            return res.status(404).json({
                status: 'fail',
                message: 'Section not found!'
            })
        }

        //* Upload the video file to cloudinary
        const uploadedVideoFile = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);

        //* save the subsection
        const newSubSection = await subSectionModel.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadedVideoFile.secure_url
        })

        //* push the subsection id into the section array in the section model
        await sectionModel.findByIdAndUpdate(
            sectionId,
            { $push: { subSection: newSubSection._id } },
            { new: true }
        )

        //* Send response
        res.status(201).json({
            status: 'success',
            message: 'Created a new subsection',
            subSection: newSubSection
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to create a subsection inside a section',
            message: err.message,
        })
    }
}

//* Getting all the subsection from a section
exports.getSubSection = async (req, res) => {
    try {
        //* Get the sectionId
        const sectionId = req.body.sectionId;

        //* validate the sectionId
        if (!sectionId) {
            return res.status(400).json({
                status: 'fail',
                message: 'SectionId is missing'
            })
        }

        //* Check whether the sectionId exists or not?
        const exisitingSection = await sectionModel.findById(sectionId, { subSection: true }).populate('subSection').exec();
        if (!exisitingSection) {
            return res.status(404).json({
                status: 'fail',
                message: 'Section not found!'
            })
        }

        //* Get all the subsections from that particular section
        const data = exisitingSection.subSection;

        //* Send response
        res.status(200).json({
            status: 'success',
            results: data.length,
            data
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to get all subsections inside a section',
            message: err.message,
        })
    }
}

//* Update the subsection from the section
exports.updateSubSection = async (req, res) => {
    try {
        //* Get the data such as sectionId, subsectionId, and the data to be updated from the req.body
        const { sectionId, subSectionId, title, timeDuration, description } = req.body;

        // const video = req.files.video;

        //* check if the section & subsection exists or not? 
        const exisitingSection = await sectionModel.findOne(
            { _id: sectionId, subSection: subSectionId }
        );

        if (!exisitingSection) {
            return res.status(500).json({
                status: 'fail',
                message: 'Section/Subsection doesn\'t exist'
            })
        }
        //* update the subsection
        const updatedSubSection = await subSectionModel.findByIdAndUpdate(
            { _id: subSectionId },
            {
                title,
                timeDuration,
                description
            },
            { new: true }
        )

        //* Return response
        res.status(201).json({
            status: 'success',
            section: updatedSubSection,
            message: 'Sub-Section updated successfully!'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to update the subsection',
            message: err.message
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId } = req.body;

        const exisitingSection = await sectionModel.findOne({ _id: sectionId, subSection: subSectionId });
        if (!exisitingSection) {
            return res.status(404).json({
                status: 'fail',
                message: "Invalid Section/sub-section"
            })
        }
        //* Delete the section
        await sectionModel.findByIdAndDelete(subSectionId);

        //* Pull the deleted object ID of the section from the courseContent in courseModel
        const updatedSection = await sectionModel.findOneAndUpdate(
            { _id: sectionId },
            { $pull: { subSection: subSectionId } },
            { new: true }
        )
        //* Send Response
        res.status(204).json({
            status: 'success',
            section: updatedSection,
            message: 'Section deleted successfully!'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to delete the sub-section',
            message: err.message,
        })
    }
}