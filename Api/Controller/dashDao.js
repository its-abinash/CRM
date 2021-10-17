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
 * @function getAllUsers
 * @async
 * @description Gets users List from db by search text
 */
 module.exports.getAllUsers = async function (searchText) {
  try {
    var users = await db.getUsersBySearchText(searchText);
    return users;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function getImage
 * @async
 * @description Gets image data of user
 */
 module.exports.getImage = async function (userId) {
  try {
    var img = await db.getImgOfUser(userId);
    return img;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function getUserData
 * @async
 * @description Gets an user's info from db
 */
 module.exports.getUserData = async function (userid) {
   /**
    * This function will return userdata as following format:
    [{
      email: "email@domain.com",
      name: "name",
      phone: "1234567",
      firstname: "firstname",
      lastname: "lastname",
      image: "data: image/jpeg <base64>",
      lastmodified: "123344",
      imagename: "myimg",
      type: "jpeg",
      size: "123"
    }]
    */
  try {
    var userData = await db.fetchUserData(userid);
    return userData;
  } catch (exc) {
    throw exc;
  }
};
