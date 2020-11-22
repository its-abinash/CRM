var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var session = require("express-session");
var fs = require("fs");
var logger = require("../Logger/log");
var AES = require("crypto-js/aes"); // Advanced Encryption Standard
var CryptoJs = require("crypto-js");
var {
  DATABASE,
  CSS,
  CYPHER,
  STATUSCODE,
} = require("../../Configs/constants.config");

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
exports.getConversation = async function (req, res) {
  /* When fetching Chat Conversations, we have to decrypt the encoded message */
  try {
    logger.info("GET /Chat begins");
    var sender = req.session.user;
    var receiver = req.params.receiverId;
    logger.info(`Sender = \'${sender}\', Receiver = \'${receiver}\'`);
    var chat = await db.fetch(
      DATABASE.CONVERSATION,
      DATABASE.FETCH_SPECIFIC,
      sender,
      receiver
    );
    logger.info(`GET /Chat Data Fetched ===> ${JSON.stringify(chat)}`);
    /* Fetching previous conversation */
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
    logger.info("GET /Chat ends");
    res.status(STATUSCODE.SUCCESS).send({ reason: "success", values: chat });
  } catch (ex) {
    logger.error(`Tracked error in GET /Chat ${JSON.stringify(ex)}`);
    res
      .status(STATUSCODE.BAD_REQUEST)
      .send({ reason: "exception", values: [] });
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
exports.chat = async function (req, res) {
  /*
    The Chat Conversation is end-end protected with encryption. Hence, the messages will be
    stored in the database are totally encrypted.
    */
  try {
    logger.info("POST /chat begins");
    logger.info(`POST /chat ===> body = ${JSON.stringify(req.body)}`);
    var sender = req.session.user;
    var receiver = req.body.email;
    var message = req.body.chatmsg;

    /* Saving current conversation in db */

    var data = [sender, receiver, message];
    logger.info("Calling 'saveConversation' method");
    var jobDone = await saveConversation(data);
    logger.info("Execution of 'saveConversation' method ends");
    if (jobDone === false) {
      logger.error(
        "Failure status from database, so redirecting back to dashboard"
      );
      res.status(STATUSCODE.BAD_REQUEST).send({ reason: "failure" });
    } else {
      logger.info(
        "Success status from database, so redirecting back to dashboard"
      );
      res.status(STATUSCODE.SUCCESS).send({ reason: "success" });
    }
  } catch (ex) {
    logger.error(
      "Exception status from database, so redirecting back to dashboard"
    );
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).send({ reason: "exception" });
  }
};
