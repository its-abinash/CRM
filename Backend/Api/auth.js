var express = require("express");

var authController = require("../Controller/auth")

var router = express.Router();

// Register Endpoints
router.post("/register", authController.register);

// Login Endpoints
router.get("/login", authController.getLoginPage);

router.post("/login", authController.login);

// Logout Endpoints
router.get("/logout", authController.logout);

module.exports = router;
