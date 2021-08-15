const { ResponseIds, URL } = require("../../Configs/constants.config");
const dashDao = require("./dashDao");
const { format } = require("./main_utils");
const logger = require("../Logger/log");
const httpStatus = require("http-status");
const lodash = require("lodash");

const CUSTOMER_INFO_KEYS = ["email", "name", "phone", "firstname", "lastname"];
const MEDIA_INFO_KEYS = ["image", "lastmodified", "size", "type", "imagename"];

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
  logger.info(`Total Customers: ${customers.length}`);
  var response = await AppRes.buildResponse(
    customers,
    format(ResponseIds.RI_006, ["Customers"]),
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
  logger.info(`total admin: ${admins.length}`);
  var response = await AppRes.buildResponse(
    admins,
    format(ResponseIds.RI_006, ["getAdmins"]),
    httpStatus.OK,
    "RI_006"
  );
  return [httpStatus.OK, response];
};

/**
 * @function getUserData
 * @async
 * @description Fetches all information of an user
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 * @returns User Information
 */
module.exports.getUserData = async function (LoggedInUser, AppRes) {
  logger.info("In getUserData");
  var userInfo = await dashDao.getUserData(LoggedInUser);
  var results = [];
  for (var eachUserInfo of userInfo) {
    var result = {}
    lodash.forOwn(eachUserInfo, function (value, property) {
      if (lodash.includes(MEDIA_INFO_KEYS, property)) {
        if (lodash.has(result, "media")) {
          result["media"][property] = value;
        } else {
          result["media"] = { [property]: value };
        }
      } else if (lodash.includes(CUSTOMER_INFO_KEYS, property)) {
        result[property] = value;
      }
    });
    results.push(result)
  }
  var response = await AppRes.buildResponse(
    results,
    format(ResponseIds.RI_006, ["user information"]),
    httpStatus.OK,
    "RI_006"
  );
  return [httpStatus.OK, response];
};
