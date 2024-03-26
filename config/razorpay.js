const Razorpay = require('razorpay');

require('dotenv').config();
const razorpayInstance = new Razorpay({
    key_id: process.env.PAZORPAY_KEY,
    key_secret: process.env.PAZORPAY_SECRET
});

module.exports = razorpayInstance;