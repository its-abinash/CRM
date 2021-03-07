var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var session = require("express-session");
var logger = require("../Logger/log");
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());
var { DATABASE, ResponseIds } = require("../../Configs/constants.config");
var { buildResponse, getEndMessage } = require("./response_utils");
const { format } = require("./main_utils");
const httpStatus = require("http-status");

var removeUserData = async function (removeFields, loggedInUserId) {
  // removeFields array will not be empty and will have 2 fields
  email = removeFields[1];
  var isUserRemoved = await db.remove(DATABASE.USERS_MAP, null, removeFields);
  var isChatRemoved = await db.remove(
    DATABASE.CONVERSATION,
    ["sender", "receiver"],
    [loggedInUserId, email]
  );
  return [isUserRemoved, isChatRemoved];
};

var processAndGetFinalResponse = async function (
  removedUser,
  removedConversation
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
 * @httpMethod POST
 * @function delete
 * @async
 * @description Delete user's all data
 * @param {Object} req
 * @param {Object} res
 */
module.exports.delete = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("POST /delete begins");
    var email = req.body.email;
    var removeFields = [req.session.user, email];
    var [isUserRemoved, isChatRemoved] = await removeUserData(
      removeFields,
      req.session.user
    );
    var response = await processAndGetFinalResponse(
      isUserRemoved,
      isChatRemoved
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(response.statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in POST /delete: ${ex}`);
    var response = await buildResponse(
      null,
      ex,
      httpStatus.BAD_GATEWAY
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
