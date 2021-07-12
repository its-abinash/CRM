const rmqConsumer = require("../Broker/rmq.consumer");
const logger = require("../Logger/log");

module.exports.run_init_job = async function () {
  try {
    logger.info("Setting up RabbitMQ Server");
    rmqConsumer.consume();
    logger.info("RabbitMQ Server is Up & Running...");
  } catch (ex) {
    logger.error(`Error while connecting to RabbitMQ Server: ${ex}`);
  }
};
