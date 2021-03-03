var express = require("express");
var controller = require("../Controller/insert");
const multer = require('multer');
const uploadMiddleware = multer({}).single("image");

var router = express.Router();

router.post("/insert", controller.insert);

router.post("/insertProfilePicture", uploadMiddleware, controller.insertProfilePicture);

module.exports = router;
