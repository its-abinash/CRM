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
