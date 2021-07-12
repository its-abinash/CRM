#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
var logger = require("../Logger/log");
var chatService = require("../Controller/chatService");
var chatDao = require("../Controller/chatDao");
var { redisClient, DATABASE } = require("../../Configs/constants.config");
var { AppResponse } = require("../Controller/response_utils");

var massageContent = function (content) {
  content = content.replace(/['"]+/g, '');
  return content;
};

var consumeUtil = async function (message) {
  var AppRes = new AppResponse();
  var payload = chatService.decodeChatRequestPayload(
    AppRes,
    massageContent(message.content.toString())
  );
  logger.info(`ConsumeSync Received: ${JSON.stringify(payload)}`);
  // set notification in redis
  var key = String(payload["sender"]) + "," + String(payload["receiver"]);
  var encKey = AppRes.encryptKeyStable(key);
  logger.info(`Setting notification for key: ${key} in redis`);
  redisClient.setAsync(encKey, true);

  // save chat in DB
  var data = [payload.sender, payload.receiver, payload.chatmsg];
  await chatDao.saveConversation(DATABASE.CONVERSATION, data);
};

var channelUtil = function (error, channel) {
  if (error) {
    throw error;
  }
  var queue = "chat";
  var exchange = "web";
  var exchangeType = "direct";
  channel.assertExchange(exchange, exchangeType, { durable: true });
  channel.assertQueue(queue, { durable: true });
  channel.consume(queue, consumeUtil, { noAck: true });
};

var connectionUtil = function (error, connection) {
  if (error) {
    throw error;
  }
  connection.createChannel(channelUtil);
};

module.exports.consume = function () {
  amqp.connect(process.env.RMQ_URL, connectionUtil);
};
