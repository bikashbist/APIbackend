const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/users');


router.post('/signup', (req, res, next) => {

    //first checks if username exist
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user != null) {
                let err = new Error('Username already exists!');
                err.status = 401;
                return next(err);
            }


            //hasing password
            // bcrypt.hash(req.body.password, 10, function (err, hash) {
            //     if (err) {
            //         throw new Error('Could not encrypt password!');
            //     }

                //create user
                User.create({
                    username: req.body.username,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    image:req.body.image,
                    type:req.body.type
                }).then((user) => {

                    //token is genereated
                    let token = jwt.sign({ userId: user._id }, process.env.SECRET);
                    res.json({ status: "Signup Success!", token: token });
                }).catch(next);
            });
        });
// });

module.exports = router;