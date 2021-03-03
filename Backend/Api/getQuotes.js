var express = require("express");
var controller = require("../Controller/getQuotes");

var router = express.Router();

router.get("/getQuotes", controller.getQuotes);

router.get("/home", controller.loadHomePage);

router.get("/getProfilePicture", controller.getProfilePicture);

module.exports = router;
