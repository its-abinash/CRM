#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
var logger = require("../Logger/log");

module.exports.rmqPublisher = function (message) {
  amqp.connect(process.env.RMQ_URL, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = "web_chat_topic";
      var key = "web_chat.route_key";
      var msg = JSON.stringify(message);

      channel.assertExchange(exchange, "topic", {
        durable: false,
      });

      channel.publish(exchange, key, Buffer.from(msg));
      logger.info(
        `Message has been published to RMQ exchange: ${exchange}, key: ${key}`
      );
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
};
