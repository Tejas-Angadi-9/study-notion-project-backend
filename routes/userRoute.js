const express = require('express')
const router = express.Router();

const { signup, sendOTP, login, changePassword } = require('../controllers/authController')
const { resetPasswordToken, resetPassword } = require('../controllers/resetPasswordController')
const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/authMiddleware')
const { createTag, getAllTags } = require('../controllers/tagController')

router.post('/signup', signup)
router.post('/login', login)
router.post('/otp', sendOTP)
router.patch('/changePasword', changePassword)
router.post('/resetPasswordToken', resetPasswordToken)
router.patch('/resetPassword', resetPassword)

router.post('/tags', auth, isAdmin, createTag);
router.get('/tags', auth, isAdmin, getAllTags);

// Authorization middlewares
router.get('/student', auth, isStudent)
router.get('/instructor', auth, isInstructor)
router.get('/admin', auth, isAdmin)

module.exports = router;