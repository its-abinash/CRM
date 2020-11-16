var express = require("express");
var controller = require("../Controller/edit");

var router = express.Router();

router.post("/edit", controller.edit);

module.exports = router;
