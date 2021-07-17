var express = require("express");

var userController = require("../Controller/userServices")

const multer = require('multer');
const uploadMiddleware = multer({}).single("image");

var router = express.Router();

// Dashboard Endpoints
router.get("/dashboard/getCustomer", userController.getCustomers);

router.get("/dashboard/getAdmins", userController.getAdmins)

// Chat Endpoints
router.get("/chat/receivers/:receiverId/senders/:senderId", userController.getConversation);

router.post("/chat", userController.chat);

// userIds: comma separated string referring to user ids.
router.get("/chat/notification/:userIds", userController.getNotification);

// Delete Endpoints
router.delete("/deleteUser", userController.delete);

// Edit Endpoints
router.put("/edit", userController.edit);

router.patch("/edit", userController.updateUserProperty);

// Insert Endpoints
router.post("/insert", userController.insert);

router.post("/insert/profilePicture", uploadMiddleware, userController.insertProfilePicture);

// Email Endpoints
router.post("/email", userController.email);

module.exports = router;
