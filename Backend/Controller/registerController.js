var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var logger = require("../Logger/log");
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());
var { DATABASE } = require("../../Configs/constants.config");

var existingUser = async function (email) {
  logger.info("Execution of 'isExistingUser' method begins");
  var res = await db.isExistingUser("email", email);
  return res;
};

/**
 * @httpMethod POST
 * @function register
 * @async
 * @description Registering a user
 * @param {Object} req
 * @param {Object} res
 */
exports.register = async function (req, res) {
  try {
    logger.info("POST /register begins");
    logger.info(`POST /register body ===> ${JSON.stringify(req.body)}`);
    var email = req.body.email;
    var username = req.body.username;
    var phoneNum = req.body.phonenum;
    var gstNum = req.body.gstnum;
    var remFreq = req.body.remfreq;
    var password = req.body.password;
    var passcode = req.body.passcode;
    logger.info("Calling 'existingUser' method");
    var isExisting = await existingUser(email);
    logger.info(
      `Execution of \'isExistingUser\' method ends with result = ${isExisting}`
    );
    if (isExisting) {
      res.redirect("/login");
    } else {
      var credData = [email, password, passcode];
      var date = new Date()
      date.setDate(date.getDate() + remFreq)
      var next_remainder = date.toLocaleDateString()
      var userData = [username, email, phoneNum, gstNum, remFreq, next_remainder];
      logger.info(
        `credData to be saved ===> ${credData} and userData to be saved ===> ${userData}`
      );
      // Save user cred in db
      logger.info("Execution of 'insert' method in 'credentials' db begins");
      var credSaved = await db.insert(DATABASE.CREDENTIALS, credData);
      logger.info(
        `Execution of \'insert\' method in \'credentials\' db ends with result = ${credSaved}`
      );
      // Save user data in db
      logger.info("Execution of 'insert' method in 'conversations' db begins");
      var dataSaved = await db.insert(DATABASE.CUSTOMER, userData);
      logger.info(
        `Execution of \'insert\' method in \'conversations\' db ends with result = ${dataSaved}`
      );
      console.log("registration Completed");
      if (credSaved && dataSaved) {
        logger.info("All data saved, so redirecting back to login");
        res.redirect("/login");
      } else {
        logger.error("Saving data failed, so redirecting back to login");
        res.redirect("/login");
      }
    }
  } catch (ex) {
    logger.error(`POST /register Captured Error ===> ${ex}`);
    res.redirect("/login");
  }
};
