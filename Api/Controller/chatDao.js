var db = require("../../Database/databaseOperations");

/**
 * @function saveConversation
 * @async
 * @description Save the conversation between 2 persons in db
 * @param {Number} tableID
 * @param {Array} data
 * @returns Acknowledgement of saving conversations(Boolean)
 */
module.exports.saveConversation = async function (tableID, data) {
  try {
    return await db.insert(tableID, data);
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function getConversation
 * @async
 * @description Get the conversation between 2 persons from db
 * @param {Number} tableID
 * @param {String} fetchType
 * @param {String} sender
 * @param {String} receiver
 * @returns Acknowledgement of saving conversations(Boolean)
 */
module.exports.getConversation = async function (
  tableID,
  fetchType,
  sender,
  receiver
) {
  try {
    var chat = await db.fetch(tableID, fetchType, sender, receiver);
    return chat;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @function getConversationWithImage
 * @async
 * @description Get the conversation between 2 persons from both customer & conversations table
 * @param {Number} tableID
 * @param {String} fetchType
 * @param {String} sender
 * @param {String} receiver
 * @returns Acknowledgement of saving conversations(Boolean)
 */
module.exports.getConversationWithImage = async function (
  sender,
  receiver
) {
  try {
    var chat = await db.fetchConversationWithImg(sender, receiver);
    return chat;
  } catch (exc) {
    throw exc;
  }
};
