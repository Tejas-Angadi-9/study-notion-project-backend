const express = require('express')
const router = express.Router();

const { signup, sendOTP, login } = require('../controllers/authController')
const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/auth')

router.post('/signup', signup)
router.post('/login', login)
router.post('/otp', sendOTP)

// Authorization middlewares
router.get('/student', auth, isStudent)
router.get('/instructor', auth, isInstructor)
router.get('/admin', auth, isAdmin)

module.exports = router;