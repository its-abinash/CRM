var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var session = require("express-session");
var fs = require("fs");
var logger = require("../Logger/log");
let ENV = JSON.parse(fs.readFileSync("./Configs/routes.config.json", "utf-8"));
var { DATABASE, STATUSCODE } = require("../../Configs/constants.config");

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
    logger.info(
      `Customers data received from db ===> ${JSON.stringify(
        customers,
        null,
        3
      )}`
    );
    res.status(STATUSCODE.SUCCESS).send({
      reason: "success",
      statusCode: STATUSCODE.SUCCESS,
      values: customers,
      total: customers.length,
    });
  } catch (ex) {
    logger.error(
      "Exception status from database, so redirecting back to dashboard"
    );
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).send({
      reason: "exception",
      statusCode: STATUSCODE.INTERNAL_SERVER_ERROR,
      values: [],
      total: 0,
    });
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
    res.status(STATUSCODE.SUCCESS).send({
      reason: "success",
      statusCode: STATUSCODE.SUCCESS,
      values: admins,
      total: admins.length,
    });
  } catch (ex) {
    logger.error(
      `Error Captured from GET /dashboard/getAdmin ===> ${JSON.stringify(
        ex,
        null,
        3
      )}`
    );
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).send({
      reason: "Exception",
      statusCode: STATUSCODE.INTERNAL_SERVER_ERROR,
      values: [],
      total: 0,
    });
  }
};
