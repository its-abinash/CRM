var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var session = require("express-session");
var logger = require("../Logger/log");
var { DATABASE, ResponseIds } = require("../../Configs/constants.config");
var jp = require("jsonpath");
var { buildResponse, getEndMessage } = require("./response_utils");
var HttpStatus = require("http-status");
var { format } = require("./main_utils");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

var getUserTypeFromDB = async function (userId) {
  var userType = await db.fetch(
    DATABASE.CREDENTIALS,
    DATABASE.FETCH_SPECIFIC,
    "email",
    userId || "demo@domain.com"
  );
  var expr = "$..is_admin";
  var result = jp.query(userType, expr);
  return result;
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
    var isAdmin = await getUserTypeFromDB(req.session.user);
    logger.info(`Response from database = ${JSON.stringify(isAdmin, null, 3)}`);
    var response = await buildResponse(
      isAdmin,
      format(ResponseIds.RI_006, ["is_admin flag", isAdmin]),
      HttpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(HttpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error from GET /getUserType = ${ex}`);
    var response = await buildResponse(
      null,
      ex,
      HttpStatus.BAD_GATEWAY
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(HttpStatus.BAD_GATEWAY).send(response);
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
      statusCode = HttpStatus.BAD_REQUEST,
      responseId = "RI_015";

  try {
    logger.info("GET /getLoginUser begins");
    var validated = validateLoginUser(req);

    if (validated) {
      data = req.session.user;
      reason = format(ResponseIds.RI_006, ["login user", data]);
      statusCode = HttpStatus.OK;
      responseId = "RI_006";
    } else {
      throw reason;
    }
    var response = await buildResponse(
      data,
      reason,
      statusCode,
      responseId
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(HttpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error from GET /getLoginUser = ${ex}`);
    var response = await buildResponse(
      data,
      reason,
      statusCode,
      responseId
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(statusCode).send(response);
  }
};
