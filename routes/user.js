const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth=require('../auth');
const router = express.Router();
const User = require('../models/users');



//for register
router.post('/signup', (req, res, next) => {

    //first checks if username exist
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user != null) {
                let err = new Error('Username already exists!');
                err.status = 401;
                return next(err);
            }


           // hasing password
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    throw new Error('Could not encrypt password!');
                }

                //create user
                User.create({
                    username: req.body.username,
                    password: hash,
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
});



//for login
router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user === null) {
                let err = new Error('User  is not registered!');
                err.status = 401;
                return next(err);
            }else if(user.type=="normal"){

                bcrypt.compare(req.body.password, user.password, function (err, status) {
                    if (!status) {
                        let err = new Error('You entered wrong password!');
                        err.status = 401;
                        return next(err);
                    }
    
    
                    let token = jwt.sign({ userId: user._id }, process.env.SECRET);
                    res.json({ status: 'Success normal login!', token: token });
                });
            }else if(user.type=="candidate"){

                bcrypt.compare(req.body.password, user.password, function (err, status) {
                    if (!status) {
                        let err = new Error('You entered wrong password!');
                        err.status = 401;
                        return next(err);
                    }
    
    
                    let token = jwt.sign({ userId: user._id }, process.env.SECRET);
                    res.json({ status: 'Success candidate login!', token: token });
                });
            }
           
          
        }).catch(next);
});


//for forgot-password


//to get details of logged user

router.get('/loggedUserDetails', auth.verifyUser, (req, res, next) => {
    res.json(req.user);
});



//update userDetails
router.put('/loggedUserDetails', auth.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => {
            res.json({ username: user.username, firstName: user.firstName, lastName: user.lastName });
        }).catch(next)
});
module.exports = router;