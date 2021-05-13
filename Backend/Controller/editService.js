var editServiceDao = require("./editServiceDao");
var logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const { buildResponse, getEndMessage, buildErrorReasons } = require("./response_utils");
const { format, validatePayload, processPayload } = require("./main_utils");
var httpStatus = require("http-status");
const { updatePayloadSchema } = require("./schema");

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
    var dataSaved = await editServiceDao.saveEditedData(email, fields, data);
    if (dataSaved) {
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
 * @function processAndEditUserData
 * @async
 * @description Update details of user
 * @param {Object} req
 */
module.exports.processAndEditUserData = async function (req) {
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
  return [response.statusCode, response];
};
