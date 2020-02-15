const express = require('express');
const auth=require('../auth');
const router = express.Router();
const User = require('../models/users');

//select candidate users
router.get('/candidateUser', (req, res, next) => {
   User.find({type:'candidate'}).then((user)=>{
       res.json(user)
   }).catch(next)
});


router.put('/candidateUser',auth.verifyUser,(req,res,next)=>{
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
    .then((user) => {
        res.json({ firstName:user.firstName,lastName:user.lastName });
    }).catch(next)
})


router.delete('/candidateUser',auth.verifyUser,(req,res,next)=>{
    User.findByIdAndDelete(req.user._id).then((user)=>{
        res.status(200)
        res.json(user);
    }).catch((next))
})

module.exports = router;