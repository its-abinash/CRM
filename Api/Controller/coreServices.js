var express = require("express");
var router = express.Router();
var cors = require("cors");
var httpStatus = require("http-status");
var { AppResponse } = require("./response_utils");
var logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const { format } = require("./main_utils");
const remainderService = require("./remainderService");
const OOBService = require("./OOBService");
const coreServiceDao = require("./coreServiceDao");
const jwt = require("jsonwebtoken");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());

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
    var LoggedInUser = req.loggedInUser;
    var isAdmin = await coreServiceDao.getUserTypeFromDB(LoggedInUser);
    logger.info(`user: ${LoggedInUser} is_admin = ${isAdmin}`);
    var response = await AppRes.buildResponse(
      isAdmin,
      format(ResponseIds.RI_006, ["is_admin flag"]),
      httpStatus.OK,
      "RI_006"
    );
    AppRes.ApiExecutionEnds();
    res.status(httpStatus.OK).send(response);
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
  try {
    AppRes.ApiExecutionBegins();
    var response = await AppRes.buildResponse(
      req.loggedInUser,
      format(ResponseIds.RI_006, ["login user"]),
      httpStatus.OK,
      "RI_006"
    );
    AppRes.ApiExecutionEnds();
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      data,
      String(ex),
      httpStatus.INTERNAL_SERVER_ERROR
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
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
    var [statusCode, response] = await remainderService.processRemainderData(
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
