const express = require('express')
const router = express.Router();

//* ---------------------------------- IMPORTING CONTROLLERS ----------------------------------
const { signup, sendOTP, login, changePassword } = require('../controllers/authController')
const { resetPasswordToken, resetPassword } = require('../controllers/resetPasswordController')
const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/authMiddleware')
const { createTag, getAllTags, deleteTag, updateTag } = require('../controllers/tagController')
const { createCourse, getCourse, getAllCourses } = require('../controllers/courseController')
const { createSection, getSection, updateSection, deleteSection } = require('../controllers/sectionController')
const { createSubSection, getSubSection, updateSubSection, deleteSubSection } = require('../controllers/subsectionController')
const { updateProfile, deleteAccount, getUser } = require('../controllers/profileController')
const { createRatingAndReview, updateRatingAndReview, getRatingBasedonCourse, getAllRatings, deleteRatingAndReivew } = require('../controllers/ratingAndReviewController')

//* ---------------------------------- AUTH SECTION -------------------------------------------
router.post('/signup', signup)
router.post('/login', login)
router.post('/otp', sendOTP)
router.patch('/changePasword', changePassword)
router.post('/resetPasswordToken', resetPasswordToken)
router.patch('/resetPassword', resetPassword)

//* -------------------------- Authorization middlewares --------------------------------------
router.get('/student', auth, isStudent, (req, res) => res.send('Hello Student'))
router.get('/instructor', auth, isInstructor, (req, res) => res.send('Hello Instructor'))
router.get('/admin', auth, isAdmin, (req, res) => res.send('Hello Admin'))


//* ---------------------------------- TAGS SECTION -------------------------------------------
router.post('/tags', auth, isAdmin, createTag);
router.get('/tags', auth, isAdmin, getAllTags);
router.patch('/tags/:id', auth, isAdmin, updateTag)
router.delete('/tags/:id', auth, isAdmin, deleteTag)

//* -------------------------------- COURSES SECTION ------------------------------------------
router.get('/course', auth, isInstructor, getCourse)
router.get('/courses', auth, isInstructor, getAllCourses)
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

router.patch('/user/profile', auth,
    //* TO use or we use it like this
    (req, res, next) => isInstructor(req, res, next) || isAdmin(req, res, next) || isStudent(req, res, next), updateProfile);

router.delete('/user/profile', auth,
    (req, res, next) => isInstructor(req, res, next) || isAdmin(req, res, next) || isStudent(req, res, next), deleteAccount);

router.get('/user', auth,
    (req, res, next) => isStudent(req, res, next) || isInstructor(req, res, next) || isAdmin(req, res, next), getUser);

//* -------------------------------- RATING & REVIEWS SECTION ------------------------------------------
router.post('/courses/rating', auth, isStudent, createRatingAndReview);
router.patch('/courses/rating', auth, isStudent, updateRatingAndReview);
router.get('/courses/rating', auth, isStudent, getRatingBasedonCourse)
router.get('/courses/ratings', auth, isStudent, getAllRatings)
router.delete('/courses/rating', auth, isStudent, deleteRatingAndReivew)

module.exports = router;

//! CRONJOB -> Check this