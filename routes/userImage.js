const express = require('express');
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: "./public/proImage",

    //channging image name to now date
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only images allowed!"), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
})

const uploadRouter = express.Router();

uploadRouter.route('/')
    .post(upload.single('profileImage'), (req, res) => {
        res.json(req.file);
    });

module.exports = uploadRouter;