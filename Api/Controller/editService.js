var editServiceDao = require("./editServiceDao");
var logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const { format, validatePayload, processPayload } = require("./main_utils");
var httpStatus = require("http-status");
const { updatePayloadSchema, patchPayloadSchema } = require("./schema");

var isEmptyPropertyFound = async function (payload) {
  var emptyPropertyList = [];
  for (const property in payload) {
    if (
      payload[property] in [null, "undefined"] ||
      String(payload[property]).length == 0
    ) {
      emptyPropertyList.push(property);
    }
  }
  return emptyPropertyList;
};

var processAndGetFinalResponse = async function (
  isValidPayload,
  errorList,
  payload,
  AppRes,
  updateOperation = false
) {
  var response = {};
  if (!isValidPayload) {
    logger.info(`Invalid Payload with errorList = ${errorList}`);
    var reasons = await AppRes.buildErrorReasons(errorList);
    response = await AppRes.buildResponse(
      null,
      reasons,
      httpStatus.UNPROCESSABLE_ENTITY,
      "RI_004"
    );
  } else {
    if (updateOperation) {
      var emptyPropertyList = await isEmptyPropertyFound(payload);
      if (emptyPropertyList.length > 0) {
        logger.error(
          `Values not found for properties: [${emptyPropertyList}] in payload for update operation`
        );
        response = await AppRes.buildResponse(
          null,
          format(ResponseIds.RI_033, [emptyPropertyList]),
          httpStatus.BAD_REQUEST,
          "RI_033"
        );
        return response;
      }
    }
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
      response = await AppRes.buildResponse(
        null,
        format(ResponseIds.RI_009, ["information", email]),
        httpStatus.OK,
        "RI_009"
      );
    } else {
      logger.error("failed to update in db");
      response = await AppRes.buildResponse(
        null,
        format(ResponseIds.RI_010, ["information", email]),
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
 * @description Update details of userlogedinuser:
 * @param {Class} AppRes
 */
module.exports.processAndEditUserData = async function (AppRes) {
  var requestPayload = AppRes.getRequestBody();
  var payload = await processPayload(requestPayload);
  payload["phone"] = String(payload["phone"]);
  var [isValidPayload, errorList] = await validatePayload(
    payload,
    updatePayloadSchema
  );
  const updateOperation = true;
  var response = await processAndGetFinalResponse(
    isValidPayload,
    errorList,
    payload,
    AppRes,
    updateOperation
  );
  return [response.statusCode, response];
};

/**
 * @function processAndUpdateUserProperty
 * @async
 * @description Patch details of userlogedinuser:
 * @param {Class} AppRes
 */
module.exports.processAndUpdateUserProperty = async function (AppRes) {
  var qpArgs = AppRes.getQueryParams();
  if(!qpArgs) {
    throw "QUERY_PARAMS_NOT_FOUND_IN_URL"
  }
  var [isValidPayload, errorList] = await validatePayload(
    qpArgs,
    patchPayloadSchema
  );
  var response = await processAndGetFinalResponse(
    isValidPayload,
    errorList,
    qpArgs,
    AppRes
  );
  return [response.statusCode, response];
};
