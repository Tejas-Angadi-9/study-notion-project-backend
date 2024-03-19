const express = require('express')
const router = express.Router();

//* ---------------------------------- IMPORTING CONTROLLERS ----------------------------------
const { signup, sendOTP, login, changePassword } = require('../controllers/authController')
const { resetPasswordToken, resetPassword } = require('../controllers/resetPasswordController')
const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/authMiddleware')
const { createTag, getAllTags, deleteTag, updateTag } = require('../controllers/tagController')
const { createCourse, getCourses } = require('../controllers/courseController')
const { createSection, getSection, updateSection, deleteSection } = require('../controllers/sectionController')
const { createSubSection, getSubSection, updateSubSection, deleteSubSection } = require('../controllers/subsectionController')
const { updateProfile, deleteAccount } = require('../controllers/profileController')

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

//* -------------------------------- SECTION SECTION ------------------------------------------
router.post('/courses/section', auth, isInstructor, createSection)
router.get('/courses/section', auth, isInstructor, getSection)
router.patch('/courses/section', auth, isInstructor, updateSection)
router.delete('/courses/section', auth, isInstructor, deleteSection)

//* -------------------------------- SUB-SECTION SECTION --------------------------------------
router.post('/courses/section/subsection', auth, isInstructor, createSubSection)
router.get('/courses/section/subsection', auth, isInstructor, getSubSection)
router.patch('/courses/section/subsection', auth, isInstructor, updateSubSection)
router.delete('/courses/section/subsection', auth, isInstructor, deleteSubSection)

//* -------------------------------- PROFILE SECTION ------------------------------------------
router.patch('/users/profile', auth, isInstructor, updateProfile)
router.delete('/users/profile', auth, isInstructor, deleteAccount)
//TODO: Get all users details

module.exports = router;


//! CRONJOB -> Check this