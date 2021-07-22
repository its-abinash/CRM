#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
var logger = require("../Logger/log");
const { socket } = require("../../Configs/settings");

var consumeUtil = async function (message) {
  var routingKey = message.fields.routingKey;
  var msg = message.content.toString();
  socket.emit("websocket", msg);
};

var connectionUtil = function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = "web_chat_topic";

    channel.assertExchange(exchange, "topic", {
      durable: false,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        channel.bindQueue(q.queue, exchange, "web_chat.*");
        channel.consume(q.queue, consumeUtil, {
          noAck: true,
        });
      }
    );
  });
};

module.exports.consume = function () {
  amqp.connect(process.env.RMQ_URL, connectionUtil);
};
