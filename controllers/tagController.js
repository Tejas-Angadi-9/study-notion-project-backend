const tagModel = require('../models/tagsModel');
const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');

exports.createTag = async (req, res) => {
    try {
        //* Fetch the data
        const { name, description } = req.body;

        //* Validate the details
        if (!name || !description) {
            return res.status(400).json({
                status: 'fail',
                message: 'Fill all the fields'
            })
        }

        const newTag = await tagModel.create({
            name, description
        });

        res.status(201).json({
            status: 'success',
            newTag,
            message: 'New Tag created'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Error occured during creating a new tag',
            message: err.message
        })
    }
}

exports.getAllTags = async (req, res) => {
    try {
        const allTags = await tagModel.find().populate("course").exec();

        res.status(200).json({
            status: 'success',
            results: allTags.length,
            tags: allTags,
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to get all the tags',
            message: err.message
        })
    }
}

exports.updateTag = async (req, res) => {
    try {
        const tagId = req.params.id;
        const { name, description } = req.body;

        if (!tagId) {
            return res.status(404).json({
                status: 'fail',
                message: 'Tag not found!'
            })
        }

        const updatedTag = await tagModel.findByIdAndUpdate(
            { _id: tagId },
            { name: name, description: description },
            { new: true }
        )
            .populate('course').exec();
        console.log('Updated the tag successfully!')

        res.status(201).json({
            status: 'success',
            tag: updatedTag,
            message: 'Updated the tag successfully!'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to delete a tag',
            message: err.message
        })
    }
}

exports.deleteTag = async (req, res) => {
    try {
        const tagId = req.params.id;

        if (!tagId) {
            return res.status(404).json({
                status: 'fail',
                message: 'Enter the Tag ID'
            })
        }

        const deletedTag = await tagModel.findByIdAndDelete(tagId);
        if (!deletedTag) {
            return res.status(404).send('Tag not found!')
        }
        console.log('Deleted a tag successfully!')
        res.status(204).json({
            status: 'success',
            message: 'Deleted a tag successfully!'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to delete a tag',
            message: err.message
        })
    }
}