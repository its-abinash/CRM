const chatDao = require("./chatDao");
const logger = require("../Logger/log");
const {
  ResponseIds,
  DATABASE,
  redisClient,
  URL,
} = require("../../Configs/constants.config");
const { validatePayload, format } = require("./main_utils");
const httpStatus = require("http-status");
const { chatPostPayloadSchema } = require("./schema");
const lodash = require("lodash");
const { socket } = require("../../Configs/settings");

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
  var sender = AppRes.decryptKeyStable(req.params.senderId) || LoggedInUser;
  var receiver = AppRes.decryptKeyStable(req.params.receiverId);
  var [SenderToReceiver, ReceiverToSender] = await chatDao.getConversationWithImage(sender, receiver);
  var chatList = [...SenderToReceiver, ...ReceiverToSender];
  chatList.sort(function(senderChat, receiverChat) {
    return senderChat.timestamp - receiverChat.timestamp
  });
  for (var eachChat of chatList) {
    eachChat["timestamp"] = lodash.toNumber(eachChat["timestamp"]);
    eachChat["chatmsg"] = AppRes.decryptKey(eachChat["msg"]);
    eachChat["locale"] = AppRes.getLocale();
    delete eachChat["msg"];
  }
  var response = await AppRes.buildResponse(
    chatList,
    format(ResponseIds.RI_001, [sender, receiver]),
    httpStatus.OK,
    "RI_001",
    [sender, receiver]
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
    var timestamp = payload.timestamp;

    var reason = format(ResponseIds.RI_002, [sender, receiver]);
    var translateCodes = [sender, receiver]
    var statusCode = httpStatus.BAD_REQUEST;
    var responseId = "RI_002";

    var data = [sender, receiver, message, timestamp];
    var jobDone = await chatDao.saveConversation(DATABASE.CONVERSATION, data);
    if (jobDone) {

      logger.info("Chat has been successfully processed, publishing to socket");
      socket.emit("ChatSync", payload);

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
      responseId,
      translateCodes
    );
    return [statusCode, response];
  }
};

module.exports.checkAndGetNotifications = async function (loginUser, AppRes) {
  var pathParams = AppRes.getCommaSepPathParams();
  var result = {};
  for (const each_param of pathParams.userIds) {
    var key = String(each_param) + "," + String(loginUser);
    var encKey = AppRes.encryptKeyStable(key);
    var isNotificationFound = await redisClient.getAsync(encKey);
    result[each_param] = Boolean(isNotificationFound) || false;
    if (Boolean(isNotificationFound)) {
      await redisClient.delAsync(encKey);
    }
  }
  var encResult = AppRes.encryptKey(result);
  var response = await AppRes.buildResponse(encResult, "", httpStatus.OK);
  return [httpStatus.OK, response];
};
