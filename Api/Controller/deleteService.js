var deleteServiceDao = require("./deleteServiceDao");
var logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const { format, getFieldsAndValuesFromQpArgs } = require("./main_utils");
var httpStatus = require("http-status");

var processAndGetFinalResponse = async function (
  removedUser,
  removedConversation,
  email,
  AppRes
) {
  var response = {};
  if (removedUser) {
    logger.info("Removed user successfully");
    var reason = [
      format(ResponseIds.RI_007, ["userMapping, Conversations", email]),
    ];
    if (!removedConversation) {
      reason.push(`No conversation found for userId: ${email}`);
    }
    response = await AppRes.buildResponse(
      null,
      reason,
      httpStatus.OK,
      "RI_007"
    );
  } else {
    logger.error("Failed to remove user");
    var reason = [
      format(ResponseIds.RI_008, ["userMapping, Conversations", email]),
    ];
    if (!removedConversation) {
      reason.push(`No conversation found for userId: ${email}`);
    }
    if (!removedUser) {
      reason.push(`No user found with userId: ${email}`);
    }
    response = await AppRes.buildResponse(
      null,
      reason,
      httpStatus.BAD_REQUEST,
      "RI_008"
    );
  }
  return response;
};

/**
 * @function processAndDeleteUserData
 * @async
 * @description Delete user's all data
 * @param {String} userId
 * @param {Class} AppRes
 */
module.exports.processAndDeleteUserData = async function (
  userId,
  AppRes,
  removeall = false
) {
  if (!removeall) {
    var qpArgs = AppRes.getQueryParams();
    logger.info(`Query Params in URL: ${JSON.stringify(qpArgs)}`)
    var [fields, values, tables] = getFieldsAndValuesFromQpArgs(qpArgs);
    logger.info(`Delete fields: ${fields} from tables: ${tables}`);
    var dataRemoved = await deleteServiceDao.deleteSpecificUserData(
      userId,
      fields,
      values,
      tables
    );
    var reasons = [format(ResponseIds.RI_008, ["image", userId])];
    var statusCode = httpStatus.BAD_REQUEST;
    var respCode = "RI_008";

    if (dataRemoved) {
      reasons = [format(ResponseIds.RI_007, ["image", userId])];
      statusCode = httpStatus.OK;
      respCode = "RI_007";
    }
    var response = await AppRes.buildResponse(null, reasons, statusCode, respCode);
    return [response.statusCode, response];
  }

  var requestPayload = AppRes.getRequestBody();
  var email = requestPayload.email;
  logger.info(`Request to delete userId: ${email}`);
  var removeFields = [userId, email];
  var [isUserRemoved, isChatRemoved] = await deleteServiceDao.removeUserData(
    removeFields,
    userId
  );
  var response = await processAndGetFinalResponse(
    isUserRemoved,
    isChatRemoved,
    email,
    AppRes
  );
  return [response.statusCode, response];
};
