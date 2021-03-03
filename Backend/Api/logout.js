var express = require("express");
var controller = require("../Controller/logoutController");

var router = express.Router();

router.get("/logout", controller.logout);

module.exports = router;
