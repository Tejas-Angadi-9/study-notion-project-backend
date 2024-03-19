const express = require('express')
const router = express.Router();

//* ---------------------------------- IMPORTING CONTROLLERS ----------------------------------
const { signup, sendOTP, login, changePassword } = require('../controllers/authController')
const { resetPasswordToken, resetPassword } = require('../controllers/resetPasswordController')
const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/authMiddleware')
const { createTag, getAllTags, deleteTag, updateTag } = require('../controllers/tagController')
const { createCourse, getCourses } = require('../controllers/courseController')

//* ---------------------------------- AUTH SECTION -------------------------------------------
router.post('/signup', signup)
router.post('/login', login)
router.post('/otp', sendOTP)
router.patch('/changePasword', changePassword)
router.post('/resetPasswordToken', resetPasswordToken)
router.patch('/resetPassword', resetPassword)

//* -------------------------- Authorization middlewares --------------------------------------
router.get('/student', auth, isStudent)
router.get('/instructor', auth, isInstructor)
router.get('/admin', auth, isAdmin)


//* ---------------------------------- TAGS SECTION -------------------------------------------
router.post('/tags', auth, isAdmin, createTag);
router.get('/tags', auth, isAdmin, getAllTags);
router.patch('/tags/:id', auth, isAdmin, updateTag)
router.delete('/tags/:id', auth, isAdmin, deleteTag)

//* -------------------------------- COURSES SECTION ------------------------------------------
router.get('/courses', auth, isInstructor, getCourses)
router.post('/courses', auth, isInstructor, createCourse)

module.exports = router;