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

/**
 * @httpMethod POST
 * @function delete
 * @async
 * @description Delete user's all data
 * @param {Object} req
 * @param {Object} res
 */
module.exports.delete = async function (req, res) {
  try {
    logger.info("POST /delete begins");
    var email = req.body.email;
    var removeFields = [req.session.user, email];
    var isUserRemoved = await db.remove(DATABASE.USERS_MAP, null, removeFields);
    var isChatRemoved = await db.remove(
      DATABASE.CONVERSATION,
      ["sender", "receiver"],
      [req.session.user, email]
    );
    logger.info(`Logged-in user: ${req.session.user} and removing: ${email}`);
    if (isUserRemoved && isChatRemoved) {
      logger.info("Removed user successfully");
      var response = await buildResponse(
        null,
        format(ResponseIds.RI_007, ["userMapping, Conversations", email]),
        httpStatus.OK,
        "RI_007"
      );
      logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
      res.status(httpStatus.OK).send(response);
    } else {
      logger.error("User removal failed");
      var response = await buildResponse(
        null,
        format(ResponseIds.RI_008, ["userMapping, Conversations", email]),
        httpStatus.BAD_REQUEST,
        "RI_008"
      );
      logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
      res.status(httpStatus.BAD_REQUEST).send(response);
    }
  } catch (ex) {
    logger.error(`Error in POST /delete: ${ex}`);
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
