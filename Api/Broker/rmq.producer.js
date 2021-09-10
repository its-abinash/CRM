#!/usr/bin/env node

var amqp = require("amqplib");
const { RMQ_INSTANCE } = require("./rmqConnection");
var logger = require("../Logger/log");

module.exports.rmqPublisher = async function (message) {
  var connection = await RMQ_INSTANCE.getInstance();
  var channel = await connection.createChannel();
  var exchange = "web_chat_topic";
  var key = "web_chat.route_key";
  var msg = JSON.stringify(message);
  await channel.assertExchange(exchange, "topic", { durable: false });
  await channel.publish(exchange, key, Buffer.from(msg));
  logger.info(
    `Message has been published to RMQ exchange: ${exchange}, key: ${key}`
  );
  setTimeout(function () {
    connection.close();
  }, 500);
};

module.exports.publishEmail = async function(message) {
  var connection = await RMQ_INSTANCE.getInstance();
  var channel = await connection.createChannel();
  var exchange = "default";
  var key = "crm_sync.route_key";
  var msg = JSON.stringify(message);
  await channel.assertExchange(exchange, "topic", { durable: false });
  await channel.publish(exchange, key, Buffer.from(msg));
  logger.info(
    `Message has been published to RMQ exchange: ${exchange}, key: ${key}`
  );
  setTimeout(function () {
    connection.close();
  }, 500);
}
