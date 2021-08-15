const db = require("../../Database/databaseOperations");

/**
 * @function getAllCustomer
 * @async
 * @description Fetch all the customers and their details
 * @returns All Customers
 */
module.exports.getAllCustomer = async function (logged_in_user_id) {
  try {
    var data = [logged_in_user_id, false];
    var customerList = await db.fetchAllUsersForGivenUserId(data);
    return customerList;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function getAllAdmins
 * @async
 * @description Gets admin List from db
 */
module.exports.getAllAdmins = async function (logged_in_user_id) {
  try {
    var data = [logged_in_user_id, true];
    var adminList = await db.fetchAllUsersForGivenUserId(data);
    return adminList;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function getUserData
 * @async
 * @description Gets an user's info from db
 */
 module.exports.getUserData = async function (logged_in_user_id) {
  try {
    var data = logged_in_user_id;
    var userData = await db.fetchUserData(data);
    return userData;
  } catch (exc) {
    throw exc;
  }
};
