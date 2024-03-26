const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoute');
const profileRoutes = require('./routes/profileRoute')
const paymentRoutes = require('./routes/paymentRoute')
const courseRoutes = require('./routes/courseRoute')

const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const cors = require('cors')
const fileUpload = require('express-fileupload')

app.use(express.json());
app.use(cookieParser())
app.use(morgan('dev'));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

const { dbConnect } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Server running at ${PORT} port....`)
})

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: `Server is running successfully!`
    })
})

//* Connecting to DB
dbConnect();

//* Importing the routes and mount on the common route
const userRoute = require('./routes/userRoute');
app.use('/api/v1/auth', userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);