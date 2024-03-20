const profileModel = require('../models/profileModel')
const userModel = require('../models/userModel')

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

//* Get all the user accounts
exports.getUser = async (req, res) => {
    try {
        const id = req.user.id;

        const userData = await userModel.findById(id, { password: false, token_link: false, resetPasswordExpires: false, __v: false }).populate('additionalDetails').exec();

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