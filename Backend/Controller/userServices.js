var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var logger = require("../Logger/log");
var httpStatus = require("http-status");
var deleteServiceDao = require("./deleteServiceDao");
var chatService = require("./chatService");
var deleteService = require("./deleteService");
var editService = require("./editService");
var insertService = require("./insertService");
var emailService = require("./emailService");
var dashService = require("./dashService");

const { ResponseIds } = require("../../Configs/constants.config");
const { buildResponse, getEndMessage } = require("./response_utils");
const { isLoggedInUser } = require("./main_utils");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

/**
 * @httpMethod GET
 * @endpoint /dashboard
 * @function getDashboardPage
 * @async
 * @description Render the dashboard html file
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getDashboardPage = async function (req, res) {
  logger.info("GET /dashboard begins");
  var isSessionValid = await isLoggedInUser(req);
  if (isSessionValid) {
    res.render("dashboard");
  }else {
    logger.error(`Error in GET /dashboard: Session is invalid`);
    var response = await buildResponse(
      null,
      ResponseIds.RI_015,
      httpStatus.BAD_GATEWAY,
      "RI_015"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @endpoint /dashboard/getCustomer
 * @function getCustomers
 * @async
 * @description Get all the customers and send them to client
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getCustomers = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("GET /dashboard/getCustomer begins");
    var [statusCode, response] = await dashService.processAndGetCustomers(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Exception: ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @endpoint /dashboard/getAdmins
 * @function getAdmins
 * @async
 * @description Fetches all admins from the db
 * @param {Object} req
 * @param {Object} res
 * @returns List of Admins
 */
module.exports.getAdmins = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info(`GET /dashboard/getAdmins begins`);
    var [statusCode, response] = await dashService.processAndGetAdmins(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in ${req.method} ${req.path}: ${ex}`);
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @endpoint /chat/{receiverId}
 * @async
 * @function getConversation
 * @description Fetch conversations between login user and requested user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getConversation = async function (req, res) {
  /* When fetching Chat Conversations, we have to decrypt the encoded message */
  req._initialTime = Date.now();
  try {
    var response = await chatService.processAndGetConversation(req);
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error in GET /Chat with msg: ${ex}`);
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /chat
 * @function chat
 * @async
 * @description Save the conversation of 2 persons
 * @param {Object} req
 * @param {Object} res
 */
module.exports.chat = async function (req, res) {
  /*
    The Chat Conversation is end-end protected with encryption. Hence, the messages will be
    stored in the database are totally encrypted.
    */
  req._initialTime = Date.now();
  try {
    logger.info("POST /chat begins");
    var [statusCode, response] = await chatService.processAndSaveConversation(
      req
    );
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(
      `Error in POST /chat with msg: ${JSON.stringify(ex, null, 3)}`
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /delete
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
    var [statusCode, response] = await deleteService.processAndDeleteUserData(
      req
    );
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in POST /delete: ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /edit
 * @function edit
 * @async
 * @description Update details of user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.edit = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("POST /edit begins");
    var [statusCode, response] = await editService.processAndEditUserData(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`POST /edit Captured Error: ${ex}`);
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /insert
 * @function insert
 * @async
 * @description Inserts user data
 * @param {Object} req
 * @param {Object} res
 */
module.exports.insert = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("POST /insert begins");
    var [statusCode, response] = await insertService.processAndInsertUserData(
      req
    );
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in POST /insert: ${ex}`);
    var email = req.body.email;
    await deleteServiceDao.removeDataOnFailure([], email.toLowerCase());
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /insert/profilePicture
 * @function insert
 * @async
 * @description Inserts profile picture of user into db
 * @param {Object} req
 * @param {Object} res
 */
module.exports.insertProfilePicture = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("POST /insert/profilePicture begins");
  try {
    var [statusCode, response] =
      await insertService.processAndInsertProfilePicture(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in POST /insert/profilePicture: ${ex}`);
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /email
 * @function email
 * @async
 * @description Sends email to user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.email = async function (req, res) {
  req._initialTime = Date.now();
  try {
    logger.info("POST /email begins");
    var [statusCode, response] = await emailService.processAndSendEmail(req);
    res.status(statusCode).send(response);
  } catch (ex) {
    logger.error(`Error in POST /email: ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
