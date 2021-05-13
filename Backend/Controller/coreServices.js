var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var httpStatus = require("http-status");
var { buildResponse, getEndMessage } = require("./response_utils");
var session = require("express-session");
var logger = require("../Logger/log");
const axios = require("axios").default;
const { ResponseIds, routes, CORE } = require("../../Configs/constants.config");
const { format, isLoggedInUser } = require("./main_utils");
const remainderService = require("./remainderService");
const OOBService = require("./OOBService");
const quoteService = require("./quoteService");
const coreServiceDao = require("./coreServiceDao");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

const DEFAULT_DATA = {
  defaultProfilePicture: URL.defaultProfilePictureUrl,
};

/**
 * @httpMethod GET
 * @function getAllConstants
 * @description Gets all CONSTANTS
 * @async
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getAllConstants = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("GET /constants begins");
  try {
    var isSessionValid = await isLoggedInUser(req);
    if(!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [statusCode, response] = await OOBService.processAndGetAllConstants(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in GET /constants ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @function getSpecificFromConstants
 * @description Gets a field of specific CONSTANT from CONSTANTS
 * @async
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getSpecificFromConstants = async function (req, res) {
  req._initialTime = Date.now();
  logger.info(`GET /constants/constId/fieldId begins`);
  try {
    var isSessionValid = await isLoggedInUser(req);
    if(!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [statusCode, response] =
      await OOBService.processAndGetSpecificFromConstants(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in GET /constants/constId/fieldId ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @function getConstant
 * @description Gets specific CONSTANT
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getConstant = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("GET /constants/constId begins");
  try {
    var isSessionValid = await isLoggedInUser(req);
    if(!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [statusCode, response] = await OOBService.processAndGetConstant(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in GET /constants/constId ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @function getQuotes
 * @async
 * @description fetch random quotes from https://quotes.rest/
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getQuotes = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("GET /getQuotes begins");
  try {
    var isSessionValid = await isLoggedInUser(req);
    if(!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [statusCode, response] = await quoteService.processAndGetQuotes(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in GET /getQuotes: ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @endpoint /home
 * @function loadHomePage
 * @async
 * @description Renders the home page
 * @param {Object} req
 * @param {Object} res
 */
module.exports.loadHomePage = async function (req, res) {
  // Check if the session is valid
  var isUserSessionValid = await isLoggedInUser(req);
  if (isUserSessionValid) {
    logger.info(`GET /home begins`);
    res.render("home");
  } else {
    logger.error(`Error in GET /home: Session is invalid`);
    var response = await buildResponse(
      null,
      ResponseIds.RI_015,
      httpStatus.BAD_GATEWAY,
      "RI_015"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @function getProfilePicture
 * @async
 * @description Returns profile picture of logged-in user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getProfilePicture = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("GET /getProfilePicture begins");
  try {
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [imgUrl, username] = await coreServiceDao.getImageOfLoggedInUser(
      req.session.user
    );
    if (!imgUrl) {
      var img_data = await axios.get(DEFAULT_DATA.defaultProfilePicture, {
        responseType: "arraybuffer",
      });
      var base64Uri = await Buffer.from(img_data.data, "binary").toString(
        "base64"
      );
      imgUrl = `data:image/png;base64, ${base64Uri}`;
    }
    var result = {
      name: username,
      url: imgUrl,
    };
    var response = await buildResponse(
      result,
      format(ResponseIds.RI_006, ["Img Data", imgUrl]),
      httpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error in GET /getProfilePicture: ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @function getUserType
 * @description Gets the type of user. EG: admin/customer
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns Boolean :- is_admin
 */
module.exports.getUserType = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("GET /getUserType begins");
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var isAdmin = await coreServiceDao.getUserTypeFromDB(req.session.user);
    logger.info(`user: ${req.session.user} is_admin = ${isAdmin}`);
    var response = await buildResponse(
      isAdmin,
      format(ResponseIds.RI_006, ["is_admin flag", isAdmin]),
      httpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error from GET /getUserType = ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

var validateLoginUser = function (request) {
  return (
    "session" in request &&
    request.session &&
    "user" in request.session &&
    !(request.session.user in ["undefined", "null", null])
  );
};

/**
 * @function getLoginUser
 * @async
 * @description This API gets the logged-in user-id
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getLoginUser = async function (req, res) {
  req._initialTime = Date.now();

  var data = null,
    reason = ResponseIds.RI_015,
    statusCode = httpStatus.BAD_REQUEST,
    responseId = "RI_015";

  try {
    logger.info("GET /getLoginUser begins");
    var validated = validateLoginUser(req);

    if (validated) {
      data = req.session.user;
      reason = format(ResponseIds.RI_006, ["login user", data]);
      statusCode = httpStatus.OK;
      responseId = "RI_006";
    } else {
      throw reason;
    }
    var response = await buildResponse(data, reason, statusCode, responseId);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error from GET /getLoginUser = ${ex}`);
    var response = await buildResponse(data, reason, statusCode, responseId);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(statusCode).send(response);
  }
};

/**
 * @httpMethod GET
 * @function landingPage
 * @async
 * @description Renders the login-registration html file
 * @param {Object} req
 * @param {Object} res
 */
module.exports.landingPage = async function (req, res) {
  logger.info("GET /landingPage begins");
  res.render("register", {
    regEndpoint: routes.server + routes.reg,
    loginEndpoint: routes.server + routes.login,
  });
};

/**
 * @httpMethod GET
 * @async
 * @function latestRemainderInformation
 * @description Fetch latest remainder
 * @param {Object} req
 * @param {Object} res
 */
module.exports.latestRemainderInformation = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("GET /getLatestRemainderInformation begins");
    var isSessionValid = await isLoggedInUser(req);
    if(!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [statusCode, response] = await remainderService.processRemainderData(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in ${req.method} ${req.path}: ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
