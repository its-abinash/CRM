var express = require("express");
var router = express.Router();
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var logger = require("../Logger/log");
var { DATABASE, ResponseIds } = require("../../Configs/constants.config");
const { processPayload, validatePayload, format } = require("./main_utils");
const { registrationSchema, loginPayloadSchema } = require("./schema");
const { AppResponse } = require("./response_utils");
var httpStatus = require("http-status");
var jp = require("jsonpath");
var jwt = require("jsonwebtoken");
const utils = require("./utils");
const lodash = require("lodash");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
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
      logger.info(`UserId: ${email} Validation result: ${validUser}`);
      if (validUser) {
        // create access-token
        var accessToken = jwt.sign({ id: email }, process.env.JWT_SECRET, {
          expiresIn: 86400, // 24 Hour
        });

        data = {
          auth: true,
          token: accessToken,
        };
        var response = await AppRes.buildResponse(
          data,
          format(ResponseIds.RI_019, [email]),
          httpStatus.OK,
          "RI_019",
          [email]
        );
        AppRes.ApiExecutionEnds();
        res.status(httpStatus.OK).send(response);
      } else {
        var response = await AppRes.buildResponse(
          data,
          format(ResponseIds.RI_021, [email, "Wrong userId or Password"]),
          httpStatus.BAD_REQUEST,
          "RI_021",
          [email, "Wrong userId or Password"]
        );
        AppRes.ApiExecutionEnds();
        res.status(httpStatus.BAD_REQUEST).send(response);
      }
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var data = {
      auth: false,
      token: null,
    };
    var response = await AppRes.buildResponse(
      data,
      format(ResponseIds.RI_020, [email, ex]),
      httpStatus.INTERNAL_SERVER_ERROR,
      "RI_020",
      [email, ex]
    );
    AppRes.ApiExecutionEnds();
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
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

var registrationUtil = async function (
  username,
  email,
  firstname,
  lastname,
  password,
  qpArgs
) {
  var credData = [email, password, false];
  // Setting default remainder to every 7 days
  var next_remainder = Date.now() + 7 * 24 * 60 * 60 * 1000;
  var userData = [
    username,
    email,
    next_remainder.toString(),
    firstname,
    lastname,
  ];
  logger.info(`credData: ${credData} and userData: ${userData}`);
  // Save user cred in db
  logger.info(`Saving 'credentials' in db for userId: ${email}`);
  var credSaved = await db.insert(DATABASE.CREDENTIALS, credData);

  if (!credSaved) {
    return false;
  }

  // Save user data in db
  logger.info(`Saving 'customer' with userId: ${email}`);
  var dataSaved = await db.insert(DATABASE.CUSTOMER, userData);

  if (!dataSaved) {
    return false;
  }

  logger.info("Inserting default values into table media");
  var mediaCreated = await db.insertMedia([
    email,
    null,
    null,
    null,
    null,
    null,
  ]);

  if (!mediaCreated) {
    return false;
  }

  var isAdmin = lodash.has(qpArgs, "isAdmin") ? qpArgs.isAdmin : false;
  if (!isAdmin) {
    logger.info(`Mapping present admins with userId: ${email}`);
    var adminList = await getAdmins();
    var userMap = [];
    // Saving user-admin and admin-user in user_map table
    for (const admin of adminList) {
      userMap.push([email, admin.email]);
      userMap.push([admin.email, email]);
    }
    if (userMap.length > 0) {
      logger.info(`userMap: ${JSON.stringify(userMap)}`);
      var usermapCreated = await db.insert(DATABASE.USERS_MAP, userMap);

      if (!usermapCreated) {
        return false;
      }
    }
  }
  return true;
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
    var payload = AppRes.getRequestBody();
    // Allowed values in query params: isAdmin=boolean (True/False)
    var qpArgs = AppRes.getQueryParams(); // -- TODO -- UI will send isAdmin=true in next ENH
    logger.info(`qpArgs from URL: ${JSON.stringify(qpArgs)}`);
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
      var firstname = payload.firstname;
      var lastname = payload.lastname;
      var username = `${firstname} ${lastname}`;
      var password = payload.password;
      var isExisting = await existingUser(email);
      logger.info(`isExistingUser = ${isExisting}`);
      if (isExisting) {
        logger.error(`UserId: ${email} already exists`);
        var response = await AppRes.buildResponse(
          null,
          format(ResponseIds.RI_022, [email]),
          httpStatus.CONFLICT,
          "RI_022",
          [email]
        );
        AppRes.ApiExecutionEnds();
        res.status(httpStatus.CONFLICT).send(response);
      } else {
        var registrationSuccessfull = await registrationUtil(
          username,
          email,
          firstname,
          lastname,
          password,
          qpArgs
        );

        if (registrationSuccessfull) {
          logger.info("User has been successfully registered");
          var response = await AppRes.buildResponse(
            null,
            format(ResponseIds.RI_016, [email]),
            httpStatus.CREATED,
            "RI_016",
            [email]
          );
          AppRes.ApiExecutionEnds();
          res.status(httpStatus.CREATED).send(response);
        } else {
          logger.error("Registration Failed");
          var requestPayload = AppRes.getRequestBody();
          await removeDataOnFailure(requestPayload.email);
          var response = await AppRes.buildResponse(
            null,
            format(ResponseIds.RI_018, [email, "error saving userdata in our databse"]),
            httpStatus.BAD_REQUEST,
            "RI_018",
            [email, "error saving userdata in our databse"]
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
      httpStatus.INTERNAL_SERVER_ERROR,
      "RI_017",
      [email, ex]
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
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
    var data = AppRes.destroySession();
    var response = await AppRes.buildResponse(
      data,
      format(ResponseIds.RI_031, [loggedInUser]),
      httpStatus.OK,
      "RI_031",
      [loggedInUser]
    );
    AppRes.ApiExecutionEnds();
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var data = {
      auth: false,
      token: null,
    };
    var response = await AppRes.buildResponse(
      data,
      format(ResponseIds.RI_025, [String(ex)]),
      httpStatus.INTERNAL_SERVER_ERROR,
      "RI_025",
      [String(ex)]
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};
