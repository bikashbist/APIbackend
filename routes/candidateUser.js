const express = require('express');
const auth=require('../auth');
const router = express.Router();
const User = require('../models/users');

//select candidate users
router.get('/candidateUser',  (req, res, next) => {
   User.find({type:'canditate'}).then((user)=>{
       res.json(user)
   }).catch(next)
});

module.exports = router;