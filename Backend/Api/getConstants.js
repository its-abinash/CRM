var express = require("express");
var controller = require("../Controller/getConstants");

var router = express.Router();

router.get("/constants", controller.getAllConstants)

router.get("/constants/:constId", controller.getConstant);

router.get("/constants/:constId/:fieldId", controller.getSpecificFromConstants)

module.exports = router;
