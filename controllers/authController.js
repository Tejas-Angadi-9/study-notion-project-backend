const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken')

const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel')
const profileModel = require('../models/profileModel')

require('dotenv').config();

// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        //* Fetch the email from req.body
        const { email } = req.body;

        //* Check if the user already exists
        const exisitingUser = await userModel.findOne({ email });

        //* If yes, then return
        if (exisitingUser) {
            return res.status(409).json({
                status: 'fail',
                message: 'User already exists.'
            })
        }

        //* Generate the otp with the help of the otp Generator in helper function
        function generateOTP() {
            return otpGenerator.generate(6,
                {
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false
                })
        }

        var newOTP = generateOTP();
        //* Check if the OTP is unique or not
        var exisitingOTP = await otpModel.findOne({ otp: newOTP })

        while (exisitingOTP) {
            newOTP = generateOTP();
            exisitingOTP = await otpModel.findOne({ otp: newOTP })
        }

        //* Store the OTP in the DB
        const storingOTP = await otpModel.create({ email: email, otp: newOTP });

        console.log("OTP Stored successfully! ", storingOTP);

        res.status(201).json({
            status: 'success',
            message: 'OTP sent successfully!'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to create a new OTP',
            message: err.message
        })
    }
}

// Signup
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassowrd, phoneNumber, acountType, otp } = req.body;

        //* validate all the data
        if (!firstName || !lastName || !email || !password || !confirmPassowrd || !phoneNumber || !acountType || !otp) {
            return res.status(400).json({
                status: 'fail',
                message: 'Fill all the fields'
            })
        }

        //* validate the password and confirmPassword
        if (password !== confirmPassowrd) {
            return res.status(400).json({
                status: 'fail',
                message: 'Passwords doesn\'t match'
            })
        }

        //* Check if the user already exists
        const exisitingUser = await userModel.findOne({ email: email });
        if (exisitingUser) {
            return res.status(409).json({
                status: 'fail',
                message: 'User already exists. Please Login :)'
            })
        }

        //Find most recent OTP stored for the user -> As there can be multiple OTP's generated
        const recentOTP = await otpModel.findOne({ email }).sort({ createdAt: -1 }).limit(1)
        console.log("recent OTP: ", recentOTP)
        // validate the OTP
        if (recentOTP.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'OTP not found'
            })
        }
        else if (otp !== recentOTP.otp) {
            // INVALID OTP
            return res.status(409).json({
                status: 'fail',
                message: 'Invalid OTP'
            })
        }

        //* Hash the password using Bcrypt
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed successfully: ', hashedPassword)
        }
        catch (err) {
            console.log('Error occured during hashing the password ', err.message)
        }

        //* Store this entry in the DB
        const profileDetails = await profileModel.create({
            gender: null,
            dob: null,
            about: null,
            phoneno: phoneNumber
        })

        const result = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            acountType,
            image: `https://api.dicebear.com/8.x/initials/svg?seed=${firstName}%20${lastName}`,
            additionalDetails: profileDetails
        })

        console.log('New user created ', result);

        res.status(201).json({
            status: 'success',
            result,
            message: 'Created a new user'
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to create a new user',
            message: err.message
        })
    }
}

// Login
exports.login = async (req, res) => {
    try {

        // fetch the data
        const { email, password } = req.body;

        // validate the data
        if (!email || !password) {
            return res.status(400).send('Fill all the fields')
        }

        // Check if the user is already registered or not
        const exisitingUser = await userModel.findOne({ email });
        if (!exisitingUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'User is not registered. Please Signup'
            })
        }

        //* Check if the entered password matches the db password
        const response = await bcrypt.compare(password, exisitingUser.password);
        if (!response) {
            return res.status(400).json({
                status: 'fail',
                message: 'Bad Credentials!'
            })
        }

        // Create a token
        const payload = {
            _id: exisitingUser._id,
            firstName: exisitingUser.firstName,
            lastName: exisitingUser.lastName,
            email: exisitingUser.email,
            password: exisitingUser.password,
            image: exisitingUser.image,
            accountType: exisitingUser.acountType,
            additionalDetails: exisitingUser.additionalDetails,
            courses: exisitingUser.courses,
            courseProgress: exisitingUser.courseProgress
        }

        let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })
        if (!token) {
            return res.status(404).json({
                status: 'fail',
                message: 'Token not found'
            })
        }
        exisitingUser.token = token;
        exisitingUser.password = undefined
        console.log("TOKEN: ", token);

        //* Sending the cookie back to the client
        const options = {
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.cookie("token", token, options).status(200).json({
            status: 'success',
            message: 'Logged In successfully!',
            exisitingUser,
        })
    }
    catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message,
            data: 'Failed to login!'
        })
    }
}

// ChangePassword

