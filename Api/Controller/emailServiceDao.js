const { DATABASE } = require("../../Configs/constants.config");
const db = require("../../Database/databaseOperations");

const EMAIL = "email";

/**
 * @function getPassCode
 * @async
 * @description Gets the Google App Password of the sender
 * @param {string} email
 * @returns Sends Google App Password as an acknowledgement
 */
module.exports.getPassCode = async function (email) {
  try {
    var userCred = await db.fetch(
      DATABASE.CREDENTIALS,
      DATABASE.FETCH_SPECIFIC,
      EMAIL,
      email
    );
    return userCred[0].passcode;
  } catch (exc) {
    throw exc;
  }
};
