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
                // let err = new Error('User  is not registered!');
                // err.status = 401;
                // return next(err);
                res.status(403)
                res.json({code:403, status: 'User not registered',token:'Not found'}); 
            }
               else {
                    bcrypt.compare(req.body.password, user.password, function (err, status) {
                        if (!status) {
                            // let err = new Error('You entered wrong password!');
                            // err.status = 401;
                            // return next(err);
                            res.status(404)
                            res.json({code:404, status: 'You entered wrong password!',token:'Password incorrect' });
                        }

                        else if(user.type=="voter"){
                            let token = jwt.sign({ userId: user._id }, process.env.SECRET);
                            res.status(200)
                            res.json({code:200, status: 'Success voter login!', token: token });
                        }
                        else if(user.type=="candidate"){
                            let token = jwt.sign({ userId: user._id }, process.env.SECRET);
                            res.status(201)
                            res.json({code:201, status: 'Success candidate login!', token: token });
                        }
        
                     
                    });
                }
               
                
            
             
        }).catch(next);
});




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

//userlist
router.get('/userList',(req,res,next)=>{
    User.find()
    .then((user)=>{
        res.json(user)
    }).catch(next)
})



//vote user
router.put('/vote/:id',auth.verifyUser,(req,res,next)=>{
        User.find({_id:req.params.id, votes:req.user._id})
        .then((user)=>{
            if(user==0){
              User.findByIdAndUpdate(
                  req.params.id,
                  {$push: {votes:req.user._id}},
                  {new : true}
              ).then(()=>{
                  res.status(201)
                  res.json({code:201, status:'Vot added'})
              }).catch(next)
            }else{
                res.status(202)
                  res.json({code:202, status:'Already voted'})
            }
        }).catch(next)
} )
module.exports = router;


