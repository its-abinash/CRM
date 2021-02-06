var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var session = require("express-session");
var logger = require("../Logger/log");
var AES = require("crypto-js/aes"); // Advanced Encryption Standard
var CryptoJs = require("crypto-js");
var {
  DATABASE,
  CSS,
  CYPHER,
  ResponseIds,
} = require("../../Configs/constants.config");
var HttpStatus = require("http-status");
var {
  buildResponse,
  getEndMessage,
  buildErrorReasons,
} = require("./response_utils");
var { format, validatePayload } = require("./main_utils");
var { chatPostPayloadSchema } = require("./schema");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

/**
 * @httpMethod GET
 * @async
 * @function getConversation
 * @description Fetch previous conversations between 2 persons
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getConversation = async function (req, res) {
  /* When fetching Chat Conversations, we have to decrypt the encoded message */
  try {
    logger.info("GET /Chat begins");
    var sender = req.session.user;
    var receiver = req.params.receiverId;
    var chat = await db.fetch(
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
      HttpStatus.OK,
      "RI_001"
    );
    var finalMsg = getEndMessage(ResponseIds.RI_005, req.method, req.path);
    logger.info(finalMsg);
    res.status(HttpStatus.OK).send(response);
  } catch (ex) {
    logger.error(
      `Exceptions in GET /Chat with msg: ${JSON.stringify(ex, null, 3)}`
    );
    var response = await buildResponse(
      null,
      "exception",
      HttpStatus.BAD_GATEWAY
    );
    res.status(HttpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @function saveConversation
 * @async
 * @description Save the conversation between 2 persons in db
 * @param {Array} data
 * @returns Acknowledgement of saving conversations(Boolean)
 */
var saveConversation = async function (data) {
  logger.info("Execution of 'saveConversation' method begins");
  return await db.insert(DATABASE.CONVERSATION, data);
};

/**
 * @httpMethod POST
 * @function chat
 * @async
 * @description Save the conversation of 2 persons
 * @param {Object} req
 * @param {Object} res
 */
module.exports.chat = async function (req, res) {
  /*
    The Chat Conversation is end-end protected with encryption. Hence, the messages will be
    stored in the database are totally encrypted.
    */
  try {
    logger.info("POST /chat begins");
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
        HttpStatus.UNPROCESSABLE_ENTITY,
        "RI_004"
      );
      logger.info(`Invalid Payload with errorList = ${errorList}`);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(response);
    } else {
      var sender = payload.sender;
      var receiver = payload.receiver;
      var message = payload.chatmsg;

      var reason = format(ResponseIds.RI_002, [sender, receiver]);
      var statusCode = HttpStatus.BAD_REQUEST;
      var responseId = "RI_002";

      var data = [sender, receiver, message];
      var jobDone = await saveConversation(data);
      if (jobDone) {
        logger.info("Success status from database");
        reason = format(ResponseIds.RI_003, [sender, receiver]);
        statusCode = HttpStatus.OK;
        responseId = "RI_003";
      } else {
        logger.error("Failure status from database");
      }
      var response = await buildResponse(
        null,
        reason,
        statusCode,
        responseId
      );
      logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
      res.status(statusCode).send(response);
    }
  } catch (ex) {
    logger.error(
      `Exception in POST /chat with msg: ${JSON.stringify(ex, null, 3)}`
    );
    logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
    var response = await buildResponse(
      null,
      "exception",
      HttpStatus.BAD_GATEWAY
    );
    res.status(HttpStatus.BAD_GATEWAY).send(response);
  }
};
