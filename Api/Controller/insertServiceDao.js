const { DATABASE } = require("../../Configs/constants.config");
var db = require("../../Database/databaseOperations");

module.exports.saveImageIntoDB = async function (LoggedInUser, imgUri) {
  try {
    var fields = ["image"]
    var values = [imgUri]
    var mediaUpdated = await db.updateMedia("email", LoggedInUser, fields, values);
    return mediaUpdated;
  } catch (exc) {
    throw exc;
  }
};

module.exports.insertUserData = async function (tableID, data) {
  try {
    var result = await db.insert(tableID, data);
    return result;
  } catch (exc) {
    throw exc;
  }
};
