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
const { processPayload, validatePayload, format } = require("./main_utils");
const { registrationSchema, loginPayloadSchema } = require("./schema");
const { AppResponse } = require("./response_utils");
var session = require("express-session");
var httpStatus = require("http-status");
var jp = require("jsonpath");
var jwt = require("jsonwebtoken");
const utils = require("./utils");

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

var removeDataOnFailure = async function (email) {
  try {
    var credRemoved = await db.remove(DATABASE.CREDENTIALS, "email", email);
    var cusRemoved = await db.remove(DATABASE.CUSTOMER, "email", email);
    var usermapRemoved = await db.remove(DATABASE.USERS_MAP, "user_id1", email);
    return credRemoved && cusRemoved && usermapRemoved;
  } catch (ex) {
    logger.error(`Failed to remove user data with err: ${ex}`);
    return false;
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
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var requestPayload = AppRes.getRequestBody();
    var payload = await processPayload(requestPayload);
    var [isValidPayload, errorList] = await validatePayload(
      payload,
      loginPayloadSchema
    );
    var data = {
      link: null,
      auth: false,
      token: null,
    };
    if (!isValidPayload) {
      var errorReason = await AppRes.buildErrorReasons(errorList);
      var fetch_error_msg_expr = "$[*].error";
      errorReason.push(data);
      var errorMessages = jp.query(errorReason, fetch_error_msg_expr);
      var response = await AppRes.buildResponse(
        errorReason,
        errorMessages,
        httpStatus.UNPROCESSABLE_ENTITY,
        "RI_004"
      );
      logger.info(`Invalid Payload with errorList = ${errorList}`);
      AppRes.ApiExecutionEnds();
      res.status(httpStatus.UNPROCESSABLE_ENTITY).send(response);
    } else {
      var email = payload.email;
      var password = payload.password;
      var validUser = await isValidUser(email, password);
      logger.info(`User Validated: ${validUser}`);
      if (validUser) {
        req.session.user = email;
        req.session.password = password;
        // create access-token
        var accessToken = jwt.sign({ id: email }, process.env.JWT_SECRET, {
          expiresIn: 86400, // 24 Hour
        });

        data = {
          link: routes.server + routes.home,
          auth: true,
          token: accessToken,
        };
        var response = await AppRes.buildResponse(
          data,
          format(ResponseIds.RI_019, [email]),
          httpStatus.OK,
          "RI_019"
        );
        AppRes.ApiExecutionEnds();
        res.status(httpStatus.OK).send(response);
      } else {
        var response = await AppRes.buildResponse(
          data,
          format(ResponseIds.RI_021, [email, "Wrong userId or Password"]),
          httpStatus.BAD_REQUEST,
          "RI_021"
        );
        AppRes.ApiExecutionEnds();
        res.status(httpStatus.BAD_REQUEST).send(response);
      }
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var data = {
      link: null,
      auth: false,
      token: null,
    };
    var response = await AppRes.buildResponse(
      data,
      format(ResponseIds.RI_020, [email, ex]),
      httpStatus.BAD_GATEWAY,
      "RI_020"
    );
    AppRes.ApiExecutionEnds();
    res.status(httpStatus.BAD_GATEWAY).send(response);
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
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var requestPayload = AppRes.getRequestBody();
    var payload = await processPayload(requestPayload);
    payload["phonenum"] = payload["phonenum"].toString();
    var [isValidPayload, errorList] = await validatePayload(
      payload,
      registrationSchema
    );
    if (!isValidPayload) {
      var errorReason = await AppRes.buildErrorReasons(errorList);
      var fetch_error_msg_expr = "$[*].error";
      var errorMessages = jp.query(errorReason, fetch_error_msg_expr);
      var response = await AppRes.buildResponse(
        errorReason,
        errorMessages,
        httpStatus.UNPROCESSABLE_ENTITY,
        "RI_004"
      );
      logger.info(`Invalid Payload with errorList = ${errorList}`);
      AppRes.ApiExecutionEnds();
      res.status(httpStatus.UNPROCESSABLE_ENTITY).send(response);
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
        logger.error(`UserId: ${email} already exists`);
        var response = await AppRes.buildResponse(
          null,
          format(ResponseIds.RI_022, [email]),
          httpStatus.CONFLICT,
          "RI_022"
        );
        AppRes.ApiExecutionEnds();
        res.status(httpStatus.CONFLICT).send(response);
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
          var response = await AppRes.buildResponse(
            null,
            format(ResponseIds.RI_016, [email]),
            httpStatus.CREATED,
            "RI_016"
          );
          AppRes.ApiExecutionEnds();
          res.status(httpStatus.CREATED).send(response);
        } else {
          logger.error("Registration Failed");
          var requestPayload = AppRes.getRequestBody();
          await removeDataOnFailure(requestPayload.email);
          var response = await AppRes.buildResponse(
            null,
            format(ResponseIds.RI_018, [
              email,
              "error saving userdata in our databse",
            ]),
            httpStatus.BAD_REQUEST,
            "RI_018"
          );
          AppRes.ApiExecutionEnds();
          res.status(httpStatus.BAD_REQUEST).send(response);
        }
      }
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var requestPayload = AppRes.getRequestBody();
    await removeDataOnFailure(requestPayload.email);
    var response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_017, [email, ex]),
      httpStatus.BAD_GATEWAY,
      "RI_017"
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod POST
 * @function logout
 * @async
 * @description logging out the user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.logout = async function (req, res) {
  var AppRes = new AppResponse(req);
  var loggedInUser = await utils.decodeJwt(AppRes);
  try {
    AppRes.ApiExecutionBegins();
    logger.info(`Closing session for userId: ${loggedInUser}`);
    await AppRes.destroySession();
    res.cookie("connect.sid", null, {
      expires: new Date(),
      httpOnly: true,
    });
    var data = {
      link: routes.server + routes.login,
      auth: false,
      token: null,
    };
    var response = await AppRes.buildResponse(
      data,
      format(ResponseIds.RI_031, [loggedInUser]),
      httpStatus.OK,
      "RI_031"
    );
    AppRes.ApiExecutionEnds();
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var data = {
      link: null,
      auth: false,
      token: null,
    };
    var response = await AppRes.buildResponse(
      data,
      format(ResponseIds.RI_025, [String(ex)]),
      httpStatus.BAD_GATEWAY,
      "RI_025"
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
