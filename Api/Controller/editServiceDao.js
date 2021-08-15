const { DATABASE } = require("../../Configs/constants.config");
var db = require("../../Database/databaseOperations");
var lodash = require("lodash");

/**
 * @function saveEditedData
 * @async
 * @description update user data in db
 * @returns Boolean (True/False)
 */
module.exports.saveEditedData = async function (email, fields, data) {
  try {
    var dataSaved = await db.update(
      DATABASE.CUSTOMER,
      "email",
      email,
      fields,
      data
    );
    return dataSaved;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function updateProfilePicture
 * @async
 * @description update user's profile picture
 * @returns Boolean (True/False)
 */
module.exports.updateProfilePicture = async function (email, data) {
  try {
    var properties = [];
    var values = [];
    lodash.forOwn(data, function (value, property) {
      properties.push(property);
      values.push(value);
    });
    var imageSaved = await db.updateMedia("email", email, properties, values);
    return imageSaved;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function updateProfilePicture
 * @async
 * @description update user's credential
 * @returns Boolean (True/False)
 */
module.exports.updateCredential = async function (email, cred) {
  try {
    var credentialSaved = await db.update(
      DATABASE.CREDENTIALS,
      "email",
      email,
      ["password"],
      [cred]
    );
    return credentialSaved;
  } catch (exc) {
    throw exc;
  }
};
