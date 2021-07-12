const db = require("../../Database/databaseOperations");
const { DATABASE } = require("../../Configs/constants.config");
const jp = require("jsonpath")

/**
 * @function getCustomerForRemainderFromDB
 * @description gets the latest remainder information from database
 * @returns List of emailIds
 */
module.exports.getCustomerForRemainderFromDB = async function () {
  try {
    var remInfo = await db.fetchLatestRemainder();
    return remInfo;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function updateRemainderDateInDB
 * @description Updates the next_remainder for the customers in DB
 * @param {Array} customers
 */
module.exports.updateRemainderDateInDB = async function (customers) {
  try {
    for (const customer of customers) {
      var date = new Date();
      date.setDate(date.getDate() + parseInt(customer.remfreq));
      var next_remainder = date.toLocaleDateString();
      await db.update(
        DATABASE.CUSTOMER,
        "email",
        customer.email,
        ["next_remainder"],
        [next_remainder]
      );
    }
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function getImageOfLoggedInUser
 * @async
 * @description Fetch the image base64 string and the name of the user
 * @param {String} loggedInUser user_id of logged-in user
 */
module.exports.getImageOfLoggedInUser = async function (loggedInUser) {
  try {
    var userData = await db.fetch(
      DATABASE.CUSTOMER,
      DATABASE.FETCH_SPECIFIC,
      "email",
      loggedInUser
    );
    return [userData[0].img_data, userData[0].name];
  } catch (ex) {
    throw ex;
  }
};

module.exports.getUserTypeFromDB = async function (userId) {
  try {
    var userType = await db.fetch(
      DATABASE.CREDENTIALS,
      DATABASE.FETCH_SPECIFIC,
      "email",
      userId || "demo@domain.com"
    );
    var expr = "$..is_admin";
    var result = jp.query(userType, expr);
    return result;
  } catch (exc) {
    throw exc;
  }
};
