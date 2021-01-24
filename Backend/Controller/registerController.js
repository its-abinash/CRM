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
const { processPayload, validatePayload } = require("./main_utils");
const { registrationSchema } = require("./schema");

var existingUser = async function (email) {
  logger.info("In isExistingUser");
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
module.exports.register = async function (req, res) {
  try {
    logger.info("POST /register begins");
    var payload = await processPayload(req.body);
    payload["phonenum"] = payload["phonenum"].toString();
    var [isValidPayload, errorList] = await validatePayload(
      payload,
      registrationSchema
    );
    if (!isValidPayload) {
      logger.info(`Invalid Payload with errorList = ${errorList}`);
      res.redirect("/login");
    } else {
      var email = payload.email;
      var username = payload.username;
      var phoneNum = payload.phonenum;
      var gstNum = payload.gstnum;
      var remFreq = payload.remfreq;
      var password = payload.password;
      var passcode = payload.passcode;
      var isExisting = await existingUser(email);
      logger.info(`isExistingUser = ${isExisting}`);
      if (isExisting) {
        res.redirect("/login");
      } else {
        var credData = [email, password, passcode, false];
        var date = new Date();
        date.setDate(date.getDate() + parseInt(remFreq));
        var next_remainder = date.toLocaleDateString();
        var userData = [
          username,
          email,
          phoneNum,
          gstNum,
          remFreq,
          next_remainder,
        ];
        logger.info(`credData: ${credData} and userData: ${userData}`);
        // Save user cred in db
        logger.info(`Saving 'credentials' in db for userId: ${email}`);
        var credSaved = await db.insert(DATABASE.CREDENTIALS, credData);
        // Save user data in db
        logger.info(`Saving 'customer' with userId: ${email}`);
        var dataSaved = await db.insert(DATABASE.CUSTOMER, userData);
        if (credSaved && dataSaved) {
          logger.info("User has been successfully registered");
          res.redirect("/login");
        } else {
          logger.error("Registration Failed");
          res.redirect("/login");
        }
      }
    }
  } catch (ex) {
    logger.error(`POST /register Captured Error ===> ${ex}`);
    res.redirect("/login");
  }
};
