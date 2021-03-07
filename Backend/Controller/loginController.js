var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var fs = require("fs");
let ENV = JSON.parse(fs.readFileSync("./Configs/routes.config.json", "utf-8"));
var session = require("express-session");
var logger = require("../Logger/log");
const { processPayload, validatePayload } = require("./main_utils");
const { loginPayloadSchema } = require("./schema");
const { getEndMessage } = require("./response_utils");
const { ResponseIds } = require("../../Configs/constants.config");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

/**
 * @function isValidUser
 * @async
 * @description Validate user by checking the input credentials with the correct one
 * @param {string} email
 * @param {string} password
 * @returns Acknowledgement of the validation of the user(Boolean)
 */
var isValidUser = async function (email, password) {
  logger.info("In isValidUser");
  try {
    var isExistingUser = await db.isExistingUser("email", email);
    logger.info(`isExistingUser = ${isExistingUser}`);
    if (isExistingUser) {
      return await db.isValidUser("email", email, password);
    }
    return false;
  } catch (ex) {
    throw ex;
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
    regEndpoint: ENV.endpoints.server + ENV.routes.reg,
    loginEndpoint: ENV.endpoints.server + ENV.routes.login,
  });
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
      logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path))
      res.redirect("/login");
    } else {
      var email = payload.email;
      var password = payload.password;
      var validUser = await isValidUser(email, password);
      if (validUser) {
        logger.info(`User Validated: ${validUser}`);
        req.session.user = email;
        req.session.password = password;
        logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path))
        res.redirect("/home");
      } else {
        logger.error(`User Validated: ${validUser}`);
        logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path))
        res.redirect("/login");
      }
    }
  } catch (ex) {
    logger.error(`POST /login Captured Error: ${ex}`);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path))
    res.redirect("/login");
  }
};
