#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

module.exports.publish = function (msg) {
  amqp.connect(process.env.RMQ_URL, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "chat";
      var exchange = "web";
      channel.assertExchange(exchange, "direct", {
        durable: true,
      });
      channel.assertQueue(queue, {
        durable: true,
      });
      channel.sendToQueue(queue, Buffer.from(msg));

      console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
};
