  
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('./routes/user');
const canUserRouter = require('./routes/candidateUser');
const proImageRouter = require('./routes/userImage');
const auth = require('./auth');


const app = express();
app.options('*', cors());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const mongoose = require('mongoose');

app.use('/users', userRouter);
app.use('/proImageUpload', proImageRouter);
app.use(auth.verifyUser)
app.use('/users', canUserRouter);




//errror handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.statusCode = 500;
    res.json({ status: err.message });
})

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((db) => {
        console.log("Successfully connected mongodb server");
    });

app.listen(3000, () => {
    console.log(`App is running at localhost:3000`);
});