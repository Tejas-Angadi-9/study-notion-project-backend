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
            allTags,
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