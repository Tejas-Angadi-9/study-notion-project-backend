const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const { dbConnect } = require('./config/database');
app.use(express.json());
app.use(cookieParser())
app.use(morgan('dev'));

require('dotenv').config();

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Server running at ${PORT} port....`)
})

app.get('/', (req, res) => {
    res.send(`<h1> Study Notion Coming soon! </h1>`)
})

//* Connecting to DB
dbConnect();

//* Importing the routes and mount on the common route
const userRoute = require('./routes/userRoute');
app.use('/api/v1', userRoute);