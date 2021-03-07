var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var session = require("express-session");
var db = require("../../Database/databaseOperations");
var logger = require("../Logger/log");
var { ResponseIds } = require("../../Configs/constants.config");
var { buildResponse, getEndMessage } = require("./response_utils");
const { format } = require("./main_utils");
const HttpStatus = require("http-status");
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

/**
 * @function getAllCustomer
 * @async
 * @description Fetch all the customers and their details
 * @returns All Customers
 */
var getAllCustomer = async function (logged_in_user_id) {
  logger.info("In getAllCustomer");
  var data = [logged_in_user_id, false];
  var contacts = await db.fetchAllUsersForGivenUserId(data);
  return contacts;
};

/**
 * @httpMethod GET
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
    var customers = await getAllCustomer(req.session.user);
    logger.info(`Customers: ${JSON.stringify(customers, null, 3)}`);
    var response = await buildResponse(
      customers,
      format(ResponseIds.RI_006, ["Customers", JSON.stringify(customers)]),
      HttpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(HttpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Exception: ${JSON.stringify(ex, null, 3)}`);
    var response = await buildResponse(
      null,
      "exception",
      HttpStatus.BAD_GATEWAY
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(HttpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @function getDashboardPage
 * @async
 * @description Render the dashboard html file
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getDashboardPage = async function (req, res) {
  logger.info("GET /dashboard begins");
  res.render("dashboard");
};

/**
 * @function getAllAdmins
 * @async
 * @description Gets admin List from db
 */
var getAllAdmins = async function (logged_in_user_id) {
  var data = [logged_in_user_id, true];
  var adminList = await db.fetchAllUsersForGivenUserId(data);
  return adminList;
};

/**
 * @httpMethod GET
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
    var admins = await getAllAdmins(req.session.user);
    logger.info(`adminList: ${JSON.stringify(admins, null, 3)}`);
    var response = await buildResponse(
      admins,
      format(ResponseIds.RI_006, ["getAdmins", JSON.stringify(admins)]),
      HttpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(HttpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error in ${req.method} ${req.path}: ${ex}`);
    var response = await buildResponse(
      null,
      "exception",
      HttpStatus.BAD_GATEWAY
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(HttpStatus.BAD_GATEWAY).send(response);
  }
};
