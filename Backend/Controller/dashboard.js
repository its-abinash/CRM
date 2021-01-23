var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
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
 * @function getContacts
 * @async
 * @description Fetch all the customers and their details
 * @returns All Customers
 */
var getContacts = async function () {
  logger.info("Execution of 'getContacts' method begins");
  var is_admin = [false];
  var contacts = await db.fetchAllUserOfGivenType(is_admin);
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
exports.getCustomers = async function (req, res) {
  try {
    logger.info("GET /dashboard/getCustomer begins");
    var customers = await getContacts();
    logger.info(`Customers: ${JSON.stringify(customers, null, 3)}`);
    var response = await buildResponse(
      customers,
      format(ResponseIds.RI_006, ["Customers", JSON.stringify(customers)]),
      HttpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path))
    res.status(HttpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Exception: ${JSON.stringify(ex, null, 3)}`);
    var response = await buildResponse(
      null,
      "exception",
      HttpStatus.BAD_GATEWAY
    );
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
exports.getDashboardPage = async function (req, res) {
  logger.info("GET /dashboard begins");
  res.render("dashboard");
};

/**
 * @description Gets admin List from db
 */
var getAdmins = async function () {
  var is_admin = [true];
  var adminList = await db.fetchAllUserOfGivenType(is_admin);
  return adminList;
};

/**
 * @function getAdmins
 * @async
 * @description Fetches all admins from the db
 * @param {Object} req
 * @param {Object} res
 * @returns List of Admins
 */
exports.getAdmins = async function (req, res) {
  try {
    logger.info(`GET /dashboard/getAdmins begins`);
    var admins = await getAdmins();
    logger.info(
      `adminList received from db: ${JSON.stringify(admins, null, 3)}`
    );
    var response = await buildResponse(
      admins,
      format(ResponseIds.RI_006, ["getAdmins", JSON.stringify(admins)]),
      HttpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path))
    res.status(HttpStatus.OK).send(response);
  } catch (ex) {
    logger.error(
      `Error from GET /dashboard/getAdmin ===> ${JSON.stringify(
        ex,
        null,
        3
      )}`
    );
    var response = await buildResponse(
      null,
      "exception",
      HttpStatus.BAD_GATEWAY
    );
    res.status(HttpStatus.BAD_GATEWAY).send(response);
  }
};
