var deleteServiceDao = require("./deleteServiceDao");
var logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const { format } = require("./main_utils");
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
    var reason = [format(ResponseIds.RI_007, ["userMapping, Conversations", email])]
    if(!removedConversation) {
      reason.push(`No conversation found for userId: ${email}`)
    }
    response = await AppRes.buildResponse(
      null,
      reason,
      httpStatus.OK,
      "RI_007"
    );
  } else {
    logger.error("Failed to remove user");
    var reason = [format(ResponseIds.RI_008, ["userMapping, Conversations", email])]
    if(!removedConversation) {
      reason.push(`No conversation found for userId: ${email}`)
    }
    if(!removedUser) {
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
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 */
module.exports.processAndDeleteUserData = async function (LoggedInUser, AppRes) {
  var requestPayload = AppRes.getRequestBody();
  var email = requestPayload.email;
  logger.info(`Request to delete userId: ${email}`);
  var removeFields = [LoggedInUser, email];
  var [isUserRemoved, isChatRemoved] = await deleteServiceDao.removeUserData(
    removeFields,
    LoggedInUser
  );
  var response = await processAndGetFinalResponse(
    isUserRemoved,
    isChatRemoved,
    email,
    AppRes
  );
  return [response.statusCode, response];
};
