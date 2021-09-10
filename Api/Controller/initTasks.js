const rmqConsumer = require("../Broker/consumerUtils");
const logger = require("../Logger/log");

module.exports.run_init_job = async function () {
  try {
    logger.info("Setting up RabbitMQ Server");
    await rmqConsumer.consumeUtil()
    logger.info("RabbitMQ Server is Up & Running...");
  } catch (ex) {
    logger.error(`Error while connecting to RabbitMQ Server: ${ex}`);
  }
};
