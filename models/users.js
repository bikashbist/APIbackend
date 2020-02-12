const mongoose = require('mongoose');
const {ObjectId}=mongoose.Schema;
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 12
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    type:{
        type:String,
        required:true
    },
    votes:[
        {
            type:ObjectId, ref:"User"
        }
    ],
    verify:{
        type:Boolean,
        default:false
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);