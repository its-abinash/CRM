const { DATABASE } = require("../../Configs/constants.config");
var db = require("../../Database/databaseOperations");

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
module.exports.updateProfilePicture = async function (email, blob) {
  try {
    var imageSaved = await db.updateMedia("email", email, blob);
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
