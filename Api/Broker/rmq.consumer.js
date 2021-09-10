#!/usr/bin/env node
const { socket } = require("../../Configs/settings");

module.exports.consumer = async function (config, channel, callback) {
  await channel.consume(
    config.queuename,
    async function (msg) {
      var message = JSON.parse(msg.content.toString());
      if (callback != null) {
        var response = await callback(message);
        socket.emit(config.socketname, response);
      }else {
        socket.emit(config.socketname, message);
      }
    },
    { noAck: true }
  );
};
