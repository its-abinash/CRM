var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var httpStatus = require("http-status");
var { AppResponse } = require("./response_utils");
var session = require("express-session");
var logger = require("../Logger/log");
const axios = require("axios").default;
const { ResponseIds, URL } = require("../../Configs/constants.config");
const { format, isLoggedInUser } = require("./main_utils");
const utils = require("./utils");
const remainderService = require("./remainderService");
const OOBService = require("./OOBService");
const quoteService = require("./quoteService");
const coreServiceDao = require("./coreServiceDao");
const jwt = require("jsonwebtoken");

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
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [statusCode, response] = await OOBService.processAndGetAllConstants(
      req,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      null,
      ex,
      httpStatus.BAD_REQUEST,
      "RI_015"
    );
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
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [statusCode, response] =
      await OOBService.processAndGetSpecificFromConstants(req, AppRes);
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.BAD_GATEWAY);
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
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var [statusCode, response] = await OOBService.processAndGetConstant(
      req,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.BAD_GATEWAY);
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
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var LoggedInUser = await utils.decodeJwt(AppRes);
    logger.info(`loggedInUser: ${LoggedInUser}`);
    if (!LoggedInUser) {
      var response = await AppRes.buildResponse(
        null,
        ResponseIds.RI_015,
        httpStatus.UNAUTHORIZED,
        "RI_015"
      );
      AppRes.ApiExecutionEnds();
      res.status(httpStatus.UNAUTHORIZED).send(response);
    } else {
      var [statusCode, response] = await quoteService.processAndGetQuotes(
        AppRes
      );
      AppRes.ApiExecutionEnds();
      res.status(statusCode).send(response);
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.BAD_GATEWAY);
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
  var AppRes = new AppResponse(req);
  var isUserSessionValid = await isLoggedInUser(req);
  if (isUserSessionValid) {
    AppRes.ApiExecutionBegins();
    res.render("home");
  } else {
    AppRes.ApiReportsError("Session is invalid");
    var response = await AppRes.buildResponse(
      null,
      ResponseIds.RI_015,
      httpStatus.BAD_GATEWAY,
      "RI_015"
    );
    AppRes.ApiExecutionEnds();
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
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var LoggedInUser = await utils.decodeJwt(AppRes);
    logger.info(`logedinuser: ${LoggedInUser}`);
    if (!LoggedInUser) {
      var response = await AppRes.buildResponse(
        null,
        ResponseIds.RI_015,
        httpStatus.UNAUTHORIZED,
        "RI_015"
      );
      AppRes.ApiExecutionEnds();
      res.status(httpStatus.UNAUTHORIZED).send(response);
    } else {
      var [imgUrl, username] = await coreServiceDao.getImageOfLoggedInUser(
        LoggedInUser
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
      var response = await AppRes.buildResponse(
        result,
        format(ResponseIds.RI_006, ["Img Data", imgUrl]),
        httpStatus.OK,
        "RI_006"
      );
      AppRes.ApiExecutionEnds();
      res.status(httpStatus.OK).send(response);
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.BAD_GATEWAY);
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
  try {
    var AppRes = new AppResponse(req);
    AppRes.ApiExecutionBegins();
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var LoggedInUser = await utils.decodeJwt(AppRes);
    if (!LoggedInUser) {
      var response = await AppRes.buildResponse(
        null,
        ResponseIds.RI_015,
        httpStatus.UNAUTHORIZED,
        "RI_015"
      );
      res.status(httpStatus.UNAUTHORIZED).send(response);
    } else {
      var isAdmin = await coreServiceDao.getUserTypeFromDB(LoggedInUser);
      logger.info(`user: ${LoggedInUser} is_admin = ${isAdmin}`);
      var response = await AppRes.buildResponse(
        isAdmin,
        format(ResponseIds.RI_006, ["is_admin flag", isAdmin]),
        httpStatus.OK,
        "RI_006"
      );
      AppRes.ApiExecutionEnds();
      res.status(httpStatus.OK).send(response);
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @function getLoginUser
 * @async
 * @description This API gets the logged-in user-id
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getLoginUser = async function (req, res) {
  var AppRes = new AppResponse(req);
  var data = null,
    reason = ResponseIds.RI_015,
    statusCode = httpStatus.BAD_GATEWAY,
    responseId = "RI_015";

  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = await utils.decodeJwt(AppRes);
    if (!LoggedInUser) {
      var response = await AppRes.buildResponse(
        null,
        ResponseIds.RI_015,
        httpStatus.UNAUTHORIZED,
        "RI_015"
      );
      res.status(httpStatus.UNAUTHORIZED).send(response);
    } else {
      data = LoggedInUser;
      reason = format(ResponseIds.RI_006, ["login user", data]);
      statusCode = httpStatus.OK;
      responseId = "RI_006";

      var response = await AppRes.buildResponse(
        data,
        reason,
        statusCode,
        responseId
      );
      AppRes.ApiExecutionEnds();
      res.status(httpStatus.OK).send(response);
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(data, ex, statusCode, responseId);
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
  logger.info("Execution of GET /landingPage begins");
  res.render("register");
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
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var isSessionValid = await isLoggedInUser(req);
    if (!isSessionValid) {
      throw ResponseIds.RI_015;
    }
    var LoggedInUser = await utils.decodeJwt(AppRes);
    if (!LoggedInUser) {
      var response = await AppRes.buildResponse(
        null,
        ResponseIds.RI_015,
        httpStatus.UNAUTHORIZED,
        "RI_015"
      );
      res.status(httpStatus.UNAUTHORIZED).send(response);
    } else {
      var [statusCode, response] = await remainderService.processRemainderData(
        AppRes
      );
      AppRes.ApiExecutionEnds();
      res.status(statusCode).send(response);
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @endpoint /verifyToken
 * @async
 * @function verifyJWT
 * @description Verify the access-token
 * @param {Object} req
 * @param {Object} res
 */
module.exports.verifyJWT = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var token = AppRes.getAccessToken();
    if (!token) {
      var response = await AppRes.buildResponse(
        null,
        ResponseIds.RI_015,
        httpStatus.UNAUTHORIZED,
        "RI_015"
      );
      AppRes.ApiExecutionEnds();
      res.status(httpStatus.UNAUTHORIZED).send(response);
    } else {
      var reasons = ResponseIds.RI_023;
      var statusCode = httpStatus.BAD_REQUEST;
      var responseId = "RI_023";
      var decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
      if (decodedToken) {
        reasons = ResponseIds.RI_024;
        responseId = "RI_024";
        statusCode = httpStatus.OK;
      }
      var response = await AppRes.buildResponse(
        decodedToken,
        reasons,
        statusCode,
        responseId
      );
      AppRes.ApiExecutionEnds();
      res.status(statusCode).send(response);
    }
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
