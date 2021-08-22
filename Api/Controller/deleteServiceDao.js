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
    // TODO need to remove from all DB. || Design change ||
    return [Boolean(isUserRemoved), Boolean(isChatRemoved)];
  } catch (exc) {
    throw exc;
  }
};

module.exports.removeDataOnFailure = async function (
  userMap = [],
  email = null
) {
  try {
    var cusDel = await db.remove(DATABASE.CUSTOMER, "email", email);
    var credDel = await db.remove(DATABASE.CREDENTIALS, "email", email);
    var umDel = 0;
    for (const each_map of userMap) {
      var result = await db.remove(DATABASE.USERS_MAP, null, each_map);
      umDel += result;
    }
    return Boolean(cusDel) && Boolean(credDel) && Boolean(umDel);
  } catch (exc) {
    throw exc;
  }
};

module.exports.deleteSpecificUserData = async function (
  loggedInUserId,
  fields,
  values,
  tables
) {
  try {
    var dataRemoved = await db.updateSpecificUserData(
      "email",
      loggedInUserId,
      fields,
      values,
      tables
    );
    return dataRemoved;
  } catch (exc) {
    throw exc;
  }
};
