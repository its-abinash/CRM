const { DATABASE } = require("../../Configs/constants.config");
var db = require("../../Database/databaseOperations");

module.exports.removeUserData = async function (removeFields, loggedInUserId) {
  // removeFields array will not be empty and will have 2 fields
  email = removeFields[1];
  try {
    var isUserRemoved = await db.remove(DATABASE.USERS_MAP, null, removeFields);
    var isChatRemoved = await db.remove(
      DATABASE.CONVERSATION,
      ["sender", "receiver"],
      [loggedInUserId, email]
    );
    return [isUserRemoved, isChatRemoved];
  } catch (exc) {
    throw exc;
  }
};

module.exports.removeDataOnFailure = async function (userMap = [], email = null) {
  try {
    await db.remove(DATABASE.CUSTOMER, "email", email);
    await db.remove(DATABASE.CREDENTIALS, "email", email);
    for (const each_map of userMap) {
      await db.remove(DATABASE.USERS_MAP, null, each_map);
    }
  } catch (exc) {
    throw exc;
  }
};
