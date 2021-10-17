var express = require("express");

var coreController = require("../Controller/coreServices")

var router = express.Router();

// constants Endpoints
router.get("/constants", coreController.getAllConstants)

router.get("/constants/:constId", coreController.getConstant);

router.get("/constants/:constId/:fieldId", coreController.getSpecificFromConstants)

// remainder Endpoints
router.get("/getLatestRemainderInformation", coreController.latestRemainderInformation);

// GetUserType Endpoints
router.get("/getUserType", coreController.getUserType);

router.get("/getLoginUser", coreController.getLoginUser); 

// JWT Endpoints
router.get("/verifyToken", coreController.verifyJWT)

module.exports = router;
