var deleteServiceDao = require("./deleteServiceDao")
var logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const {buildResponse} = require("./response_utils");
const { format } = require("./main_utils");
var httpStatus = require("http-status")
var session = require("express-session");

var processAndGetFinalResponse = async function (
  removedUser,
  removedConversation,
  email
) {
  var response = {};
  if (removedUser && removedConversation) {
    logger.info("Removed user successfully");
    response = await buildResponse(
      null,
      format(ResponseIds.RI_007, ["userMapping, Conversations", email]),
      httpStatus.OK,
      "RI_007"
    );
  } else {
    logger.error("Failed to remove user");
    response = await buildResponse(
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
 * @param {Object} req
 */
module.exports.processAndDeleteUserData = async function (req) {
  var email = req.body.email;
  var removeFields = [req.session.user, email];
  var [isUserRemoved, isChatRemoved] = await deleteServiceDao.removeUserData(
    removeFields,
    req.session.user
  );
  var response = await processAndGetFinalResponse(isUserRemoved, isChatRemoved, email);
  return [response.statusCode, response];
};
