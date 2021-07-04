const { ResponseIds, URL } = require("../../Configs/constants.config");
const dashDao = require("./dashDao");
const { format } = require("./main_utils");
const logger = require("../Logger/log");
const httpStatus = require("http-status");

var massageAndGetClientList = function (clientList) {
  var result = [];
  for (var each_client of clientList) {
    result.push({
      email: each_client["email"],
      image: !each_client["img_data"]
        ? URL.defaultProfilePictureUrl
        : each_client["img_data"],
      name: each_client["name"],
    });
  }
  return result;
};

/**
 * @function processAndGetCustomers
 * @async
 * @description Get all the customers and send them to client
 * @param {Object} req
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 */
module.exports.processAndGetCustomers = async function (
  req,
  LoggedInUser,
  AppRes
) {
  var customers = await dashDao.getAllCustomer(LoggedInUser);
  customers = massageAndGetClientList(customers);
  logger.info(`Total Customers: ${customers.length}`);
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
module.exports.processAndGetAdmins = async function (
  req,
  LoggedInUser,
  AppRes
) {
  var admins = await dashDao.getAllAdmins(LoggedInUser);
  admins = massageAndGetClientList(admins);
  logger.info(`total admin: ${admins.length}`);
  var response = await AppRes.buildResponse(
    admins,
    format(ResponseIds.RI_006, ["getAdmins", JSON.stringify(admins)]),
    httpStatus.OK,
    "RI_006"
  );
  return [httpStatus.OK, response];
};
