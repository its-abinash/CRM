var deleteServiceDao = require("./deleteServiceDao");
var logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const { format } = require("./main_utils");
var httpStatus = require("http-status");
var session = require("express-session");

var processAndGetFinalResponse = async function (
  removedUser,
  removedConversation,
  email,
  AppRes
) {
  var response = {};
  if (removedUser && removedConversation) {
    logger.info("Removed user successfully");
    response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_007, ["userMapping, Conversations", email]),
      httpStatus.OK,
      "RI_007"
    );
  } else {
    logger.error("Failed to remove user");
    response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_008, ["userMapping, Conversations", email]),
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
