var express = require("express");
var controller = require("../Controller/getUserType");

var router = express.Router();

router.get("/getUserType", controller.getUserType);

module.exports = router;
