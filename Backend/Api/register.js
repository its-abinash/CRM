var express = require("express");
var controller = require("../Controller/registerController");

var router = express.Router();

router.post("/register", controller.register);

module.exports = router;
