const { RMQ_INSTANCE } = require("./rmqConnection");
const { RMQ_CONFIGS } = require("./rmqControllers");
const logger = require("../Logger/log");

module.exports.consumeUtil = async function () {
  var connection = await RMQ_INSTANCE.getInstance();
  var channel = await connection.createChannel();
  for (const config of RMQ_CONFIGS) {
    logger.info(`Establishing RMQ connection for purpose: ${config.purpose}`);
    await channel.assertExchange(config.exchangename, config.exchangetype, {
      durable: false,
    });
    await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(
      config.queuename,
      config.exchangename,
      config.routingkey
    );
    logger.info(
      `RMQ connection has been successfully established for purpose: ${config.purpose}`
    );
    await config.consumercallback(config, channel, config.callback);
  }
};
