const express = require('express');
const app = express();
const morgan = require('morgan');
const { dbConnect } = require('./config/database');
app.use(express.json());
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