var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var logger = require("../Logger/log");
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());
var { DATABASE, ResponseIds } = require("../../Configs/constants.config");
const { updatePayloadSchema } = require("./schema");
const {
  buildErrorReasons,
  buildResponse,
  getEndMessage,
} = require("./response_utils");
const httpStatus = require("http-status");
const { validatePayload, format, processPayload } = require("./main_utils");

var processAndGetFinalResponse = async function (
  isValidPayload,
  errorList,
  payload
) {
  var response = {};
  if (!isValidPayload) {
    logger.info(`Invalid Payload with errorList = ${errorList}`);
    var reasons = await buildErrorReasons(errorList);
    response = await buildResponse(
      null,
      reasons,
      httpStatus.UNPROCESSABLE_ENTITY,
      "RI_004"
    );
  } else {
    var name = payload.name || "";
    var email = payload.email;
    var phone = payload.phone || "";
    var rem_freq = payload.remfreq || "";
    var fields = [];
    var data = [];
    if (name !== "") {
      fields.push("name");
      data.push(name);
    }
    if (phone !== "") {
      fields.push("phone");
      data.push(phone);
    }
    if (rem_freq !== "") {
      fields.push("remfreq");
      data.push(rem_freq);
    }
    logger.info(`fields: ${fields}, data: ${data}`);
    var jobDone = await db.update(
      DATABASE.CUSTOMER,
      "email",
      email,
      fields,
      data
    );
    if (jobDone) {
      logger.info("successfully updated in db");
      response = await buildResponse(
        null,
        format(ResponseIds.RI_009, ["User Information", email]),
        httpStatus.OK,
        "RI_009"
      );
    } else {
      logger.error("failed to update in db");
      response = await buildResponse(
        null,
        format(ResponseIds.RI_010, ["User Information", email]),
        httpStatus.BAD_REQUEST,
        "RI_010"
      );
    }
  }
  return response;
};

/**
 * @httpMethod POST
 * @function edit
 * @async
 * @description Update details of user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.edit = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("POST /edit begins");
    var payload = await processPayload(req.body);
    var [isValidPayload, errorList] = await validatePayload(
      payload,
      updatePayloadSchema
    );
    var response = await processAndGetFinalResponse(
      isValidPayload,
      errorList,
      payload
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(response.statusCode).send(response);
  } catch (ex) {
    logger.error(`POST /edit Captured Error ===> ${ex}`);
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
