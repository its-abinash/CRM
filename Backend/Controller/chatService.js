const chatDao = require("./chatDao");
const logger = require("../Logger/log");
const {
  CSS,
  CYPHER,
  ResponseIds,
  DATABASE,
} = require("../../Configs/constants.config");
const { validatePayload, format } = require("./main_utils");
const httpStatus = require("http-status");
const { chatPostPayloadSchema } = require("./schema");
const AES = require("crypto-js/aes"); // Advanced Encryption Standard
const CryptoJs = require("crypto-js");

/**
 * @async
 * @method processAndGetConversation
 * @description Fetch conversations between login user and requested user
 * @param {Object} req request object
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 */
module.exports.processAndGetConversation = async function (
  req,
  LoggedInUser,
  AppRes
) {
  var sender = LoggedInUser;
  var receiver = req.params.receiverId;
  var chat = await chatDao.getConversation(
    DATABASE.CONVERSATION,
    DATABASE.FETCH_SPECIFIC,
    sender,
    receiver
  );

  for (var i = 0; i < chat.length; i++) {
    chat[i].msg = AES.decrypt(chat[i].msg, CYPHER.DECRYPTION_KEY).toString(
      CryptoJs.enc.Utf8
    );
    chat[i].timestamp = new Date(
      chat[i].timestamp.toString()
    ).toLocaleTimeString();
    chat[i][CSS.CHAT_TIME_LOC] =
      chat[i].sender === sender ? CSS.CHAT_FLOAT_RIGHT : CSS.CHAT_FLOAT_LEFT;
    chat[i][CSS.CHAT_COL] =
      chat[i].sender === sender ? CSS.CHAT_SENDER_COL : CSS.CHAT_RECEIVER_COL;
  }
  var response = await AppRes.buildResponse(
    chat,
    format(ResponseIds.RI_001, [sender, receiver]),
    httpStatus.OK,
    "RI_001"
  );
  return response;
};

/**
 * @async
 * @method processAndSaveConversation
 * @description Save conversations between login user and requested user
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 */
module.exports.processAndSaveConversation = async function (
  LoggedInUser,
  AppRes
) {
  var requestPayload = AppRes.getRequestBody();
  requestPayload["sender"] = LoggedInUser;
  var payload = requestPayload;

  var [isValidPayload, errorList] = await validatePayload(
    payload,
    chatPostPayloadSchema
  );
  if (!isValidPayload) {
    var errorReason = await AppRes.buildErrorReasons(errorList);
    var response = await AppRes.buildResponse(
      null,
      errorReason,
      httpStatus.UNPROCESSABLE_ENTITY,
      "RI_004"
    );
    logger.info(`Invalid Payload with errorList = ${errorList}`);
    return [httpStatus.UNPROCESSABLE_ENTITY, response];
  } else {
    var sender = payload.sender;
    var receiver = payload.receiver;
    var message = payload.chatmsg;

    var reason = format(ResponseIds.RI_002, [sender, receiver]);
    var statusCode = httpStatus.BAD_REQUEST;
    var responseId = "RI_002";

    var data = [sender, receiver, message];
    var jobDone = await chatDao.saveConversation(DATABASE.CONVERSATION, data);
    if (jobDone) {
      logger.info("Success status from database");
      reason = format(ResponseIds.RI_003, [sender, receiver]);
      statusCode = httpStatus.OK;
      responseId = "RI_003";
    } else {
      logger.error("Failure status from database");
    }
    var response = await AppRes.buildResponse(
      null,
      reason,
      statusCode,
      responseId
    );
    return [statusCode, response];
  }
};
