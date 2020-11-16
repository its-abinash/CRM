var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var session = require("express-session");
var logger = require("../Logger/log");
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

exports.delete = async function (req, res) {
  try {
    logger.info("POST /delete begins");
    logger.info(`POST /delete body ===> ${JSON.stringify(req.body)}`);
    var email = req.body.email;
    logger.info(`Removing '${email}' as customer begins`);
    var removedCustomer = await db.remove(3, "email", email);
    logger.info(`Removing '${email}' as customer ends`);
    logger.info(`Removing Conversation of '${email}' begins`);
    var removedConversation = await db.remove(
      4,
      ["sender", "receiver"],
      [req.session.user, email]
    );
    logger.info(`Removing Conversation of '${email}' ends`);
    logger.info(`Removing Credentials of '${email}' begins`);
    var removedCredentials = await db.remove(1, "email", email);
    logger.info(`Removing Credentials of '${email}' ends`);
    if (removedCustomer && removedConversation && removedCredentials) {
      logger.info(
        "Removed user successfully, so redirecting back to dashboard"
      );
      res.status(200).send({ reason: "success" });
    } else {
      logger.error("User removal failed, so redirecting back to dashboard");
      res.status(400).send({ reason: "failure" });
    }
  } catch (ex) {
    logger.exceptions(`POST /delete Captured Error ===> ${ex}`);
    res.status(500).send({ reason: "exception" });
  }
};
