const profileModel = require('../models/profileModel')
const userModel = require('../models/userModel');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

//* Update profile
exports.updateProfile = async (req, res) => {
    try {
        //* Fetch the details
        const { gender, dob, about, phoneno } = req.body

        const id = req.user.id;
        if (!id) {
            return res.status(400).send("Id is missing")
        }
        //* Check whether this profilemodel exsits or not?
        //* Update the data in the profileModel

        const userDetails = await userModel.findById(id);
        const profileDetails = await profileModel.findByIdAndUpdate(userDetails.additionalDetails, {
            gender: gender,
            dob: dob,
            about: about,
            phoneno: phoneno,
        }, { new: true })

        console.log("Profile Details: ", profileDetails)

        //* Send Response
        res.status(201).json({
            status: 'success',
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to update the profile details',
            message: err.message
        })
    }
}

//* Delete account
exports.deleteAccount = async (req, res) => {
    try {
        //* Get id
        const id = req.user.id;

        //* validate
        const userDetails = await userModel.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: 'fail',
                message: 'User not found!'
            })
        }
        //* Delete profile
        await profileModel.findByIdAndDelete({ _id: userDetails.additionalDetails });
        //* Delete the user
        await userModel.findByIdAndDelete(id);

        //* return res
        res.status(204).json({
            status: 'success',
            message: 'User deleted successfully!'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to delete the user',
            message: err.message
        })
    }
}

//* Get all user Details
exports.getAllUserDetails = async (req, res) => {
    try {

    }
    catch (err) {

    }
}

//* Get all the user accounts
exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;

        const userData = await userModel.findById(id).populate('additionalDetails').exec();

        res.status(200).json({
            status: 'success',
            user: userData
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to get the user details',
            message: err.message
        })
    }
}

//* Update the display picture of the user
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPic = req.files.displayPicture;
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(
            displayPic,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log("Display Pic: ", image)

        //* Update the profile
        const updatedProfile = await userModel.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )

        return res.status(201).json({
            status: 'success',
            message: 'Image updated successfully!',
            profile: updatedProfile,
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            data: 'Failed to update the profile picture',
            message: err.message,
        })
    }
}


//* Get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await userModel.findOne({ _id: userId }).populate('courses').exec();

        if (!userDetails) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found!'
            })
        }

        return res.status(200).json({
            status: 'success',
            data: userDetails.courses,
        })
    }
    catch (err) {
        return res.status(500).json({
            status: 'fail',
            data: 'Failed to get the enrolled courses of the user',
            message: err.message,
        })
    }
}