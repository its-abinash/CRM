#!/usr/bin/env node

var amqp = require("amqplib");
const { socket } = require("../../Configs/settings");

var consumeUtil = function (message) {
  var msg = message.content.toString();
  socket.emit("websocket", msg);
};

module.exports.consume = async function () {
  var connection = await amqp.connect(process.env.RMQ_URL);
  var channel = await connection.createChannel();
  var exchange = "web_chat_topic";
  await channel.assertExchange(exchange, "topic", { durable: false });
  var queueObj = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(queueObj.queue, exchange, "web_chat.*");
  await channel.consume(queueObj.queue, consumeUtil, { noAck: true });
};

module.exports.consumeUtil = consumeUtil;
