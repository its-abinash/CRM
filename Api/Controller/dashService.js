const { ResponseIds, URL } = require("../../Configs/constants.config");
const dashDao = require("./dashDao");
const { format } = require("./main_utils");
const logger = require("../Logger/log");
const httpStatus = require("http-status");
const lodash = require("lodash");
const coreServiceDao = require("./coreServiceDao");

const CUSTOMER_INFO_KEYS = ["email", "name", "phone", "firstname", "lastname"];
const MEDIA_INFO_KEYS = ["image", "lastmodified", "size", "type", "imagename"];

var getUsers = async function (userId, isAdmin, limit, offset, isSearchTextEmpty) {
  if (isAdmin) {
    var users = await dashDao.getAllAdmins(userId, limit, offset, isSearchTextEmpty);
    return users;
  } else {
    var users = await dashDao.getAllCustomer(userId, limit, offset, isSearchTextEmpty);
    return users;
  }
};

var getImagesOfUsers = async function (users) {
  for (var eachUser of users) {
    eachUser["image"] = await dashDao.getImage(eachUser["email"]);
  }
  return users;
};

var getCommonUsers = function (userlist1, userlist2) {
  var result = lodash.intersectionBy(userlist1, userlist2, "email");
  return result;
};

/**
 * @function processAndGetUsers
 * @async
 * @description Fetches all users from the db according to queryParams
 * @param {String} loggedInUser
 * @param {Class} AppRes
 * @returns List of Users
 */
module.exports.processAndGetUsers = async function (loggedInUser, AppRes) {
  var qpArgs = AppRes.getQueryParams();
  logger.info(`QueryParams: ${JSON.stringify(qpArgs)}`);
  var userType;
  if (
    lodash.isEmpty(qpArgs) ||
    (!lodash.isEmpty(qpArgs) && !lodash.has(qpArgs, "admin"))
  ) {
    var isAdmin = await coreServiceDao.getUserTypeFromDB(loggedInUser);
    userType = !isAdmin;
  } else {
    userType = qpArgs["admin"] == "false" ? false : true;
  }
  var searchText = qpArgs["searchText"];
  var limit = qpArgs["limit"];
  var offset = qpArgs["offset"];
  var users = await getUsers(
    loggedInUser,
    userType,
    limit,
    offset,
    lodash.isEmpty(searchText)
  );
  if (lodash.isEmpty(qpArgs) || lodash.isEmpty(searchText)) {
    var response = await AppRes.buildResponse(
      users,
      format(ResponseIds.RI_006, [userType ? "getAdmins" : "getCustomers"]),
      httpStatus.OK,
      "RI_006",
      [userType ? "getAdmins" : "getCustomers"]
    );
    return [httpStatus.OK, response];
  }
  var result = await dashDao.getAllUsers(searchText);
  users = getCommonUsers(users, result);
  users = await getImagesOfUsers(users);

  var response = await AppRes.buildResponse(
    users,
    format(ResponseIds.RI_006, [searchText]),
    httpStatus.OK,
    "RI_006",
    [searchText]
  );
  return [httpStatus.OK, response];
};

/**
 * @function getUserData
 * @async
 * @description Fetches all information of an user
 * @param {String} userId Fetch data of this user
 * @param {Class} AppRes
 * @returns User Information
 */
module.exports.getUserData = async function (userId, AppRes) {
  logger.info("In getUserData");
  var userInfo = await dashDao.getUserData(userId);
  var results = [];
  for (var eachUserInfo of userInfo) {
    var result = {};
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
    results.push(result);
  }
  var response = await AppRes.buildResponse(
    results,
    format(ResponseIds.RI_006, ["user information"]),
    httpStatus.OK,
    "RI_006",
    ["user information"]
  );
  return [httpStatus.OK, response];
};
