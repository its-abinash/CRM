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
var {
  DATABASE,
  ResponseIds,
} = require("../../Configs/constants.config");
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
exports.delete = async function (req, res) {
  try {
    /**
     * -todo Handle delete customer/Admin for the logged in user "only".
     * - try to save the admin and customer or vise-versa mapping in db.
     * - when the logged-in user deletes another user from dashboard,
     * - it shouldn't reflected to others.
     * - Then try sending/validating appropriate request payload with schema
     * - Ticket available in github with issueId: 31
     */
    logger.info("POST /delete begins");
    logger.info(`POST /delete body ===> ${JSON.stringify(req.body)}`);
    var email = req.body.email;
    logger.info(`Removing '${email}' as customer begins`);
    var removedCustomer = await db.remove(DATABASE.CUSTOMER, "email", email);
    logger.info(`Removing '${email}' as customer ends`);
    logger.info(`Removing Conversation of '${email}' begins`);
    var removedConversation = await db.remove(
      DATABASE.CONVERSATION,
      ["sender", "receiver"],
      [req.session.user, email]
    );
    logger.info(`Removing Conversation of '${email}' ends`);
    logger.info(`Removing Credentials of '${email}' begins`);
    var removedCredentials = await db.remove(
      DATABASE.CREDENTIALS,
      "email",
      email
    );
    logger.info(`Removing Credentials of '${email}' ends`);
    if (removedCustomer && removedConversation && removedCredentials) {
      logger.info(
        "Removed user successfully, so redirecting back to dashboard"
      );
      var response = await buildResponse(
        null,
        format(ResponseIds.RI_007, [
          "Customer, Conversations, Credentials",
          email,
        ]),
        httpStatus.OK,
        "RI_007"
      );
      logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
      res.status(httpStatus.OK).send(response);
    } else {
      logger.error("User removal failed, so redirecting back to dashboard");
      var response = await buildResponse(
        null,
        format(ResponseIds.RI_008, ["Customer", email]),
        httpStatus.BAD_REQUEST,
        "RI_008"
      );
      logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
      res.status(httpStatus.BAD_REQUEST).send(response);
    }
  } catch (ex) {
    logger.error(`Error in POST /delete: ${JSON.stringify(ex, null, 3)}`);
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
