const chatDao = require("./chatDao");
const logger = require("../Logger/log");
const {
  CSS,
  CYPHER,
  ResponseIds,
  DATABASE,
} = require("../../Configs/constants.config");
const {
  buildResponse,
  getEndMessage,
  buildErrorReasons,
} = require("./response_utils");
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
 */
module.exports.processAndGetConversation = async function (req) {
  var sender = req.session.user;
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
  logger.info(`Chat between ${sender} and ${receiver} received`);
  var response = await buildResponse(
    chat,
    format(ResponseIds.RI_001, [sender, receiver]),
    httpStatus.OK,
    "RI_001"
  );
  logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
  return response;
};

/**
 * @async
 * @method processAndSaveConversation
 * @description Save conversations between login user and requested user
 * @param {Object} req request object
 */
module.exports.processAndSaveConversation = async function (req) {
  req.body["sender"] = req.session.user;
  var payload = req.body;

  var [isValidPayload, errorList] = await validatePayload(
    payload,
    chatPostPayloadSchema
  );
  if (!isValidPayload) {
    var errorReason = await buildErrorReasons(errorList);
    var response = await buildResponse(
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
    var response = await buildResponse(null, reason, statusCode, responseId);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    return [statusCode, response];
  }
};
