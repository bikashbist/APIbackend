  
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.options('*', cors());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
const mongoose = require('mongoose');

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((db) => {
        console.log("Successfully connected mongodb server");
    });

app.listen(3000, () => {
    console.log(`App is running at localhost:3000`);
});