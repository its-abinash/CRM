const { ResponseIds } = require("../../Configs/constants.config");
const dashDao = require("./dashDao");
const { format } = require("./main_utils");
const logger = require("../Logger/log")
const httpStatus = require("http-status")

/**
 * @function processAndGetCustomers
 * @async
 * @description Get all the customers and send them to client
 * @param {Object} req
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 */
module.exports.processAndGetCustomers = async function (req, LoggedInUser, AppRes) {
  var customers = await dashDao.getAllCustomer(LoggedInUser);
  logger.info(`Customers: ${JSON.stringify(customers, null, 3)}`);
  var response = await AppRes.buildResponse(
    customers,
    format(ResponseIds.RI_006, ["Customers", JSON.stringify(customers)]),
    httpStatus.OK,
    "RI_006"
  );
  return [httpStatus.OK, response];
};

/**
 * @function processAndGetAdmins
 * @async
 * @description Fetches all admins from the db
 * @param {Object} req
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 * @returns List of Admins
 */
module.exports.processAndGetAdmins = async function (req, LoggedInUser, AppRes) {
  var admins = await dashDao.getAllAdmins(LoggedInUser);
  logger.info(`adminList: ${JSON.stringify(admins, null, 3)}`);
  var response = await AppRes.buildResponse(
    admins,
    format(ResponseIds.RI_006, ["getAdmins", JSON.stringify(admins)]),
    httpStatus.OK,
    "RI_006"
  );
  return [httpStatus.OK, response];
};
