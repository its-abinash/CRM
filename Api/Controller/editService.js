var editServiceDao = require("./editServiceDao");
var logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const { format, validatePayload, processPayload } = require("./main_utils");
var httpStatus = require("http-status");
const { updatePayloadSchema, patchPayloadSchema } = require("./schema");
var lodash = require("lodash");

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
  AppRes
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
    var media = payload.media || {},
      profile_data = payload.profile || {};
    var name = profile_data.name || payload.name;
    var email = profile_data.email || payload.email;
    var phone = profile_data.phone || payload.phone;
    var password = profile_data.password || payload.password;
    var passcode = profile_data.passcode || payload.passcode;
    var rem_freq = profile_data.remainder_freq || payload.remainder_freq;
    var profile_picture = media.profile_picture || payload.profile_picture;
    var fields = [];
    var data = [];
    if (!lodash.isEmpty(name)) {
      fields.push("name");
      data.push(name);
    }
    if (!lodash.isEmpty(phone)) {
      fields.push("phone");
      data.push(phone);
    }
    if (!lodash.isEmpty(rem_freq)) {
      fields.push("remfreq");
      data.push(rem_freq);
    }
    logger.info(`fields: ${fields}, data: ${data}`);
    var credentialSaved = false;
    if (password || passcode) {
      logger.info(`Updating password for user: ${email}`);
      credentialSaved = editServiceDao.updateCredential(
        email,
        password || passcode
      );
    }
    var profile_picture_updated = false;
    if (profile_picture) {
      logger.info(`Updating profile picture for user: ${email}`);
      profile_picture_updated = await editServiceDao.updateProfilePicture(
        email,
        profile_picture
      );
    }
    var dataSaved = await editServiceDao.saveEditedData(email, fields, data);

    dataSaved = profile_picture
      ? dataSaved && profile_picture_updated
      : dataSaved;

    dataSaved = password || passcode ? dataSaved && credentialSaved : dataSaved;

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
  logger.info(`PAYLOAD: ${JSON.stringify(requestPayload)}`);
  var [isValidPayload, errorList] = await validatePayload(
    requestPayload,
    updatePayloadSchema
  );
  var response = await processAndGetFinalResponse(
    isValidPayload,
    errorList,
    requestPayload,
    AppRes
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
  if (!qpArgs) {
    throw "QUERY_PARAMS_NOT_FOUND_IN_URL";
  }
  logger.info(`Query Params in URL: ${JSON.stringify(qpArgs)}`);
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
