var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var logger = require("../Logger/log");
var {
  DATABASE,
  ResponseIds,
  routes,
} = require("../../Configs/constants.config");
const { processPayload, validatePayload } = require("./main_utils");
const { registrationSchema, loginPayloadSchema } = require("./schema");
const { getEndMessage } = require("./response_utils");
var session = require("express-session");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

var existingUser = async function (email) {
  try {
    var res = await db.isExistingUser("email", email);
    return res;
  } catch (ex) {
    throw ex;
  }
};

var removeDataOnFailure = async function () {
  try {
    await db.remove(DATABASE.CREDENTIALS, "email", email);
    await db.remove(DATABASE.CUSTOMER, "email", email);
    await db.remove(DATABASE.USERS_MAP, "user_id1", email);
  } catch (ex) {
    logger.error(`Failed to remove user data with err: ${ex}`);
  }
};

/**
 * @function isValidUser
 * @async
 * @description Validate user by checking the input credentials with the correct one
 * @param {string} email
 * @param {string} password
 * @returns Acknowledgement of the validation of the user(Boolean)
 */
var isValidUser = async function (email, password) {
  try {
    var isExistingUser = await existingUser(email);
    if (isExistingUser) {
      return await db.isValidUser("email", email, password);
    }
    return false;
  } catch (ex) {
    throw ex;
  }
};

/**
 * @httpMethod POST
 * @function login
 * @async
 * @description log in to the dashboard
 * @param {Object} req
 * @param {Object} res
 */
module.exports.login = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("POST /login begins");
    var payload = await processPayload(req.body);
    var [isValidPayload, errorList] = await validatePayload(
      payload,
      loginPayloadSchema
    );
    if (!isValidPayload) {
      logger.error(`Invalid Payload with errorList = ${errorList}`);
      logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
      res.redirect("/login");
    } else {
      var email = payload.email;
      var password = payload.password;
      var validUser = await isValidUser(email, password);
      logger.info(`User Validated: ${validUser}`);
      logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
      if (validUser) {
        req.session.user = email;
        req.session.password = password;
        res.redirect("/home");
      } else {
        res.redirect("/login");
      }
    }
  } catch (ex) {
    logger.error(`POST /login Captured Error: ${ex}`);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.redirect("/login");
  }
};

/**
 * @httpMethod GET
 * @function getLoginPage
 * @async
 * @description Renders the login-registration html file
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getLoginPage = async function (req, res) {
  logger.info("GET /login begins");
  res.render("register", {
    regEndpoint: routes.server + routes.reg,
    loginEndpoint: routes.server + routes.login,
  });
};

var getAdmins = async function () {
  try {
    var is_admin = [true];
    var adminList = await db.fetchAllUserOfGivenType(is_admin);
    return adminList;
  } catch (exc) {
    throw exc;
  }
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
  req._initialTime = Date.now();
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
      logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
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
        logger.info(
          getEndMessage(req, ResponseIds.RI_005, req.method, req.path)
        );
        res.redirect("/login");
      } else {
        var credData = [email, password, passcode, false];
        var date = new Date();
        date.setDate(date.getDate() + parseInt(remFreq));
        var next_remainder = date.toLocaleDateString();
        var default_profile_img_url = "";
        var userData = [
          username,
          email,
          phoneNum,
          gstNum,
          remFreq,
          next_remainder,
          default_profile_img_url,
        ];
        logger.info(`credData: ${credData} and userData: ${userData}`);
        // Save user cred in db
        logger.info(`Saving 'credentials' in db for userId: ${email}`);
        var credSaved = await db.insert(DATABASE.CREDENTIALS, credData);
        // Save user data in db
        logger.info(`Saving 'customer' with userId: ${email}`);
        var dataSaved = await db.insert(DATABASE.CUSTOMER, userData);
        logger.info(`Mapping present admins with userId: ${email}`);
        var adminList = await getAdmins();
        var userMap = [];
        // Saving user-admin and admin-user in user_map table
        for (const admin of adminList) {
          userMap.push([email, admin.email]);
          userMap.push([admin.email, email]);
        }
        logger.info(`userMap: ${JSON.stringify(userMap)}`);
        var usermapCreated = await db.insert(DATABASE.USERS_MAP, userMap);
        if (credSaved && dataSaved && usermapCreated) {
          logger.info("User has been successfully registered");
          logger.info(
            getEndMessage(req, ResponseIds.RI_005, req.method, req.path)
          );
          res.redirect("/login");
        } else {
          logger.error("Registration Failed");
          logger.info(
            getEndMessage(req, ResponseIds.RI_005, req.method, req.path)
          );
          await removeDataOnFailure();
          res.redirect("/login");
        }
      }
    }
  } catch (ex) {
    logger.error(`POST /register Error: ${ex}`);
    await removeDataOnFailure();
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.redirect("/login");
  }
};

/**
 * @httpMethod GET
 * @function logout
 * @async
 * @description logging out the user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.logout = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("GET /logout begins");
  logger.info(`Closing session for userId: ${req.session.user}`);
  await req.session.destroy();
  logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
  res.redirect("/login");
};
