var express = require("express");
var controller = require("../Controller/latestRemainderInformation");

var router = express.Router();

router.get("/getLatestRemainderInformation", controller.latestRemainderInformation);

module.exports = router;
