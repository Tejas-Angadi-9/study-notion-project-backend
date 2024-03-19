const profileModel = require('../models/profileModel')
const userModel = require('../models/userModel')

exports.updateProfile = async (req, res) => {
    try {
        //* Fetch the details
        const { gender, dob, about, phoneno } = req.body

        const id = req.user.id;
        if (!id) {
            return res.status(400).send("Some terms are missing")
        }
        //* Check whether this profilemodel exsits or not?
        //* Update the data in the profileModel

        const userDetails = await userModel.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await profileModel.findById(profileId)

        // update the profile
        profileDetails.dob = dob;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.phoneno = phoneno;

        //This makes sure this data will be saved/changes applied
        await profileDetails.save();
        // const data = req.user.id;
        // const user = await userModel.findById(data)
        //     .populate('additionalDetails')
        // .populate({
        //     path: 'courses',
        //     populate: {
        //         path: 'courseContent',
        //         populate: {
        //             path: 'subSection'
        //         }
        //     },
        //     populate: {
        //         path: 'tag'
        //     }
        // })
        // .exec();
        console.log(userDetails)
        //* Send Response
        res.status(201).json({
            status: 'success',
            userDetails
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

        //return res
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