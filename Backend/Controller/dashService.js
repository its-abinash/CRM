const { ResponseIds } = require("../../Configs/constants.config");
const dashDao = require("./dashDao");
const { format } = require("./main_utils");
const { buildResponse, getEndMessage } = require("./response_utils");
const logger = require("../Logger/log")
const httpStatus = require("http-status")

/**
 * @function processAndGetCustomers
 * @async
 * @description Get all the customers and send them to client
 * @param {Object} req
 */
module.exports.processAndGetCustomers = async function (req) {
  var customers = await dashDao.getAllCustomer(req.session.user);
  logger.info(`Customers: ${JSON.stringify(customers, null, 3)}`);
  var response = await buildResponse(
    customers,
    format(ResponseIds.RI_006, ["Customers", JSON.stringify(customers)]),
    httpStatus.OK,
    "RI_006"
  );
  logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
  return [httpStatus.OK, response];
};

/**
 * @function processAndGetAdmins
 * @async
 * @description Fetches all admins from the db
 * @param {Object} req
 * @param {Object} res
 * @returns List of Admins
 */
module.exports.processAndGetAdmins = async function (req, res) {
  var admins = await dashDao.getAllAdmins(req.session.user);
  logger.info(`adminList: ${JSON.stringify(admins, null, 3)}`);
  var response = await buildResponse(
    admins,
    format(ResponseIds.RI_006, ["getAdmins", JSON.stringify(admins)]),
    httpStatus.OK,
    "RI_006"
  );
  logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
  return [httpStatus.OK, response];
};
